import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "60px 5%",
          background: "var(--bg)",
        }}
      >
        <span
          style={{
            fontSize: "clamp(4rem, 10vw, 7rem)",
            fontWeight: 800,
            fontFamily: "Syne, sans-serif",
            background: "linear-gradient(135deg, var(--blue), #818cf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          404
        </span>
        <h1
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 12,
          }}
        >
          Halaman Tidak Ditemukan
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "15px",
            maxWidth: 480,
            lineHeight: 1.7,
            marginBottom: 28,
          }}
        >
          Maaf, halaman atau dokumen yang Anda cari tidak tersedia atau tautan telah berpindah alamat.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/" className="btn-primary">
            ← Kembali ke Beranda
          </Link>
          <Link href="/berita" className="btn-outline">
            Lihat Berita &amp; Jurnal
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
