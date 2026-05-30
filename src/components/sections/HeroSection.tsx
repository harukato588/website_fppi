import Link from "next/link";
import { siteConfig } from "@/lib/config";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      {/* Background */}
      <div className={styles.bg}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.bgImg}
          src="/image/20251109_100213.jpg"
          alt=""
        />
        <div className={styles.overlay} />
      </div>

      {/* Badge */}
      <div className={styles.badge}>
        <span className={styles.badgeDot} />
        Unit Kegiatan Mahasiswa Resmi
      </div>

      {/* Title */}
      <h1 className={styles.title}>
        Forum Penalaran
        <br />
        <span>Penelitian Ilmiah</span>
      </h1>

      {/* Subtitle */}
      <p className={styles.sub}>{siteConfig.tagline}</p>

      {/* CTA Buttons */}
      <div className={styles.btns}>
        <Link href="/daftar" className="btn-primary">
          Daftar Sekarang
        </Link>
        <Link href="/program" className="btn-outline">
          Lihat Program
        </Link>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        {siteConfig.stats.map((stat) => (
          <div key={stat.label} className={styles.statItem}>
            <div className={styles.statNum}>{stat.number}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
