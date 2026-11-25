import Link from "next/link";
import { type Berita } from "@/lib/config";
import { getBeritaList } from "@/lib/supabase";
import styles from "./BeritaSection.module.css";

function BeritaCard({ item }: { item: Berita }) {
  const hasPdf = Boolean(item.pdfUrl || (item as any).pdf_url);
  const isJurnal = item.category.toLowerCase().includes("jurnal");
  return (
    <Link
      href={`/berita/${item.slug}`}
      className={styles.card}
    >
      <div className={styles.thumb}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=70"}
          alt={item.title}
        />
        {hasPdf && (
          <span className={styles.pdfBadge}>
            {isJurnal ? "📚 JURNAL" : "📄 PDF"}
          </span>
        )}
      </div>
      <div className={styles.body}>
        <span className={styles.cat}>{item.category}</span>
        <h3 className={styles.title}>{item.title}</h3>
        <span className={styles.date}>{item.date}</span>
      </div>
    </Link>
  );
}

export default async function BeritaSection() {
  const beritaList = await getBeritaList();

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <span className="section-tag">Informasi &amp; Publikasi</span>
          <h2 className="section-title">
            Berita &amp; <span>Jurnal Ilmiah</span>
          </h2>
        </div>
        <Link href="/berita" className={styles.seeAll}>
          Lihat semua berita &amp; jurnal →
        </Link>
      </div>

      <div className={styles.grid}>
        {beritaList.map((item) => (
          <BeritaCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
