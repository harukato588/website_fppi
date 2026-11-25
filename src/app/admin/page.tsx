"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { divisiData, beritaData } from "@/lib/config";
import {
  getAllAnggota,
  createAnggota,
  updateAnggota,
  deleteAnggota,
  AnggotaItem,
  getBeritaList,
  createBerita,
  updateBerita,
  deleteBerita,
  seedBeritaLocalData,
  BeritaItem,
  uploadFileToSupabase,
  supabase,
} from "@/lib/supabase";
import { isValidHttpOrRelativeUrl as isValidUrl, sanitizeInput as sanitizeText } from "@/lib/validation";
import styles from "./page.module.css";

// Format tanggal saat ini ke bahasa Indonesia
function getFormattedCurrentDate(): string {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const now = new Date();
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

// Generate URL slug dari judul
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Validasi MIME type file gambar
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_DOC_SIZE_MB = 35;

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Tab Utama Admin: 'anggota' vs 'berita'
  const [activeSection, setActiveSection] = useState<"anggota" | "berita">("berita");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ==========================================
  // STATE MANAJEMEN ANGGOTA
  // ==========================================
  const [anggotaList, setAnggotaList] = useState<AnggotaItem[]>([]);
  const [loadingAnggota, setLoadingAnggota] = useState(false);
  const [selectedDivisi, setSelectedDivisi] = useState("semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnggotaItem | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    jabatan: "Anggota",
    divisi_id: "pengurus-harian",
    foto: "",
  });
  const [submittingAnggota, setSubmittingAnggota] = useState(false);
  const [formError, setFormError] = useState("");
  const [seedingAnggota, setSeedingAnggota] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // ==========================================
  // STATE MANAJEMEN BERITA & DOKUMEN JURNAL
  // ==========================================
  const [beritaList, setBeritaList] = useState<BeritaItem[]>([]);
  const [loadingBerita, setLoadingBerita] = useState(false);
  const [beritaCategoryFilter, setBeritaCategoryFilter] = useState("semua");
  const [beritaSearch, setBeritaSearch] = useState("");
  const [isBeritaModalOpen, setIsBeritaModalOpen] = useState(false);
  const [editingBerita, setEditingBerita] = useState<BeritaItem | null>(null);
  const [beritaFormData, setBeritaFormData] = useState({
    title: "",
    category: "Jurnal Ilmiah",
    date: "",
    image: "",
    slug: "",
    pdf_url: "",
  });
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingBeritaImage, setUploadingBeritaImage] = useState(false);
  const [beritaSubmitting, setBeritaSubmitting] = useState(false);
  const [beritaFormError, setBeritaFormError] = useState("");
  const [seedingBerita, setSeedingBerita] = useState(false);

  // Check stored server-side HttpOnly session
  useEffect(() => {
    // Hapus sisa token lama di localStorage jika ada
    localStorage.removeItem("fppi_admin_auth");
    localStorage.removeItem("fppi_admin_auth_ts");

    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, []);

  // Fetch data
  const loadDataAnggota = async () => {
    setLoadingAnggota(true);
    try {
      const res = await getAllAnggota();
      setAnggotaList(res);
    } catch (err) {
      console.error("Gagal mengambil data anggota:", err);
    } finally {
      setLoadingAnggota(false);
    }
  };

  const loadDataBerita = async () => {
    setLoadingBerita(true);
    try {
      const res = await getBeritaList();
      setBeritaList(res as BeritaItem[]);
    } catch (err) {
      console.error("Gagal mengambil data berita/dokumen:", err);
    } finally {
      setLoadingBerita(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDataAnggota();
      loadDataBerita();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();

      if (res.ok && data?.authenticated) {
        setIsAuthenticated(true);
        setPinInput("");
        setAuthError("");
      } else {
        setAuthError(data?.error || "PIN yang Anda masukkan salah!");
      }
    } catch {
      setAuthError("Gagal terhubung ke server autentikasi.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } finally {
      setIsAuthenticated(false);
      setPinInput("");
    }
  };

  // ==========================================
  // HANDLERS ANGGOTA
  // ==========================================
  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      nama: "",
      jabatan: "Anggota",
      divisi_id: selectedDivisi !== "semua" ? selectedDivisi : "pengurus-harian",
      foto: "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: AnggotaItem) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama || "",
      jabatan: item.jabatan || "",
      divisi_id: item.divisi_id || "pengurus-harian",
      foto: item.foto || "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFormError(`Tipe file tidak diizinkan: ${file.type || "unknown"}. Gunakan JPEG, PNG, WebP, atau GIF.`);
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setFormError(`Ukuran file terlalu besar. Maksimal ${MAX_IMAGE_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setUploadingImage(true);
    setFormError("");
    try {
      const publicUrl = await uploadFileToSupabase(file, "images");
      setFormData((prev) => ({ ...prev, foto: publicUrl }));
      setFormError("");
    } catch (err: any) {
      console.warn("Gagal upload ke Supabase Storage, fallback preview lokal:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, foto: reader.result as string }));
      };
      reader.readAsDataURL(file);
      setFormError("Catatan: File disimpan sebagai preview lokal. Pastikan Bucket 'images' (Public) aktif di Supabase.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const safeName = sanitizeText(formData.nama);
    const safeJabatan = sanitizeText(formData.jabatan);
    const safeDivisi = formData.divisi_id;
    const safeFoto = formData.foto.trim();

    if (!safeName || !safeJabatan || !safeFoto) {
      setFormError("Mohon lengkapi seluruh field!");
      return;
    }
    if (safeName.length < 2) {
      setFormError("Nama terlalu pendek (minimal 2 karakter).");
      return;
    }
    if (!isValidUrl(safeFoto)) {
      setFormError("URL foto tidak valid. Gunakan URL https:// atau path relatif yang valid.");
      return;
    }

    setSubmittingAnggota(true);
    setFormError("");

    try {
      if (editingItem && editingItem.id && !String(editingItem.id).startsWith("local-")) {
        await updateAnggota(editingItem.id, {
          nama: safeName,
          jabatan: safeJabatan,
          divisi_id: safeDivisi,
          foto: safeFoto,
        });
      } else {
        await createAnggota({
          nama: safeName,
          jabatan: safeJabatan,
          divisi_id: safeDivisi,
          foto: safeFoto,
        });
      }

      setIsModalOpen(false);
      await loadDataAnggota();
      showToast(editingItem ? "Data anggota berhasil diperbarui!" : "Anggota baru berhasil ditambahkan!");
    } catch (err: any) {
      setFormError("Gagal menyimpan ke Supabase: " + (err.message || String(err)));
    } finally {
      setSubmittingAnggota(false);
    }
  };

  const handleDelete = async (item: AnggotaItem) => {
    if (!confirm(`Yakin ingin menghapus anggota ${item.nama}?`)) return;

    if (String(item.id).startsWith("local-")) {
      alert("Item data lokal tidak dapat dihapus permanen dari Supabase. Silakan gunakan tombol 'Impor Data Bawaan' terlebih dahulu.");
      return;
    }

    try {
      await deleteAnggota(item.id!);
      await loadDataAnggota();
      showToast(`Anggota ${item.nama} berhasil dihapus.`);
    } catch (err: any) {
      alert("Gagal menghapus: " + (err.message || String(err)));
    }
  };

  const handleSeedLocalData = async () => {
    if (!supabase) {
      alert("Supabase client belum terhubung. Pastikan env terkonfigurasi!");
      return;
    }

    if (!confirm("Apakah Anda yakin ingin mengimpor seluruh data anggota bawaan (config.ts) ke database Supabase?")) {
      return;
    }

    setSeedingAnggota(true);
    try {
      const itemsToInsert: Omit<AnggotaItem, "id">[] = [];
      divisiData.forEach((div) => {
        div.anggota.forEach((a) => {
          itemsToInsert.push({
            divisi_id: div.id,
            nama: a.nama,
            jabatan: a.jabatan,
            foto: a.foto,
          });
        });
      });

      const { error } = await supabase.from("anggota").insert(itemsToInsert);
      if (error) throw error;

      showToast("Berhasil mengimpor seluruh data anggota ke Supabase!");
      await loadDataAnggota();
    } catch (err: any) {
      alert("Gagal mengimpor data: " + (err.message || String(err)));
    } finally {
      setSeedingAnggota(false);
    }
  };

  // ==========================================
  // HANDLERS BERITA & DOKUMEN JURNAL
  // ==========================================
  const openAddBeritaModal = () => {
    setEditingBerita(null);
    setBeritaFormData({
      title: "",
      category: "Jurnal Ilmiah",
      date: getFormattedCurrentDate(),
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=70",
      slug: "",
      pdf_url: "",
    });
    setIsCustomCategory(false);
    setCustomCategory("");
    setBeritaFormError("");
    setIsBeritaModalOpen(true);
  };

  const openEditBeritaModal = (item: BeritaItem) => {
    setEditingBerita(item);
    const standardCategories = ["Jurnal Ilmiah", "Karya Tulis Ilmiah", "Proposal PKM", "Kompetisi", "Kegiatan", "Prestasi", "Pengumuman"];
    const isCustom = !standardCategories.includes(item.category);

    setBeritaFormData({
      title: item.title || "",
      category: isCustom ? "Lainnya" : item.category,
      date: item.date || getFormattedCurrentDate(),
      image: item.image || "",
      slug: item.slug || "",
      pdf_url: item.pdf_url || item.pdfUrl || "",
    });
    setIsCustomCategory(isCustom);
    setCustomCategory(isCustom ? item.category : "");
    setBeritaFormError("");
    setIsBeritaModalOpen(true);
  };

  // Upload file dokumen (PDF/DOC) ke bucket 'dokumen'
  const handleDocFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = "." + (file.name.split(".").pop()?.toLowerCase() || "");
    const allowedDocExts = [".pdf", ".doc", ".docx"];

    if (!allowedDocExts.includes(fileExt) && file.type !== "application/pdf") {
      setBeritaFormError(`Format file ${fileExt} tidak didukung. Harap upload dokumen PDF (.pdf) atau Word (.doc, .docx).`);
      e.target.value = "";
      return;
    }

    if (file.size > MAX_DOC_SIZE_MB * 1024 * 1024) {
      setBeritaFormError(`Ukuran dokumen terlalu besar. Maksimal ${MAX_DOC_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setUploadingDoc(true);
    setBeritaFormError("");

    try {
      const publicUrl = await uploadFileToSupabase(file, "dokumen");
      setBeritaFormData((prev) => {
        const autoTitle = prev.title.trim() === ""
          ? file.name.substring(0, file.name.lastIndexOf(".")).replace(/[_-]/g, " ")
          : prev.title;
        return {
          ...prev,
          pdf_url: publicUrl,
          title: autoTitle,
          slug: prev.slug || generateSlug(autoTitle),
        };
      });
      setBeritaFormError("");
    } catch (err: any) {
      console.warn("Upload dokumen ke Supabase gagal:", err);
      setBeritaFormError("Gagal upload ke Supabase Storage Bucket 'dokumen'. Pastikan Bucket 'dokumen' (Public) sudah dibuat di Supabase Dashboard Storage.");
    } finally {
      setUploadingDoc(false);
    }
  };

  // Upload gambar thumbnail/cover untuk berita/jurnal ke bucket 'images'
  const handleBeritaImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setBeritaFormError("Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setBeritaFormError(`Ukuran foto maksimal ${MAX_IMAGE_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setUploadingBeritaImage(true);
    setBeritaFormError("");

    try {
      const publicUrl = await uploadFileToSupabase(file, "images");
      setBeritaFormData((prev) => ({ ...prev, image: publicUrl }));
    } catch (err: any) {
      console.warn("Upload foto cover gagal:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBeritaFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
      setBeritaFormError("Catatan: Foto disimpan secara preview lokal.");
    } finally {
      setUploadingBeritaImage(false);
    }
  };

  const handleBeritaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const safeTitle = sanitizeText(beritaFormData.title);
    const finalCategory = isCustomCategory ? sanitizeText(customCategory) : beritaFormData.category;
    const safeDate = sanitizeText(beritaFormData.date) || getFormattedCurrentDate();
    const safeImage = beritaFormData.image.trim() || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=70";
    const safeSlug = beritaFormData.slug.trim() || generateSlug(safeTitle);
    const safePdfUrl = beritaFormData.pdf_url.trim();

    if (!safeTitle) {
      setBeritaFormError("Judul dokumen atau berita wajib diisi!");
      return;
    }
    if (!finalCategory) {
      setBeritaFormError("Kategori wajib dipilih atau diisi!");
      return;
    }
    if (!isValidUrl(safeImage)) {
      setBeritaFormError("URL cover/gambar tidak valid. Gunakan URL https:// atau path relatif.");
      return;
    }
    if (safePdfUrl && !isValidUrl(safePdfUrl)) {
      setBeritaFormError("URL dokumen PDF tidak valid. Gunakan URL https:// atau path relatif.");
      return;
    }

    setBeritaSubmitting(true);
    setBeritaFormError("");

    try {
      if (editingBerita && editingBerita.id && !String(editingBerita.id).startsWith("local-")) {
        await updateBerita(editingBerita.id, {
          title: safeTitle,
          category: finalCategory,
          date: safeDate,
          image: safeImage,
          slug: safeSlug,
          pdf_url: safePdfUrl || undefined,
        });
      } else {
        await createBerita({
          title: safeTitle,
          category: finalCategory,
          date: safeDate,
          image: safeImage,
          slug: safeSlug,
          pdf_url: safePdfUrl || undefined,
        });
      }

      setIsBeritaModalOpen(false);
      await loadDataBerita();
      showToast(editingBerita ? "Dokumen/berita berhasil diperbarui!" : "Dokumen jurnal/berita baru berhasil dipublikasikan!");
    } catch (err: any) {
      setBeritaFormError("Gagal menyimpan ke Supabase: " + (err.message || String(err)));
    } finally {
      setBeritaSubmitting(false);
    }
  };

  const handleDeleteBerita = async (item: BeritaItem) => {
    if (!confirm(`Yakin ingin menghapus dokumen/berita "${item.title}"?`)) return;

    if (String(item.id).startsWith("local-") || typeof item.id === "number" && item.id <= 6 && !supabase) {
      alert("Data bawaan lokal tidak dapat dihapus jika belum disinkronkan ke Supabase.");
      return;
    }

    try {
      await deleteBerita(item.id!);
      await loadDataBerita();
      showToast("Dokumen/berita berhasil dihapus.");
    } catch (err: any) {
      alert("Gagal menghapus: " + (err.message || String(err)));
    }
  };

  const handleSeedBerita = async () => {
    if (!supabase) {
      alert("Supabase client belum terhubung. Pastikan env terkonfigurasi!");
      return;
    }

    if (!confirm("Apakah Anda yakin ingin mengimpor seluruh data berita & dokumen bawaan ke database Supabase?")) {
      return;
    }

    setSeedingBerita(true);
    try {
      await seedBeritaLocalData();
      showToast("Berhasil mengimpor daftar berita dan proposal bawaan ke Supabase!");
      await loadDataBerita();
    } catch (err: any) {
      alert("Gagal mengimpor data berita: " + (err.message || String(err)));
    } finally {
      setSeedingBerita(false);
    }
  };

  // Filter List Anggota
  const filteredAnggotaList =
    selectedDivisi === "semua"
      ? anggotaList
      : anggotaList.filter((item) => item.divisi_id === selectedDivisi);

  // Filter List Berita & Dokumen
  const filteredBeritaList = beritaList.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(beritaSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(beritaSearch.toLowerCase());

    if (!matchSearch) return false;

    if (beritaCategoryFilter === "semua") return true;
    if (beritaCategoryFilter === "jurnal") {
      return item.category.toLowerCase().includes("jurnal") || item.category.toLowerCase().includes("karya");
    }
    if (beritaCategoryFilter === "proposal") {
      return item.category.toLowerCase().includes("proposal") || item.category.toLowerCase().includes("pkm");
    }
    if (beritaCategoryFilter === "kegiatan") {
      return item.category.toLowerCase().includes("kegiatan") || item.category.toLowerCase().includes("diskusi");
    }
    if (beritaCategoryFilter === "prestasi") {
      return item.category.toLowerCase().includes("prestasi") || item.category.toLowerCase().includes("pengumuman");
    }
    return true;
  });

  // Hitung statistik ringkas untuk berita/dokumen
  const totalBerita = beritaList.length;
  const totalDokumenPdf = beritaList.filter((b) => Boolean(b.pdf_url || b.pdfUrl)).length;
  const totalJurnal = beritaList.filter((b) => (b.category || "").toLowerCase().includes("jurnal")).length;

  if (checkingAuth) {
    return (
      <div className={styles.authWrap}>
        <div className={styles.authCard}>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>Memverifikasi sesi admin...</p>
        </div>
      </div>
    );
  }

  // Jika Belum Auth
  if (!isAuthenticated) {
    return (
      <div className={styles.authWrap}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Admin FPPI</h1>
          <p className={styles.authSub}>Masukkan PIN Admin untuk mengakses Panel Manajemen</p>
          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>PIN Akses Admin</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Masukkan PIN masuk"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
              />
            </div>
            {authError && <p style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: 16 }}>{authError}</p>}
            <button type="submit" disabled={loggingIn} className={styles.primaryBtn}>
              {loggingIn ? "Memverifikasi..." : "Masuk Dashboard"}
            </button>
          </form>
          <div style={{ marginTop: 24 }}>
            <Link href="/" style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          Dashboard Admin
          <span className={styles.badge}>FPPI Management</span>
        </div>
        <div className={styles.headerActions}>
          <Link href="/" className={styles.outlineBtn} title="Buka Beranda Website">
            🏠 Beranda
          </Link>
          <Link href="/berita" className={styles.outlineBtn} title="Buka Halaman Berita & Jurnal">
            📰 Berita &amp; Jurnal
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Keluar
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className={styles.main}>
        {/* NAVIGASI UTAMA DASHBOARD (TAB ANGGOTA vs BERITA & DOKUMEN) */}
        <div className={styles.sectionNav}>
          <button
            className={`${styles.sectionNavBtn} ${activeSection === "berita" ? styles.sectionNavBtnActive : ""}`}
            onClick={() => setActiveSection("berita")}
          >
            📚 Berita &amp; Dokumen Jurnal ({beritaList.length})
          </button>
          <button
            className={`${styles.sectionNavBtn} ${activeSection === "anggota" ? styles.sectionNavBtnActive : ""}`}
            onClick={() => setActiveSection("anggota")}
          >
            👥 Kelola Anggota ({anggotaList.length})
          </button>
        </div>

        {/* ======================================================== */}
        {/* SECTION 1: KELOLA BERITA & DOKUMEN JURNAL (FITUR BARU) */}
        {/* ======================================================== */}
        {activeSection === "berita" && (
          <div>
            {/* STATS OVERVIEW */}
            <div className={styles.statGrid}>
              <div className={styles.statCard}>
                <span className={styles.statNum}>{totalBerita}</span>
                <span className={styles.statLabel}>Total Berita &amp; Artikel</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum} style={{ color: "#10b981" }}>{totalDokumenPdf}</span>
                <span className={styles.statLabel}>Dokumen / PDF Terlampir</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum} style={{ color: "#818cf8" }}>{totalJurnal}</span>
                <span className={styles.statLabel}>Jurnal &amp; Karya Ilmiah</span>
              </div>
            </div>

            {/* TOP CONTROLS */}
            <div className={styles.topControls}>
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 4 }}>
                  Kelola Berita, Dokumen &amp; Jurnal Ilmiah
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                  Upload dokumen PDF (jurnal riset, karya ilmiah, proposal PKM) dan publikasikan ke website FPPI.
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <button
                  onClick={handleSeedBerita}
                  disabled={seedingBerita}
                  className={styles.outlineBtn}
                  title="Salin data berita bawaan lokal ke database Supabase"
                >
                  {seedingBerita ? "Mengimpor..." : "⚡ Impor Berita Bawaan ke Supabase"}
                </button>
                <button onClick={openAddBeritaModal} className={styles.primaryBtn} style={{ width: "auto" }}>
                  + Tambah Dokumen / Berita
                </button>
              </div>
            </div>

            {/* SEARCH & FILTER BAR */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${beritaCategoryFilter === "semua" ? styles.tabActive : ""}`}
                  onClick={() => setBeritaCategoryFilter("semua")}
                >
                  Semua ({beritaList.length})
                </button>
                <button
                  className={`${styles.tab} ${beritaCategoryFilter === "jurnal" ? styles.tabActive : ""}`}
                  onClick={() => setBeritaCategoryFilter("jurnal")}
                >
                  📚 Jurnal &amp; Karya Ilmiah
                </button>
                <button
                  className={`${styles.tab} ${beritaCategoryFilter === "proposal" ? styles.tabActive : ""}`}
                  onClick={() => setBeritaCategoryFilter("proposal")}
                >
                  💡 Proposal PKM
                </button>
                <button
                  className={`${styles.tab} ${beritaCategoryFilter === "kegiatan" ? styles.tabActive : ""}`}
                  onClick={() => setBeritaCategoryFilter("kegiatan")}
                >
                  📢 Kegiatan &amp; Berita
                </button>
                <button
                  className={`${styles.tab} ${beritaCategoryFilter === "prestasi" ? styles.tabActive : ""}`}
                  onClick={() => setBeritaCategoryFilter("prestasi")}
                >
                  🏆 Prestasi &amp; Info
                </button>
              </div>

              <div className={styles.searchBox}>
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Cari judul berita/jurnal..."
                  value={beritaSearch}
                  onChange={(e) => setBeritaSearch(e.target.value)}
                />
              </div>
            </div>

            {/* GRID DOKUMEN & BERITA */}
            {loadingBerita ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
                Memuat data berita &amp; dokumen...
              </div>
            ) : filteredBeritaList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
                Tidak ada dokumen atau berita yang ditemukan.
              </div>
            ) : (
              <div className={styles.grid}>
                {filteredBeritaList.map((item, idx) => {
                  const hasPdf = Boolean(item.pdf_url || item.pdfUrl);
                  const pdfLink = (item.pdf_url || item.pdfUrl) as string;
                  const isJurnal = item.category.toLowerCase().includes("jurnal");

                  return (
                    <div key={item.id || idx} className={styles.card}>
                      <div className={styles.cardMedia}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className={styles.cardImg}
                          onError={(e) => {
                            (e.target as HTMLElement).setAttribute(
                              "src",
                              "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=70"
                            );
                          }}
                        />
                        <span className={styles.cardDivisiBadge}>
                          {item.category}
                        </span>
                        {hasPdf && (
                          <span className={styles.docBadge}>
                            {isJurnal ? "📚 JURNAL PDF" : "📄 PDF DOKUMEN"}
                          </span>
                        )}
                      </div>
                      <div className={styles.cardBody}>
                        <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: 6 }}>
                          📅 {item.date}
                        </div>
                        <div className={styles.cardName} style={{ fontSize: "0.98rem", lineHeight: 1.4 }}>
                          {item.title}
                        </div>

                        {hasPdf && (
                          <div style={{ marginTop: 10, marginBottom: 8 }}>
                            <a
                              href={pdfLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#38bdf8",
                                fontSize: "0.8rem",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                textDecoration: "underline",
                              }}
                            >
                              🔍 Pratinjau Dokumen PDF ↗
                            </a>
                          </div>
                        )}

                        <div className={styles.cardFooter}>
                          <button onClick={() => openEditBeritaModal(item)} className={styles.editBtn}>
                            ✏️ Edit Dokumen
                          </button>
                          <button onClick={() => handleDeleteBerita(item)} className={styles.delBtn}>
                            🗑️ Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 2: KELOLA ANGGOTA & PENGURUS */}
        {/* ======================================================== */}
        {activeSection === "anggota" && (
          <div>
            <div className={styles.topControls}>
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 4 }}>
                  Kelola Foto &amp; Data Anggota
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                  Tambah, edit foto, atau ubah jabatan anggota divisi FPPI secara langsung.
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={handleSeedLocalData}
                  disabled={seedingAnggota}
                  className={styles.outlineBtn}
                  title="Salin data bawaan lokal ke database Supabase"
                >
                  {seedingAnggota ? "Mengimpor..." : "⚡ Impor Data Bawaan ke Supabase"}
                </button>
                <button onClick={openAddModal} className={styles.primaryBtn} style={{ width: "auto" }}>
                  + Tambah Anggota
                </button>
              </div>
            </div>

            {/* TABS DIVISI */}
            <div className={styles.tabs} style={{ marginBottom: 20 }}>
              <button
                className={`${styles.tab} ${selectedDivisi === "semua" ? styles.tabActive : ""}`}
                onClick={() => setSelectedDivisi("semua")}
              >
                Semua Divisi ({anggotaList.length})
              </button>
              {divisiData.map((div) => {
                const count = anggotaList.filter((a) => a.divisi_id === div.id).length;
                return (
                  <button
                    key={div.id}
                    className={`${styles.tab} ${selectedDivisi === div.id ? styles.tabActive : ""}`}
                    onClick={() => setSelectedDivisi(div.id)}
                  >
                    {div.nama} ({count})
                  </button>
                );
              })}
            </div>

            {/* GRID ANGGOTA */}
            {loadingAnggota ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
                Memuat data anggota dari database...
              </div>
            ) : filteredAnggotaList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
                Belum ada data anggota pada kategori ini.
              </div>
            ) : (
              <div className={styles.grid}>
                {filteredAnggotaList.map((item, idx) => {
                  const divObj = divisiData.find((d) => d.id === item.divisi_id);
                  const isLocalOnly = String(item.id).startsWith("local-");
                  return (
                    <div key={item.id || idx} className={styles.card}>
                      <div className={styles.cardMedia}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.foto}
                          alt={item.nama}
                          className={styles.cardImg}
                          onError={(e) => {
                            (e.target as HTMLElement).setAttribute(
                              "src",
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=70"
                            );
                          }}
                        />
                        <span className={styles.cardDivisiBadge}>
                          {divObj ? divObj.nama : item.divisi_id}
                        </span>
                      </div>
                      <div className={styles.cardBody}>
                        <div className={styles.cardName}>{item.nama}</div>
                        <div className={styles.cardJabatan}>{item.jabatan}</div>
                        {isLocalOnly && (
                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: "#f59e0b",
                              background: "rgba(245, 158, 11, 0.1)",
                              padding: "2px 6px",
                              borderRadius: 4,
                              marginBottom: 8,
                              display: "inline-block",
                            }}
                          >
                            📌 Data Bawaan (Belum disinkron ke Supabase)
                          </span>
                        )}
                        <div className={styles.cardFooter}>
                          <button onClick={() => openEditModal(item)} className={styles.editBtn}>
                            ✏️ Edit Foto / Data
                          </button>
                          <button onClick={() => handleDelete(item)} className={styles.delBtn}>
                            🗑️ Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL FORM ADD / EDIT ANGGOTA */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingItem ? "Edit Data & Foto Anggota" : "Tambah Anggota Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {formData.foto && (
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.foto} alt="Preview" className={styles.photoPreview} />
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.label}>Nama Anggota</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Contoh: Budi Santoso"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Jabatan</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Contoh: Ketua Umum / Anggota"
                  value={formData.jabatan}
                  onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Divisi</label>
                <select
                  className={styles.select}
                  value={formData.divisi_id}
                  onChange={(e) => setFormData({ ...formData, divisi_id: e.target.value })}
                >
                  {divisiData.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>URL Foto Anggota</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Contoh: /image/nama.jpg atau https://..."
                  value={formData.foto}
                  onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Atau Upload Foto dari Komputer</label>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.input}
                  onChange={handleImageFileChange}
                />
                {uploadingImage && (
                  <p style={{ color: "#38bdf8", fontSize: "0.85rem", marginTop: 4 }}>
                    ⏳ Meng-upload foto ke Supabase Storage Bucket &apos;images&apos;...
                  </p>
                )}
              </div>

              {formError && (
                <p style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: 16 }}>
                  {formError}
                </p>
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.outlineBtn}
                  style={{ flex: 1 }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingAnggota}
                  className={styles.primaryBtn}
                  style={{ flex: 1 }}
                >
                  {submittingAnggota ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL FORM ADD / EDIT DOKUMEN & JURNAL (FITUR UTAMA BARU) */}
      {/* ======================================================== */}
      {isBeritaModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.modalScrollable}`}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingBerita ? "Edit Berita / Dokumen Jurnal" : "Tambah Dokumen Jurnal / Berita Baru"}
              </h3>
              <button onClick={() => setIsBeritaModalOpen(false)} className={styles.closeBtn}>
                ×
              </button>
            </div>

            <form onSubmit={handleBeritaSubmit}>
              {/* FIELD 1: JUDUL DOKUMEN / JURNAL */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Judul Dokumen / Jurnal / Berita *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Contoh: Jurnal Riset FPPI Vol. 1: Penerapan AI pada Pertanian"
                  value={beritaFormData.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBeritaFormData((prev) => ({
                      ...prev,
                      title: val,
                      slug: prev.slug || generateSlug(val),
                    }));
                  }}
                  required
                />
              </div>

              {/* FIELD 2: KATEGORI */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Kategori Dokumen / Publikasi *</label>
                <select
                  className={styles.select}
                  value={isCustomCategory ? "Lainnya" : beritaFormData.category}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "Lainnya") {
                      setIsCustomCategory(true);
                    } else {
                      setIsCustomCategory(false);
                      setBeritaFormData((prev) => ({ ...prev, category: val }));
                    }
                  }}
                >
                  <option value="Jurnal Ilmiah">📚 Jurnal Ilmiah</option>
                  <option value="Karya Tulis Ilmiah">📑 Karya Tulis Ilmiah</option>
                  <option value="Proposal PKM">💡 Proposal PKM</option>
                  <option value="Kompetisi">🏅 Kompetisi</option>
                  <option value="Kegiatan">🗓️ Kegiatan</option>
                  <option value="Prestasi">🏆 Prestasi</option>
                  <option value="Pengumuman">📢 Pengumuman</option>
                  <option value="Lainnya">✏️ Lainnya (Ketik Manual)</option>
                </select>
              </div>

              {isCustomCategory && (
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nama Kategori Kustom</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Contoh: Publikasi Internasional"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* FIELD 3: UPLOAD DOKUMEN / JURNAL (FILE PDF / DOCX) */}
              <div className={styles.inputGroup} style={{ background: "rgba(56, 189, 248, 0.05)", padding: 14, borderRadius: 12, border: "1px solid rgba(56, 189, 248, 0.2)" }}>
                <label className={styles.label} style={{ color: "#38bdf8", display: "flex", alignItems: "center", gap: 6 }}>
                  📄 Upload File Dokumen Jurnal / PDF
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "normal" }}>(Maks 35MB: PDF, DOC, DOCX)</span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf"
                  className={styles.input}
                  onChange={handleDocFileChange}
                />
                {uploadingDoc && (
                  <p style={{ color: "#38bdf8", fontSize: "0.85rem", marginTop: 6 }}>
                    ⏳ Mengunggah file dokumen jurnal ke Supabase Storage Bucket &apos;dokumen&apos;...
                  </p>
                )}

                {/* Display Current Document URL */}
                {beritaFormData.pdf_url ? (
                  <div className={styles.docPreviewBox}>
                    <div className={styles.docPreviewText}>
                      <span>📄</span>
                      <span>Dokumen Terpasang</span>
                      <a
                        href={beritaFormData.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.docPreviewLink}
                      >
                        [Buka / Unduh ↗]
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBeritaFormData((prev) => ({ ...prev, pdf_url: "" }))}
                      className={styles.docRemoveBtn}
                    >
                      Hapus Lampiran
                    </button>
                  </div>
                ) : (
                  <p style={{ color: "#94a3b8", fontSize: "0.78rem", marginTop: 6 }}>
                    💡 Catatan: Dokumen yang diunggah akan otomatis memiliki badge PDF dan dapat dibaca / diunduh oleh pengunjung di halaman Berita.
                  </p>
                )}

                <div style={{ marginTop: 10 }}>
                  <label className={styles.label} style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                    Atau Masukkan URL Dokumen Manual (Google Drive / Supabase):
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="https://.../dokumen.pdf"
                    value={beritaFormData.pdf_url}
                    onChange={(e) => setBeritaFormData((prev) => ({ ...prev, pdf_url: e.target.value }))}
                  />
                </div>
              </div>

              {/* FIELD 4: TANGGAL & SLUG URL */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Tanggal Publikasi</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Contoh: 25 November 2026"
                    value={beritaFormData.date}
                    onChange={(e) => setBeritaFormData((prev) => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Slug URL Website</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="contoh-judul-jurnal"
                    value={beritaFormData.slug}
                    onChange={(e) => setBeritaFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  />
                </div>
              </div>

              {/* FIELD 5: COVER / GAMBAR THUMBNAIL */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Cover / Gambar Thumbnail</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="https://... (URL Cover gambar)"
                  value={beritaFormData.image}
                  onChange={(e) => setBeritaFormData((prev) => ({ ...prev, image: e.target.value }))}
                />
                <div style={{ marginTop: 6 }}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.input}
                    onChange={handleBeritaImageFileChange}
                  />
                  {uploadingBeritaImage && (
                    <p style={{ color: "#38bdf8", fontSize: "0.85rem", marginTop: 4 }}>
                      ⏳ Mengunggah foto sampul ke storage...
                    </p>
                  )}
                </div>
              </div>

              {/* Preview Cover */}
              {beritaFormData.image && (
                <div style={{ marginBottom: 16 }}>
                  <label className={styles.label}>Pratinjau Cover:</label>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={beritaFormData.image}
                    alt="Pratinjau"
                    style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)" }}
                    onError={(e) => {
                      (e.target as HTMLElement).setAttribute("src", "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=70");
                    }}
                  />
                </div>
              )}

              {beritaFormError && (
                <p style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: 16 }}>
                  {beritaFormError}
                </p>
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsBeritaModalOpen(false)}
                  className={styles.outlineBtn}
                  style={{ flex: 1 }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={beritaSubmitting || uploadingDoc || uploadingBeritaImage}
                  className={styles.primaryBtn}
                  style={{ flex: 1 }}
                >
                  {beritaSubmitting ? "Menyimpan Dokumen..." : "Simpan & Publikasikan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "linear-gradient(135deg, #0284c7, #2563eb)",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.45)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            fontSize: "0.9rem",
            fontWeight: 600,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>✅</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
