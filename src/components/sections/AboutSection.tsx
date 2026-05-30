import { siteConfig } from "@/lib/config";
import styles from "./AboutSection.module.css";

export default function AboutSection() {
  return (
    <section className={styles.about}>
      {/* 1. BAGIAN YANG DIUBAH: Menambahkan wrapper styles.titleWrap */}
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
          <button className="btn-outline" style={{ marginTop: "8px" }}>
            Selengkapnya
          </button>
        </div>

        <div className={styles.imgWrap}>
          <div className={styles.img}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/image/FPPI LOGI NO BG HD.png"
              alt="FPPI"
            />
          </div>
          <div className={styles.badge}>Berdiri sejak {siteConfig.foundedYear}</div>
        </div>
      </div>
    </section>
  );
}