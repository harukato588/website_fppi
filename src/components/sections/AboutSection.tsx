import Link from "next/link";
import { siteConfig } from "@/lib/config";
import styles from "./AboutSection.module.css";

export default function AboutSection() {
  return (
    <section className={styles.about}>
      <div className={styles.titleWrap}>
        <span className="section-tag">Tentang Kami</span>
        <h2 className="section-title">
          Mengenal <span>FPPI</span> Lebih Dekat
        </h2>
      </div>

      <div className={styles.grid}>
        <div className={styles.text}>
          <p>
            Forum Penalaran Penelitian Ilmiah (FPPI) bukan sekadar organisasi mahasiswa biasa; kami adalah pusat inkubasi pemikiran kritis dan inovasi kreatif. Berdiri sebagai wadah bagi para peneliti muda, FPPI berkomitmen untuk membangun ekosistem akademik yang dinamis melalui budaya literasi, riset yang terukur, dan penulisan ilmiah yang berdampak.
          </p>
          <p>
            Kami percaya bahwa mahasiswa adalah agen perubahan yang harus dibekali dengan kemampuan analisis yang tajam. Melalui berbagai program pengembangan—mulai dari workshop metodologi penelitian hingga kompetisi karya tulis tingkat nasional—FPPI hadir untuk mencetak generasi intelektual yang tidak hanya mampu mengidentifikasi masalah, tetapi juga merumuskan solusi nyata bagi masyarakat.
          </p>
          <p>
            Melalui berbagai program unggulan seperti pelatihan karya tulis ilmiah, diskusi ilmiah,
            dan kompetisi penelitian, FPPI terus berkomitmen mencetak generasi mahasiswa yang
            kritis, analitis, dan berdedikasi.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
            <Link href="/program" className="btn-primary">
              Lihat Program Kerja →
            </Link>
            <Link href="/anggota" className="btn-outline">
              Struktur Divisi &amp; Anggota
            </Link>
          </div>
        </div>

        <div className={styles.imgWrap}>
          <div className={styles.img}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://kdlkzwidtsxdzyjfdqpb.supabase.co/storage/v1/object/public/images/FPPI_LOGI_NO_BG_HD.png"
              alt="FPPI"
            />
          </div>
          <div className={styles.badge}>Berdiri sejak {siteConfig.foundedYear}</div>
        </div>
      </div>
    </section>
  );
}
