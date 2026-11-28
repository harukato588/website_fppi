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

export interface BeritaItem {
  id?: number | string;
  category: string;
  title: string;
  date: string;
  image: string;
  slug: string;
  pdf_url?: string;
  pdfUrl?: string;
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
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn("Supabase fetch warning:", error.message);
      }
      return beritaData;
    }

    return data.map((item) => ({
      id: (!isNaN(Number(item.id)) && String(item.id).trim() !== "") ? Number(item.id) : String(item.id),
      category: item.kategori || item.category || "Jurnal Ilmiah",
      title: item.judul || item.title || "Tanpa Judul",
      date: item.tanggal || item.date || "",
      image: item.image || "",
      slug: item.slug || "",
      pdf_url: item.pdf_url || undefined,
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
      id: (!isNaN(Number(data.id)) && String(data.id).trim() !== "") ? Number(data.id) : String(data.id),
      category: data.kategori || data.category || "Jurnal Ilmiah",
      title: data.judul || data.title || "Tanpa Judul",
      date: data.tanggal || data.date || "",
      image: data.image || "",
      slug: data.slug || "",
      pdf_url: data.pdf_url || undefined,
      pdfUrl: data.pdf_url || undefined,
    };
  } catch (err) {
    return beritaData.find((b) => b.slug === slug) || null;
  }
}

/**
 * Deteksi skema kolom aktual tabel berita di Supabase.
 * Mengembalikan 'indonesia' jika menggunakan kolom judul/kategori/tanggal,
 * atau 'english' jika menggunakan title/category/date.
 */
let _beritaSchemaCache: "indonesia" | "english" | null = null;

async function detectBeritaSchema(): Promise<"indonesia" | "english"> {
  if (_beritaSchemaCache) return _beritaSchemaCache;
  if (!supabase) return "indonesia";
  // Ambil 1 baris untuk memeriksa nama kolom
  const { data, error } = await supabase.from("berita").select("*").limit(1);
  if (!error && data && data.length > 0) {
    const cols = Object.keys(data[0]);
    _beritaSchemaCache = cols.includes("judul") ? "indonesia" : "english";
  } else {
    // Jika tabel kosong, coba insert probe kosong dan lihat error — atau default ke Indonesia
    _beritaSchemaCache = "indonesia";
  }
  return _beritaSchemaCache;
}

function buildBeritaPayload(
  schema: "indonesia" | "english",
  item: Partial<BeritaItem> & { title?: string; category?: string; date?: string }
): Record<string, any> {
  if (schema === "indonesia") {
    const p: Record<string, any> = {};
    if (item.title !== undefined) p.judul = item.title;
    if (item.category !== undefined) p.kategori = item.category;
    if (item.date !== undefined) p.tanggal = item.date;
    if (item.image !== undefined) p.image = item.image;
    if (item.slug !== undefined) p.slug = item.slug;
    if (item.pdf_url !== undefined || item.pdfUrl !== undefined)
      p.pdf_url = item.pdf_url || item.pdfUrl || null;
    return p;
  } else {
    const p: Record<string, any> = {};
    if (item.title !== undefined) p.title = item.title;
    if (item.category !== undefined) p.category = item.category;
    if (item.date !== undefined) p.date = item.date;
    if (item.image !== undefined) p.image = item.image;
    if (item.slug !== undefined) p.slug = item.slug;
    if (item.pdf_url !== undefined || item.pdfUrl !== undefined)
      p.pdf_url = item.pdf_url || item.pdfUrl || null;
    return p;
  }
}

/**
 * Tambah berita / dokumen jurnal baru ke Supabase.
 * Auto-deteksi skema kolom Indonesia vs Inggris.
 */
export async function createBerita(item: Omit<BeritaItem, "id">) {
  if (!supabase) {
    throw new Error("Supabase client belum terkonfigurasi di env.");
  }
  const schema = await detectBeritaSchema();
  const payload = buildBeritaPayload(schema, item);
  const { data, error } = await supabase.from("berita").insert([payload]).select();
  if (error) {
    // Jika schema cache salah, coba skema sebaliknya
    _beritaSchemaCache = schema === "indonesia" ? "english" : "indonesia";
    const retryPayload = buildBeritaPayload(_beritaSchemaCache, item);
    const retry = await supabase.from("berita").insert([retryPayload]).select();
    if (retry.error) {
      _beritaSchemaCache = null; // reset cache agar deteksi ulang
      throw retry.error;
    }
    return retry.data;
  }
  return data;
}

/**
 * Update berita / dokumen jurnal di Supabase.
 * Auto-deteksi skema kolom Indonesia vs Inggris.
 */
export async function updateBerita(id: number | string, item: Partial<BeritaItem>) {
  if (!supabase) {
    throw new Error("Supabase client belum terkonfigurasi di env.");
  }
  const schema = await detectBeritaSchema();
  const payload = buildBeritaPayload(schema, item);

  const { data, error } = await supabase
    .from("berita")
    .update(payload)
    .eq("id", id)
    .select();

  if (error) {
    // Jika schema cache salah, coba skema sebaliknya
    _beritaSchemaCache = schema === "indonesia" ? "english" : "indonesia";
    const retryPayload = buildBeritaPayload(_beritaSchemaCache, item);
    const retry = await supabase
      .from("berita")
      .update(retryPayload)
      .eq("id", id)
      .select();
    if (retry.error) {
      _beritaSchemaCache = null;
      throw retry.error;
    }
    return retry.data;
  }
  return data;
}

/**
 * Hapus berita / dokumen jurnal dari Supabase.
 */
export async function deleteBerita(id: number | string) {
  if (!supabase) {
    throw new Error("Supabase client belum terkonfigurasi di env.");
  }
  const { data, error } = await supabase.from("berita").delete().eq("id", id);
  if (error) throw error;
  return data;
}

/**
 * Impor data awal berita bawaan (config.ts) ke Supabase.
 * Auto-deteksi skema kolom Indonesia vs Inggris.
 */
export async function seedBeritaLocalData() {
  if (!supabase) {
    throw new Error("Supabase client belum terkonfigurasi di env.");
  }
  const schema = await detectBeritaSchema();
  const itemsToInsert = beritaData.map((b) =>
    buildBeritaPayload(schema, {
      title: b.title,
      category: b.category,
      date: b.date,
      image: b.image,
      slug: b.slug,
      pdf_url: (b as any).pdfUrl || undefined,
    })
  );
  const { data, error } = await supabase.from("berita").insert(itemsToInsert).select();
  if (error) {
    // Balik skema dan coba lagi
    _beritaSchemaCache = schema === "indonesia" ? "english" : "indonesia";
    const fallbackItems = beritaData.map((b) =>
      buildBeritaPayload(_beritaSchemaCache!, {
        title: b.title,
        category: b.category,
        date: b.date,
        image: b.image,
        slug: b.slug,
        pdf_url: (b as any).pdfUrl || undefined,
      })
    );
    const retry = await supabase.from("berita").insert(fallbackItems).select();
    if (retry.error) {
      _beritaSchemaCache = null;
      throw retry.error;
    }
    return retry.data;
  }
  return data;
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

  const fileExt = file.name.split(".").pop()?.toLowerCase() || "png";
  const cleanBase = file.name.substring(0, file.name.lastIndexOf(".")).replace(/[^a-zA-Z0-9]/g, "_");
  const fileName = `${Date.now()}_${cleanBase}.${fileExt}`;

  let contentType = file.type;
  if (!contentType) {
    if (fileExt === "pdf") contentType = "application/pdf";
    else if (fileExt === "doc") contentType = "application/msword";
    else if (fileExt === "docx") contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    else if (["jpg", "jpeg"].includes(fileExt)) contentType = "image/jpeg";
    else if (fileExt === "png") contentType = "image/png";
    else if (fileExt === "webp") contentType = "image/webp";
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      contentType: contentType || undefined,
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


