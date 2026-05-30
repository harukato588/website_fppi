// =====================
// SITE CONFIG — edit ini untuk update konten dari sini
// Nanti bisa dihubungkan ke database / CMS untuk dashboard admin
// =====================

export const siteConfig = {
  name: "UKM FPPI",
  fullName: "Forum Penalaran Penelitian Ilmiah",
  tagline: "Wadah pengembangan penalaran, penelitian, dan karya ilmiah mahasiswa menuju prestasi yang gemilang.",
  foundedYear: "2014",
  stats: [
    { number: "20", label: "Anggota Aktif" },
    { number: "5", label: "Karya Ilmiah" },
    { number: "3", label: "Prestasi Nasional" },
    { number: "2013", label: "Tahun Berdiri" },
  ],
};

export const ketuaData = {
  name: "KELVIN ",
  role: "Ketua UKM FPPI 2025",
  nameFormal: "KELVIN LIE, 2025",
  photo: "/image/Screenshot 2026-03-30 114522.png",
  description:
    "Mahasiswa aktif yang berpengalaman dalam penelitian ilmiah dan kompetisi karya tulis tingkat nasional. Memiliki visi menjadikan FPPI sebagai wadah terdepan dalam mencetak peneliti muda yang inovatif dan berdedikasi untuk kemajuan bangsa.",
  phone: "+62 812 3456 7890",
  email: "ketua.fppi@university.ac.id",
};

export const beritaData = [
  {
    id: 1,
    category: "Kompetisi",
    title: "PROPOSAL PKM KI BHUANTARA 2025 ",
    date: "15 Maret 2025",
    image: "/image/Screenshot 2026-05-25 210131.png",
    slug: "fppi-raih-juara-1-lktin-2024",
    pdfUrl: "/dokumen/RandiPradityaBagusDarmawan_InstitutTeknologiDirgantaraAdisutjipto_PKM-KI.pdf",
  },
  {
    id: 2,
    category: "Kegiatan",
    title: "PROPOSAL PKM KI AEORSENSE 2025",
    date: "10 Maret 2025",
    image: "/image/Screenshot 2026-05-25 210233.png",
    slug: "workshop-karya-ilmiah-batch-5",
    pdfUrl: "/dokumen/PKM 2026.pdf"
  },
  {
    id: 3,
    category: "Diskusi",
    title: "Forum Diskusi Ilmiah: Inovasi Teknologi di Era AI",
    date: "5 Maret 2025",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=60",
    slug: "forum-diskusi-inovasi-teknologi-ai",
  },
  {
    id: 4,
    category: "Pengumuman",
    title: "Pendaftaran Anggota Baru FPPI 2025 Telah Dibuka",
    date: "1 Maret 2025",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=60",
    slug: "pendaftaran-anggota-baru-2025",
  },
  {
    id: 5,
    category: "Kolaborasi",
    title: "MoU FPPI dengan Lembaga Penelitian Eksternal 2025",
    date: "25 Feb 2025",
    image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=400&q=60",
    slug: "mou-fppi-lembaga-penelitian-2025",
  },
  {
    id: 6,
    category: "Prestasi",
    title: "3 Anggota FPPI Lolos Seleksi PKM Pendanaan 2025",
    date: "20 Feb 2025",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=60",
    slug: "3-anggota-lolos-pkm-2025",
  },
];

export const contactData = {
  phone: "+62 812 3456 7890",
  whatsapp: "+62 812 3456 7891",
  email: "fppi@university.ac.id",
  instagram: "@ukm_fppi",
};

export const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Program", href: "/program" },
  { label: "Anggota", href: "/anggota" },
  { label: "Berita", href: "/berita" },
];


// =====================
// DATA DIVISI & ANGGOTA
// =====================

export const divisiData = [
  {
    id: "pengurus-harian",
    nama: "The Government",
    deskripsi: "Inti kepemimpinan FPPI yang bertanggung jawab atas koordinasi dan arah organisasi.",
    foto: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=70",
    jumlahAnggota: 5,
    jumlahProgram: 4,
    anggota: [
      { nama: "Nama Ketua", jabatan: "Ketua Umum", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=70" },
      { nama: "Nama Wakil", jabatan: "Wakil Ketua", foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=70" },
      { nama: "Nama Sekretaris", jabatan: "Sekretaris", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=70" },
      { nama: "Nama Bendahara", jabatan: "bendahara", foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=70" }
    ],
  },
  {
    id: "penelitian-karya-ilmiah",
    nama: "Research and Development",
    deskripsi: "Divisi yang berfokus pada pengembangan penelitian dan karya tulis ilmiah anggota.",
    foto: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=70",
    jumlahAnggota: 12,
    jumlahProgram: 6,
    anggota: [
      { nama: "Nama Kepala Divisi", jabatan: "Kepala Divisi", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=70" },
      { nama: "Nama Anggota 1", jabatan: "Anggota", foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=70" },
      { nama: "Nama Aggota 2", jabatan: "Anggota", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=70" },
      { nama: "Nama Anggota 3", jabatan: "Anggota", foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=70" },
    ],
  },
  {
    id: "media-komunikasi",
    nama: " Digital and Technical Support",
    deskripsi: "Divisi yang mengelola media sosial, publikasi, dan komunikasi organisasi.",
    foto: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=70",
    jumlahAnggota: 8,
    jumlahProgram: 5,
    anggota: [
      { nama: "Dylan putry Setyono", jabatan: "Kepala Divisi", foto: "/image/Screenshot 2026-03-30 122807.png" },
      { nama: "Irsan Ali Wardaana", jabatan: "Anggota", foto: "/image/Screenshot 2026-03-30 221420.png" },
      { nama: "Iqbal Budi Nugroho", jabatan: "Anggota", foto: "/image/DSC03343.JPG" },
      { nama: "Felix Nathan Widyadhana", jabatan: "Anggota", foto: "/image/WhatsApp Image 2026-05-25 at 21.44.51.jpeg" },
    ],
  },
  {
    id: "pengembangan-sdm",
    nama: "Human and Resource Developtment",
    deskripsi: "Divisi yang berfokus pada pelatihan, pembinaan, dan pengembangan potensi anggota.",
    foto: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=70",
    jumlahAnggota: 10,
    jumlahProgram: 7,
    anggota: [
      { nama: "Nama Kepala Divisi", jabatan: "Kepala Divisi", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=70" },
      { nama: "Nama Anggota 1", jabatan: "Anggota", foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=70" },
      { nama: "Nama Anggota 2", jabatan: "Anggota", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=70" },
      { nama: "Nama Anggota 3", jabatan: "Anggota", foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=70" },
    ],
  },
  {
    id: "public-relation-communication",
    nama: "Public Relation and Communication",
    deskripsi: "Divisi yang bertanggung jawab untuk membangun relasi, komunikasi publik, dan kerjasama eksternal.",
    foto: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=70",
    jumlahAnggota: 4,
    jumlahProgram: 3,
    anggota: [
      { nama: "Nama Kepala Divisi", jabatan: "Kepala Divisi", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=70" },
      { nama: "Nama Anggota 1", jabatan: "Anggota", foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=70" },
      { nama: "Nama Anggota 2", jabatan: "Anggota", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=70" },
      { nama: "Nama Anggota 3", jabatan: "Anggota", foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=70" },
    ],
  },
];

// =====================
// DATA PROGRAM KERJA
// =====================
export const programData = [
  {
    id: 1,
    slug: "lktin-2025",
    judul: "LKTIN FPPI 2025",
    kategori: "Kompetisi",
    status: "Selesai",
    tanggal: "10 Jan 2025 – 15 Mar 2025",
    deskripsi: "Lomba Karya Tulis Ilmiah Nasional yang diselenggarakan oleh FPPI untuk mahasiswa seluruh Indonesia.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=70",
    timPelaksana: [
      { nama: "Nama Ketua", peran: "Penanggung Jawab" },
      { nama: "Nama Anggota 2", peran: "Koordinator" },
      { nama: "Nama Anggota 3", peran: "Anggota" },
    ],
  },
  {
    id: 2,
    slug: "workshop-kti-2025",
    judul: "Workshop Karya Tulis Ilmiah",
    kategori: "Pelatihan",
    status: "Selesai",
    tanggal: "5 Feb 2025 – 20 Feb 2025",
    deskripsi: "Pelatihan penulisan karya tulis ilmiah untuk anggota baru FPPI agar siap mengikuti kompetisi nasional.",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=70",
    timPelaksana: [
      { nama: "Nama Ketua", peran: "Penanggung Jawab" },
      { nama: "Nama Anggota 2", peran: "Koordinator" },
    ],
  },
  {
    id: 3,
    slug: "forum-diskusi-ilmiah",
    judul: "Forum Diskusi Ilmiah",
    kategori: "Diskusi",
    status: "Rencana",
    tanggal: "1 Apr 2025 – 30 Apr 2025",
    deskripsi: "Forum diskusi rutin membahas isu-isu ilmiah terkini yang melibatkan seluruh anggota FPPI.",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=70",
    timPelaksana: [
      { nama: "Nama Ketua", peran: "Penanggung Jawab" },
      { nama: "Nama Anggota 2", peran: "Koordinator" },
      { nama: "Nama Anggota 3", peran: "Anggota" },
    ],
  },
  {
    id: 4,
    slug: "pkm-coaching-2025",
    judul: "PKM Coaching Clinic",
    kategori: "Pelatihan",
    status: "Rencana",
    tanggal: "10 Mei 2025 – 30 Mei 2025",
    deskripsi: "Pendampingan intensif untuk mahasiswa yang ingin mengajukan proposal PKM pendanaan Kemendikbud.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=70",
    timPelaksana: [
      { nama: "Nama Ketua", peran: "Penanggung Jawab" },
      { nama: "Nama Anggota 2", peran: "Koordinator" },
    ],
  },
  {
    id: 5,
    slug: "seminar-nasional-2025",
    judul: "Seminar Nasional Penelitian",
    kategori: "Seminar",
    status: "Rencana",
    tanggal: "15 Jun 2025 – 16 Jun 2025",
    deskripsi: "Seminar nasional menghadirkan pembicara dari berbagai universitas terkemuka di Indonesia.",
    image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&q=70",
    timPelaksana: [
      { nama: "Nama Ketua", peran: "Penanggung Jawab" },
      { nama: "Nama Anggota 2", peran: "Koordinator" },
      { nama: "Nama Anggota 3", peran: "Anggota" },
    ],
  },
  {
    id: 6,
    slug: "upgrading-anggota-2025",
    judul: "Upgrading Anggota FPPI",
    kategori: "Internal",
    status: "Rencana",
    tanggal: "20 Jul 2025 – 22 Jul 2025",
    deskripsi: "Program pembinaan dan pengembangan kapasitas seluruh anggota FPPI untuk periode kepengurusan baru.",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=70",
    timPelaksana: [
      { nama: "Nama Ketua", peran: "Penanggung Jawab" },
      { nama: "Nama Anggota 2", peran: "Koordinator" },
    ],
  },
];

export type Program = (typeof programData)[number];

export type Divisi = (typeof divisiData)[number];
export type Anggota = (typeof divisiData)[number]["anggota"][number];




// Types
export type Berita = (typeof beritaData)[number];
export type ContactData = typeof contactData;
export type KetuaData = typeof ketuaData;
