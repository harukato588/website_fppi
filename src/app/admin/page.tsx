"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { divisiData } from "@/lib/config";
import {
  getAllAnggota,
  createAnggota,
  updateAnggota,
  deleteAnggota,
  AnggotaItem,
  supabase,
} from "@/lib/supabase";
import styles from "./page.module.css";

// ⚠️ SECURITY: PIN dibandingkan via env variable (NEXT_PUBLIC_ADMIN_PIN).
// Meskipun client-side, ini jauh lebih baik daripada hardcode di source code.
// Untuk production sesungguhnya, gunakan API Route + server-side session.
const ADMIN_PIN =
  process.env.NEXT_PUBLIC_ADMIN_PIN || "UNCONFIGURED";

// Sanitasi string input — hapus karakter HTML berbahaya
function sanitizeText(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim()
    .slice(0, 200); // max 200 karakter
}

// Validasi URL foto — hanya izinkan http/https URL atau path relatif
function isValidPhotoUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith("/")) return true; // path relatif
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

// Validasi MIME type file gambar
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE_MB = 5;

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");
  // Rate-limit: max 5 percobaan salah, lalu kunci selama 30 detik
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const [anggotaList, setAnggotaList] = useState<AnggotaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDivisi, setSelectedDivisi] = useState("semua");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnggotaItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nama: "",
    jabatan: "Anggota",
    divisi_id: "pengurus-harian",
    foto: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Seed / Import state
  const [seeding, setSeeding] = useState(false);

  // Check stored auth — validasi sesi: harus ada token + tidak lebih dari 8 jam
  useEffect(() => {
    const saved = localStorage.getItem("fppi_admin_auth");
    const savedTs = localStorage.getItem("fppi_admin_auth_ts");
    const SESSION_MAX_MS = 8 * 60 * 60 * 1000; // 8 jam
    if (
      saved &&
      saved !== "true" && // reject format lama
      savedTs &&
      Date.now() - Number(savedTs) < SESSION_MAX_MS
    ) {
      setIsAuthenticated(true);
    } else {
      // Hapus sesi kadaluarsa
      localStorage.removeItem("fppi_admin_auth");
      localStorage.removeItem("fppi_admin_auth_ts");
    }
  }, []);

  // Fetch data anggota
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAllAnggota();
      setAnggotaList(res);
    } catch (err) {
      console.error("Gagal mengambil data anggota:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Cek apakah masih terkunci
    if (lockedUntil && Date.now() < lockedUntil) {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      setAuthError(`Terlalu banyak percobaan salah. Coba lagi dalam ${remaining} detik.`);
      return;
    }

    if (ADMIN_PIN === "UNCONFIGURED") {
      setAuthError("Admin PIN belum dikonfigurasi. Hubungi administrator.");
      return;
    }

    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      // Simpan session token sederhana (bukan hanya flag "true")
      const sessionToken = `fppi_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("fppi_admin_auth", sessionToken);
      localStorage.setItem("fppi_admin_auth_ts", String(Date.now()));
      setAuthError("");
      setLoginAttempts(0);
      setLockedUntil(null);
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      if (newAttempts >= 5) {
        const lockTime = Date.now() + 30_000; // kunci 30 detik
        setLockedUntil(lockTime);
        setAuthError("Terlalu banyak percobaan salah. Akun dikunci selama 30 detik.");
      } else {
        setAuthError(`PIN yang Anda masukkan salah! (${5 - newAttempts} percobaan tersisa)`);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("fppi_admin_auth");
    localStorage.removeItem("fppi_admin_auth_ts");
    setLoginAttempts(0);
    setLockedUntil(null);
  };

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

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ SECURITY: Validasi MIME type & ukuran file
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setFormError(`Tipe file tidak diizinkan: ${file.type || "unknown"}. Gunakan JPEG, PNG, WebP, atau GIF.`);
      e.target.value = ""; // reset input
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFormError(`Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    setUploadingImage(true);
    setFormError("");
    try {
      // Direct upload ke Supabase Storage Bucket 'images'
      const { uploadFileToSupabase } = await import("@/lib/supabase");
      const publicUrl = await uploadFileToSupabase(file, "images");
      setFormData((prev) => ({ ...prev, foto: publicUrl }));
      setFormError("");
    } catch (err: any) {
      console.warn("Gagal upload ke Supabase Storage, fallback ke Local Preview:", err);
      // Fallback ke FileReader (Base64)
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, foto: reader.result as string }));
      };
      reader.readAsDataURL(file);
      setFormError("Catatan: File disimpan sebagai preview lokal. Untuk menyimpan di cloud, pastikan Bucket 'images' (Public) sudah dibuat di Supabase Dashboard Storage.");
    } finally {
      setUploadingImage(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sanitasi & validasi input
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
    if (!isValidPhotoUrl(safeFoto)) {
      setFormError("URL foto tidak valid. Gunakan URL https:// atau path relatif yang valid.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      if (editingItem && editingItem.id && !String(editingItem.id).startsWith("local-")) {
        // Update di Supabase
        await updateAnggota(editingItem.id, {
          nama: safeName,
          jabatan: safeJabatan,
          divisi_id: safeDivisi,
          foto: safeFoto,
        });
      } else {
        // Insert baru ke Supabase
        await createAnggota({
          nama: safeName,
          jabatan: safeJabatan,
          divisi_id: safeDivisi,
          foto: safeFoto,
        });
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setFormError("Gagal menyimpan ke Supabase: " + (err.message || String(err)));
    } finally {
      setSubmitting(false);
    }
  };


  const handleDelete = async (item: AnggotaItem) => {
    if (!confirm(`Yakin ingin menghapus anggota ${item.nama}?`)) return;

    if (String(item.id).startsWith("local-")) {
      alert("Item data lokal tidak dapat dihapus permanen dari Supabase. Silakan gunakan tombol 'Impor Data Lokal ke Supabase' terlebih dahulu.");
      return;
    }

    try {
      await deleteAnggota(item.id!);
      await loadData();
    } catch (err: any) {
      alert("Gagal menghapus: " + (err.message || String(err)));
    }
  };

  const handleSeedLocalData = async () => {
    if (!supabase) {
      alert("Supabase client belum terhubung. Pastikan env terkonfigurasi!");
      return;
    }

    if (
      !confirm(
        "Apakah Anda yakin ingin mengimpor seluruh data anggota bawaan (config.ts) ke database Supabase?"
      )
    ) {
      return;
    }

    setSeeding(true);
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

      alert("Berhasil mengimpor seluruh data anggota ke Supabase!");
      await loadData();
    } catch (err: any) {
      alert("Gagal mengimpor data: " + (err.message || String(err)));
    } finally {
      setSeeding(false);
    }
  };

  // Filter list
  const filteredList =
    selectedDivisi === "semua"
      ? anggotaList
      : anggotaList.filter((item) => item.divisi_id === selectedDivisi);

  // Jika Belum Auth
  if (!isAuthenticated) {
    return (
      <div className={styles.authWrap}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Admin FPPI</h1>
          <p className={styles.authSub}>Masukkan PIN Admin untuk mengakses Dashboard Manajemen Anggota</p>
          <form onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>PIN Akses Admin</label>
              <input
                type="password"
                className={styles.input}
                placeholder="masukan pin masuk "
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
              />
            </div>
            {authError && <p style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: 16 }}>{authError}</p>}
            <button type="submit" className={styles.primaryBtn}>
              Masuk Dashboard
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
          <Link href="/" className={styles.outlineBtn}>
            👁️ Lihat Website
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Keluar
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className={styles.main}>
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
              disabled={seeding}
              className={styles.outlineBtn}
              title="Salin data bawaan lokal ke database Supabase"
            >
              {seeding ? "Mengimpor..." : "⚡ Impor Data Bawaan ke Supabase"}
            </button>
            <button onClick={openAddModal} className={styles.primaryBtn} style={{ width: "auto" }}>
              + Tambah Anggota
            </button>
          </div>
        </div>

        {/* TABS DIVISI */}
        <div className={styles.tabs}>
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
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
            Memuat data anggota dari database...
          </div>
        ) : filteredList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
            Belum ada data anggota pada kategori ini.
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredList.map((item, idx) => {
              const divObj = divisiData.find((d) => d.id === item.divisi_id);
              const isLocalOnly = String(item.id).startsWith("local-");
              return (
                <div key={item.id || idx} className={styles.card}>
                  <div className={styles.cardMedia}>
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
      </main>

      {/* MODAL FORM ADD / EDIT */}
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
              {/* Preview Foto */}
              {formData.foto && (
                <div>
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
                    ⏳ Meng-upload foto ke Supabase Storage Bucket 'images'...
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
                  disabled={submitting}
                  className={styles.primaryBtn}
                  style={{ flex: 1 }}
                >
                  {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
