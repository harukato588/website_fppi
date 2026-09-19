import { createClient } from "@supabase/supabase-js";
import { beritaData, Berita, divisiData } from "./config";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface AnggotaItem {
  id?: number | string;
  divisi_id: string;
  nama: string;
  jabatan: string;
  foto: string;
}

/**
 * Mengambil daftar berita dari Supabase.
 * Jika Supabase belum dikonfigurasi atau terjadi error, otomatis fallback ke data lokal config.ts.
 */
export async function getBeritaList(): Promise<Berita[]> {
  if (!supabase) {
    return beritaData;
  }

  try {
    const { data, error } = await supabase
      .from("berita")
      .select("*")
      .order("id", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn("Supabase fetch warning:", error.message);
      }
      return beritaData;
    }

    return data.map((item) => ({
      id: Number(item.id),
      category: item.category,
      title: item.title,
      date: item.date,
      image: item.image,
      slug: item.slug,
      pdfUrl: item.pdf_url || undefined,
    }));
  } catch (err) {
    console.warn("Supabase fetch error, fallback to local data:", err);
    return beritaData;
  }
}

/**
 * Mengambil detail 1 berita berdasarkan slug dari Supabase (atau fallback data lokal).
 */
export async function getBeritaBySlug(slug: string): Promise<Berita | null> {
  if (!supabase) {
    return beritaData.find((b) => b.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("berita")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return beritaData.find((b) => b.slug === slug) || null;
    }

    return {
      id: Number(data.id),
      category: data.category,
      title: data.title,
      date: data.date,
      image: data.image,
      slug: data.slug,
      pdfUrl: data.pdf_url || undefined,
    };
  } catch (err) {
    return beritaData.find((b) => b.slug === slug) || null;
  }
}

/**
 * Mengambil data Anggota berdasarkan Divisi ID dari Supabase (fallback ke config.ts).
 */
export async function getAnggotaByDivisi(divisiId: string): Promise<AnggotaItem[]> {
  const localDiv = divisiData.find((d) => d.id === divisiId);
  const fallbackList: AnggotaItem[] = localDiv
    ? localDiv.anggota.map((a, idx) => ({
        id: `local-${divisiId}-${idx}`,
        divisi_id: divisiId,
        nama: a.nama,
        jabatan: a.jabatan,
        foto: a.foto,
      }))
    : [];

  if (!supabase) return fallbackList;

  try {
    const { data, error } = await supabase
      .from("anggota")
      .select("*")
      .eq("divisi_id", divisiId)
      .order("id", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackList;
    }

    return data.map((item) => ({
      id: item.id,
      divisi_id: item.divisi_id,
      nama: item.nama,
      jabatan: item.jabatan,
      foto: item.foto,
    }));
  } catch (err) {
    console.warn("Supabase fetch anggota error, fallback to local:", err);
    return fallbackList;
  }
}

/**
 * Mengambil SELURUH data anggota (semua divisi) dari Supabase / fallback local.
 */
export async function getAllAnggota(): Promise<AnggotaItem[]> {
  const fallbackList: AnggotaItem[] = [];
  divisiData.forEach((div) => {
    div.anggota.forEach((a, idx) => {
      fallbackList.push({
        id: `local-${div.id}-${idx}`,
        divisi_id: div.id,
        nama: a.nama,
        jabatan: a.jabatan,
        foto: a.foto,
      });
    });
  });

  if (!supabase) return fallbackList;

  try {
    const { data, error } = await supabase
      .from("anggota")
      .select("*")
      .order("id", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackList;
    }

    return data.map((item) => ({
      id: item.id,
      divisi_id: item.divisi_id,
      nama: item.nama,
      jabatan: item.jabatan,
      foto: item.foto,
    }));
  } catch (err) {
    console.warn("Supabase fetch all anggota error, fallback to local:", err);
    return fallbackList;
  }
}

/**
 * Tambah anggota baru ke Supabase.
 */
export async function createAnggota(item: Omit<AnggotaItem, "id">) {
  if (!supabase) {
    throw new Error("Supabase client belum terkonfigurasi di env.");
  }
  const { data, error } = await supabase.from("anggota").insert([item]).select();
  if (error) throw error;
  return data;
}

/**
 * Update data / foto anggota di Supabase.
 */
export async function updateAnggota(id: number | string, item: Partial<AnggotaItem>) {
  if (!supabase) {
    throw new Error("Supabase client belum terkonfigurasi di env.");
  }
  const { data, error } = await supabase
    .from("anggota")
    .update(item)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data;
}

/**
 * Hapus anggota dari Supabase.
 */
export async function deleteAnggota(id: number | string) {
  if (!supabase) {
    throw new Error("Supabase client belum terkonfigurasi di env.");
  }
  const { data, error } = await supabase.from("anggota").delete().eq("id", id);
  if (error) throw error;
  return data;
}

/**
 * Upload file dari browser ke Supabase Storage Bucket ('images' atau 'dokumen')
 * dan mengembalikan URL Publik file tersebut.
 */
export async function uploadFileToSupabase(
  file: File,
  bucketName: "images" | "dokumen" = "images"
): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase client belum terkonfigurasi di env.");
  }

  const fileExt = file.name.split(".").pop() || "png";
  const cleanBase = file.name.substring(0, file.name.lastIndexOf(".")).replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `${Date.now()}_${cleanBase}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Storage upload error:", error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}


