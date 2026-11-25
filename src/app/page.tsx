import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import DivisiGrid from "@/components/sections/DivisiGrid";
import KetuaSection from "@/components/sections/KetuaSection";
import BeritaSection from "@/components/sections/BeritaSection";
import ContactSection from "@/components/sections/ContactSection";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <HeroSection />

        {/* TENTANG KAMI */}
        <AboutSection />

        {/* STRUKTUR DIVISI */}
        <section style={{ background: "var(--bg2)", padding: "72px 5% 40px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", maxWidth: 1200, margin: "0 auto 32px", flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className="section-tag">Struktur Organisasi</span>
              <h2 className="section-title">
                Divisi &amp; <span>Kepengurusan</span>
              </h2>
              <p className="section-sub">
                Masing-masing divisi berfokus mendorong riset terapan, teknologi, publikasi, dan pembinaan anggota.
              </p>
            </div>
            <Link href="/anggota" className="btn-outline" style={{ fontSize: "13px", padding: "8px 18px" }}>
              Lihat Semua Anggota →
            </Link>
          </div>
          <DivisiGrid />
        </section>

        {/* SAMBUTAN KETUA */}
        <KetuaSection />

        {/* BERITA & JURNAL RISET */}
        <BeritaSection />

        {/* KONTAK */}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
