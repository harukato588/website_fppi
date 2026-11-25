import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DivisiGrid from "@/components/sections/DivisiGrid";

export const metadata = {
  title: "Divisi & Anggota | UKM FPPI",
  description: "Kenali struktur divisi dan jajaran anggota pengurus UKM Forum Penalaran Penelitian Ilmiah.",
};

export default function AnggotaPage() {
  return (
    <>
      <Navbar />
      <main>
        <section
          style={{
            background: "var(--bg2)",
            padding: "80px 5% 60px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: "680px" }}>
            <span className="section-tag">Keluarga Besar FPPI</span>
            <h1
              className="section-title"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginTop: "8px" }}
            >
              Divisi &amp; <span>Anggota</span>
            </h1>
            <p className="section-sub">
              Kenali jajaran pengurus dan anggota berprestasi UKM FPPI yang berdedikasi tinggi dalam penalaran, riset ilmiah, dan inovasi karya tulis.
            </p>
          </div>
        </section>
        <DivisiGrid />
      </main>
      <Footer />
    </>
  );
}
