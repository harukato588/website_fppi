import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { beritaData } from "@/lib/config";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
    title: "Berita | UKM FPPI",
    description: "Kumpulan berita, kegiatan, dan pengumuman terbaru dari UKM FPPI.",
};

export default function BeritaPage() {
    return (
        <>
            <Navbar />
            <main>
                {/* HERO HEADER */}
                <section className={styles.pageHero}>
                    <div className={styles.pageHeroContent}>
                        <p className={styles.pageHeroLabel}>Info Proposal PKM FPPI 2025 &amp; Kegiatan</p>
                        <h1 className={styles.pageHeroTitle}>Info Terbaru dari FPPI</h1>
                        <p className={styles.pageHeroDesc}>
                            Temukan berita, kegiatan, dan pengumuman terkini seputar UKM Forum Penalaran Penelitian Ilmiah.
                        </p>
                    </div>
                </section>

                {/* DAFTAR BERITA */}
                <section className={styles.listSection}>
                    <div className={styles.listGrid}>
                        {beritaData.map((item) => {
                            const hasPdf = 'pdfUrl' in item && item.pdfUrl;
                            const href = hasPdf ? item.pdfUrl as string : `/berita/${item.slug}`;
                            return (
                                <Link
                                    key={item.id}
                                    href={href}
                                    className={styles.card}
                                    target={hasPdf ? "_blank" : undefined}
                                    rel={hasPdf ? "noopener noreferrer" : undefined}
                                >
                                    <div className={styles.cardImg}>
                                        <img src={item.image} alt={item.title} />
                                        <span className={styles.cardBadge}>{item.category}</span>
                                        {hasPdf && (
                                            <span className={styles.pdfBadge}>📄 PDF</span>
                                        )}
                                    </div>
                                    <div className={styles.cardBody}>
                                        <p className={styles.cardDate}>📅 {item.date}</p>
                                        <h2 className={styles.cardTitle}>{item.title}</h2>
                                        <span className={styles.cardLink}>
                                            {hasPdf ? "Lihat Proposal →" : "Baca Selengkapnya →"}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}