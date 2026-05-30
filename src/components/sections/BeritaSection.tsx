import Link from "next/link";
import { beritaData, type Berita } from "@/lib/config";
import styles from "./BeritaSection.module.css";

function BeritaCard({ item }: { item: Berita }) {
  return (
    <Link href={`/berita/${item.slug}`} className={styles.card}>
      <div className={styles.thumb}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.title} />
      </div>
      <div className={styles.body}>
        <span className={styles.cat}>{item.category}</span>
        <h3 className={styles.title}>{item.title}</h3>
        <span className={styles.date}>{item.date}</span>
      </div>
    </Link>
  );
}

export default function BeritaSection() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <span className="section-tag">Informasi</span>
          <h2 className="section-title">
            Berita <span>Terkini</span>
          </h2>
        </div>
        <Link href="/berita" className={styles.seeAll}>
          Lihat semua berita →
        </Link>
      </div>

      <div className={styles.grid}>
        {beritaData.map((item) => (
          <BeritaCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
