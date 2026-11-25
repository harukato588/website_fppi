import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getBeritaList } from "@/lib/supabase";
import BeritaListClient from "./BeritaListClient";
import styles from "./page.module.css";

export const metadata = {
    title: "Berita, Jurnal & Dokumen Riset | UKM FPPI",
    description: "Kumpulan jurnal ilmiah, proposal PKM, karya tulis, dan berita kegiatan terbaru dari UKM FPPI.",
};

export default async function BeritaPage() {
    const beritaList = await getBeritaList();

    return (
        <>
            <Navbar />
            <main>
                {/* HERO HEADER */}
                <section className={styles.pageHero}>
                    <div className={styles.pageHeroContent}>
                        <p className={styles.pageHeroLabel}>Publikasi Ilmiah &amp; Informasi Kegiatan</p>
                        <h1 className={styles.pageHeroTitle}>Berita, Jurnal &amp; Dokumen FPPI</h1>
                        <p className={styles.pageHeroDesc}>
                            Temukan publikasi jurnal penelitian, proposal PKM, karya tulis ilmiah, serta berita kegiatan terkini seputar UKM Forum Penalaran Penelitian Ilmiah.
                        </p>
                    </div>
                </section>

                {/* DAFTAR BERITA & JURNAL INTERAKTIF */}
                <BeritaListClient initialBerita={beritaList} />
            </main>
            <Footer />
        </>
    );
}
