import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { contactData } from "@/lib/config";
import styles from "./page.module.css";

export const metadata = {
  title: "Pendaftaran Anggota Baru | UKM FPPI",
  description: "Daftar menjadi anggota Forum Penalaran Penelitian Ilmiah dan kembangkan potensimu dalam riset ilmiah dan kompetisi nasional.",
};

export default function DaftarPage() {
  const waNumber = contactData.whatsapp.replace(/\D/g, "");
  const waMessage = encodeURIComponent(
    "Halo Panitia FPPI! Saya tertarik untuk mendaftar sebagai anggota baru UKM Forum Penalaran Penelitian Ilmiah (FPPI). Mohon info formulir pendaftarannya. Terima kasih!"
  );
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.heroTag}>Open Recruitment Anggota Baru</span>
            <h1 className={styles.heroTitle}>
              Bergabung Bersama <span>UKM FPPI</span>
            </h1>
            <p className={styles.heroDesc}>
              Wadah pengembangan penalaran, penulisan karya ilmiah, dan bimbingan proposal PKM menuju prestasi gemilang di tingkat nasional.
            </p>
          </div>
        </section>

        {/* SECTION DETAIL */}
        <section className={styles.section}>
          <div className={styles.grid}>
            {/* ALUR PENDAFTARAN */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <span>🧭</span> Alur Pendaftaran
              </h3>
              <div className={styles.stepList}>
                <div className={styles.stepItem}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepText}>
                    <h4>Konfirmasi ke Panitia</h4>
                    <p>Hubungi panitia via WhatsApp resmi untuk mendapatkan tautan formulir pendaftaran.</p>
                  </div>
                </div>

                <div className={styles.stepItem}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepText}>
                    <h4>Pengisian Formulir</h4>
                    <p>Lengkapi biodata mahasiswa dan pilih minat divisi (R&amp;D, Digital Support, HRD, PR, dll).</p>
                  </div>
                </div>

                <div className={styles.stepItem}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepText}>
                    <h4>Pembekalan &amp; Orientasi</h4>
                    <p>Ikuti sesi pembekalan karya ilmiah dan pengenalan pengurus organisasi FPPI.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* KEUNTUNGAN BERGABUNG */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <span>⭐</span> Keuntungan Bergabung
              </h3>
              <ul className={styles.benefitList}>
                <li className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>✔</span>
                  <span>Bimbingan intensif penyusunan Proposal PKM &amp; Karya Tulis Ilmiah (KTI).</span>
                </li>
                <li className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>✔</span>
                  <span>Peluang mewakili kampus di kompetisi riset nasional &amp; internasional.</span>
                </li>
                <li className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>✔</span>
                  <span>Pelatihan metodologi riset, analisis data, dan kepemimpinan organisasi.</span>
                </li>
                <li className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>✔</span>
                  <span>Sertifikat kegiatan &amp; relasi jejaring peneliti mahasiswa se-Indonesia.</span>
                </li>
                <li className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>✔</span>
                  <span>Akses langsung ke publikasi dan repositori jurnal riset FPPI.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA BOX */}
          <div className={styles.ctaBox}>
            <h3 className={styles.ctaTitle}>Siap Menjadi Bagian dari Peneliti Muda FPPI?</h3>
            <p className={styles.ctaDesc}>
              Hubungi panitia pendaftaran sekarang juga untuk mendapatkan bimbingan pendaftaran langsung melalui WhatsApp resmi.
            </p>
            <div className={styles.ctaActions}>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <span>💬</span> Hubungi Panitia via WhatsApp
              </a>
              <Link href="/program" className="btn-outline">
                Lihat Program Kerja FPPI
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
