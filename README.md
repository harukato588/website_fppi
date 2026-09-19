# 🎓 Website UKM FPPI — Forum Penalaran Penelitian Ilmiah

Website resmi **UKM FPPI** (Forum Penalaran Penelitian Ilmiah), dibangun menggunakan **Next.js 16** dengan integrasi **Supabase** sebagai backend database dan media storage.

---

## 📋 Daftar Isi

- [Gambaran Umum](#-gambaran-umum)
- [Tech Stack](#-tech-stack)
- [Struktur Folder](#-struktur-folder)
- [Halaman & Fitur](#-halaman--fitur)
- [Admin Dashboard](#-admin-dashboard)
- [Setup & Instalasi](#-setup--instalasi)
- [Environment Variables](#-environment-variables)
- [Supabase Setup](#-supabase-setup)
- [Deploy & Upload Media](#-deploy--upload-media)
- [Update Konten](#-update-konten)
- [Panduan Kontribusi](#-panduan-kontribusi)

---

## 🌐 Gambaran Umum

Website ini adalah profil organisasi UKM FPPI yang menampilkan:
- Informasi umum dan sejarah organisasi
- Data anggota berdasarkan divisi
- Berita dan kegiatan terbaru
- Program kerja organisasi
- Halaman kontak

Website menggunakan **Supabase** sebagai sumber data utama, dengan fallback otomatis ke data lokal (`src/lib/config.ts`) jika Supabase tidak tersedia.

---

## 🛠️ Tech Stack

| Teknologi | Versi | Kegunaan |
|---|---|---|
| [Next.js](https://nextjs.org) | ^16.2.6 | Framework utama (App Router) |
| [React](https://react.dev) | ^18 | UI Library |
| [TypeScript](https://typescriptlang.org) | ^5 | Type safety |
| [Supabase](https://supabase.com) | ^2.116.0 | Database PostgreSQL + Storage |
| [Framer Motion](https://framer.motion.com) | ^12.38.0 | Animasi UI |
| CSS Modules | Built-in | Styling per-komponen |

---

## 📁 Struktur Folder

```
website_fppi/
├── public/
│   ├── image/          # Foto anggota & gambar lokal (di-upload ke Supabase)
│   └── dokumen/        # File PDF (proposal, laporan) (di-upload ke Supabase)
│
├── scripts/
│   └── upload-to-supabase.js   # Script migrasi media ke Supabase Storage
│
├── src/
│   ├── app/                    # Halaman Next.js (App Router)
│   │   ├── page.tsx            # Beranda (/)
│   │   ├── layout.tsx          # Root layout (metadata SEO global)
│   │   ├── admin/
│   │   │   ├── page.tsx        # Dashboard Admin (PIN-protected)
│   │   │   └── page.module.css
│   │   ├── anggota/
│   │   │   ├── page.tsx        # Daftar divisi (/anggota)
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # Detail divisi & anggota (/anggota/[id])
│   │   │       └── page.module.css
│   │   ├── berita/
│   │   │   ├── page.tsx        # Daftar berita (/berita)
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Detail berita (/berita/[slug])
│   │   └── program/
│   │       ├── page.tsx        # Daftar program kerja (/program)
│   │       └── [slug]/
│   │           └── page.tsx    # Detail program kerja (/program/[slug])
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Navigasi utama
│   │   │   ├── Navbar.module.css
│   │   │   ├── Footer.tsx          # Footer (termasuk link Admin Panel)
│   │   │   └── Footer.module.css
│   │   └── sections/               # Seksi-seksi halaman Beranda
│   │       ├── HeroSection.tsx
│   │       ├── AboutSection.tsx
│   │       ├── DivisiGrid.tsx
│   │       ├── BeritaSection.tsx
│   │       ├── KetuaSection.tsx
│   │       └── ContactSection.tsx
│   │
│   ├── lib/
│   │   ├── config.ts       # Data konten statis (fallback & konfigurasi)
│   │   └── supabase.ts     # Supabase client + semua fungsi CRUD
│   │
│   └── styles/
│       └── globals.css     # CSS global
│
├── .env.example            # Template variabel lingkungan (aman di-commit)
├── .env.local              # Kredensial asli (TIDAK di-commit ke Git)
├── next.config.js          # Konfigurasi Next.js
└── package.json
```

---

## 📄 Halaman & Fitur

### `/` — Beranda
Menampilkan hero section, tentang FPPI, grid divisi, berita terbaru, profil ketua, dan kontak.

### `/anggota` — Daftar Divisi
Menampilkan kartu setiap divisi yang ada di FPPI.

| Divisi | ID |
|---|---|
| The Government (Pengurus Harian) | `pengurus-harian` |
| Research and Development | `penelitian-karya-ilmiah` |
| Digital and Technical Support | `media-komunikasi` |
| Human and Resource Development | `pengembangan-sdm` |
| Public Relation and Communication | `public-relation-communication` |

### `/anggota/[id]` — Detail Divisi
Menampilkan daftar anggota berdasarkan divisi yang dipilih. Data diambil dari Supabase, dengan fallback ke `config.ts`.

### `/berita` — Berita & Kegiatan
Menampilkan daftar berita/kegiatan FPPI. Data bersumber dari Supabase atau `beritaData` di `config.ts`.

### `/berita/[slug]` — Detail Berita
Halaman detail satu berita. Mendukung lampiran file PDF.

### `/program` — Program Kerja
Menampilkan daftar program kerja FPPI beserta status (Selesai / Rencana).

### `/program/[slug]` — Detail Program
Halaman detail program kerja termasuk tim pelaksana.

---

## 🔐 Admin Dashboard

Admin Dashboard tersedia di **`/admin`** dan dapat diakses melalui link **"Admin Panel"** di footer website (ikon gembok 🔒).

### Fitur Admin Dashboard
- ✅ **Manajemen Data Anggota** — Tambah, Edit, Hapus anggota dari database Supabase
- ✅ **Upload Foto Anggota** — Upload gambar langsung ke Supabase Storage bucket `images`
- ✅ **Filter per Divisi** — Tampilkan anggota berdasarkan divisi tertentu
- ✅ **Impor Data Bawaan** — Seed data dari `config.ts` ke Supabase (hati-hati: bisa duplikasi jika sudah ada data)
- ✅ **Proteksi PIN** — Akses hanya dengan PIN yang dikonfigurasi di `.env.local`

### Mekanisme Keamanan Admin

| Fitur | Detail |
|---|---|
| **Autentikasi** | PIN admin via `NEXT_PUBLIC_ADMIN_PIN` (bukan hardcode) |
| **Session Token** | Disimpan di `localStorage` dengan masa aktif **8 jam** |
| **Rate Limiting** | Maksimal **5x** percobaan salah → kunci **30 detik** |
| **Input Sanitization** | `sanitizeText()` menghapus `<script>`, `<iframe>`, `javascript:` URL |
| **URL Validation** | `isValidPhotoUrl()` hanya izinkan `http://`, `https://`, atau path relatif |
| **File Upload** | Whitelist MIME: `image/jpeg`, `image/png`, `image/webp`, `image/gif`; max **5 MB** |

> **⚠️ Penting:** Untuk production yang lebih aman, pertimbangkan untuk memindahkan autentikasi admin ke **API Route + server-side session** atau gunakan Supabase Auth.

---

## 🚀 Setup & Instalasi

### Prasyarat
- Node.js >= 18
- npm >= 9
- Akun [Supabase](https://supabase.com) (gratis)

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/harukato588/website_fppi.git
cd website_fppi

# 2. Install dependencies
npm install

# 3. Salin template environment variables
cp .env.example .env.local

# 4. Edit .env.local dengan kredensial Supabase Anda (lihat bagian di bawah)
# (gunakan text editor favorit Anda)

# 5. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🔑 Environment Variables

Buat file `.env.local` di root project (**jangan di-commit ke Git!**):

```env
# Supabase Configuration
# Dapatkan dari: Dashboard Supabase → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Dashboard PIN
# Gunakan kombinasi huruf dan angka, hindari karakter: # $ & " '
NEXT_PUBLIC_ADMIN_PIN=your-secure-pin-here

# (Opsional) Hanya diperlukan jika menjalankan scripts/upload-to-supabase.js
# Dapatkan dari: Dashboard Supabase → Project Settings → API → service_role key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> **⚠️ Catatan PIN:** Hindari karakter `#`, `$`, `&`, `"`, `'` pada nilai PIN di file `.env.local` karena dapat menyebabkan masalah parsing.

---

## 🗄️ Supabase Setup

### 1. Buat Project Supabase
Buat project baru di [supabase.com](https://supabase.com).

### 2. Buat Tabel `anggota`

Jalankan SQL berikut di **SQL Editor** Supabase:

```sql
CREATE TABLE IF NOT EXISTS anggota (
  id BIGSERIAL PRIMARY KEY,
  divisi_id TEXT NOT NULL,
  nama TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  foto TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Izinkan read publik
ALTER TABLE anggota ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON anggota FOR SELECT USING (true);

-- Izinkan insert/update/delete dengan anon key (untuk Admin Dashboard)
CREATE POLICY "Allow anon insert" ON anggota FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON anggota FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete" ON anggota FOR DELETE USING (true);
```

### 3. Buat Tabel `berita` (Opsional)

```sql
CREATE TABLE IF NOT EXISTS berita (
  id BIGSERIAL PRIMARY KEY,
  category TEXT,
  title TEXT NOT NULL,
  date TEXT,
  image TEXT,
  slug TEXT UNIQUE NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE berita ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON berita FOR SELECT USING (true);
```

### 4. Buat Storage Buckets

Di menu **Storage** Supabase, buat dua bucket **Public**:
- `images` — untuk foto anggota dan gambar
- `dokumen` — untuk file PDF/dokumen

---

## 📤 Deploy & Upload Media

### Upload Foto & Dokumen ke Supabase Storage

Gunakan script migrasi yang tersedia:

```bash
# Pastikan .env.local sudah dikonfigurasi dengan SUPABASE_SERVICE_ROLE_KEY

# Tempatkan foto anggota di: public/image/
# Tempatkan dokumen PDF di:  public/dokumen/

# Jalankan script upload
node scripts/upload-to-supabase.js
```

Script ini akan:
1. Membaca semua file di `public/image/` dan `public/dokumen/`
2. Meng-upload ke Supabase Storage bucket yang sesuai
3. Menampilkan URL publik setiap file yang berhasil di-upload

### Deploy ke Vercel (Rekomendasi)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Saat deploy, tambahkan semua variabel dari `.env.local` ke **Environment Variables** di dashboard Vercel.

---

## ✏️ Update Konten

### Mengedit Data Anggota
**Via Admin Dashboard** (rekomendasi):
1. Buka `/admin` di browser
2. Masukkan PIN admin
3. Klik **"Tambah Anggota"** atau ikon ✏️ untuk edit

**Via `config.ts`** (data fallback lokal):
- Edit file [`src/lib/config.ts`](src/lib/config.ts)
- Ubah array di dalam `divisiData[].anggota`
- Data ini hanya tampil jika Supabase tidak tersedia

### Mengedit Berita
- Edit array `beritaData` di [`src/lib/config.ts`](src/lib/config.ts)
- Atau tambahkan langsung ke tabel `berita` di Supabase melalui Table Editor

### Mengedit Program Kerja
- Edit array `programData` di [`src/lib/config.ts`](src/lib/config.ts)

### Mengedit Informasi Organisasi
- Edit objek `siteConfig`, `ketuaData`, `contactData` di [`src/lib/config.ts`](src/lib/config.ts)

### Menambah Divisi Baru
1. Tambahkan objek baru ke array `divisiData` di `config.ts` dengan struktur:
```ts
{
  id: "id-divisi-unik",    // digunakan sebagai URL slug
  nama: "Nama Divisi",
  deskripsi: "Deskripsi singkat divisi",
  foto: "https://...",     // URL foto hero halaman divisi
  jumlahAnggota: 0,
  jumlahProgram: 0,
  anggota: [
    { nama: "Nama Anggota", jabatan: "Jabatan", foto: "https://..." }
  ]
}
```
2. Anggota baru di divisi ini juga perlu ditambahkan di Supabase dengan `divisi_id` yang sesuai.

---

## 🤝 Panduan Kontribusi

### Alur Kerja
```
main branch → development → fitur → merge ke main
```

### Aturan Commit
Gunakan format **Conventional Commits**:
```
feat: tambah fitur baru
fix: perbaiki bug
docs: update dokumentasi
style: perubahan styling/CSS
refactor: refaktor kode
```

### Yang TIDAK Boleh Di-Commit
- ❌ File `.env.local` (berisi PIN dan API Key rahasia)
- ❌ File `.env.production` atau `.env.development`
- ❌ Folder `node_modules/`
- ❌ Folder `.next/` (build artifact)

---

## 📞 Kontak & Maintainer

Untuk pertanyaan terkait project ini, hubungi tim **Digital and Technical Support** UKM FPPI.

---

*Dokumentasi ini dibuat untuk memudahkan developer yang akan melanjutkan atau berkontribusi pada project Website UKM FPPI.*
