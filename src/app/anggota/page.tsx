import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DivisiGrid from "@/components/sections/DivisiGrid";

export default function AnggotaPage() {
  return (
    <>
      <Navbar />
      <main>
        <section style={{
          background: "var(--bg2)",
          padding: "80px 5% 60px",
          borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ maxWidth: "600px" }}>
            <span className="section-tag">Keluarga FPPI</span>
            <h1 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginTop: "8px" }}>
              Divisi & <span>Anggota</span>
            </h1>
            <p className="section-sub">
              Kenali lebih dekat anggota-anggota FPPI yang cantik dan ganteng ini .
            </p>
          </div>
        </section>
        <DivisiGrid />
      </main>
      <Footer />
    </>
  );
}