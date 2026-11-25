"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getBeritaBySlug } from "@/lib/supabase";
import { Berita } from "@/lib/config";
import { isValidHttpOrRelativeUrl } from "@/lib/validation";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { motion, Variants } from "framer-motion";
import React, { useEffect, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function DetailBeritaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const router = useRouter();
  const [berita, setBerita] = useState<Berita | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getBeritaBySlug(slug).then((res) => {
      if (isMounted) {
        setBerita(res);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#94a3b8" }}>
        Memuat data publikasi...
      </div>
    );
  }

  if (!berita) notFound();

  const rawPdfLink = (berita.pdfUrl || (berita as any).pdf_url || "") as string;
  const hasPdf = Boolean(rawPdfLink && isValidHttpOrRelativeUrl(rawPdfLink));
  const pdfLink = hasPdf ? rawPdfLink : "";
  const isJurnal = (berita.category || "").toLowerCase().includes("jurnal");

  return (
    <>
      <Navbar />
      <main>
        {/* HERO FOTO */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={berita.image} alt={berita.title} className={styles.heroBgImg} />
            <div className={styles.heroOverlay} />
          </div>
          <div className={styles.heroContent}>
            <motion.div
              className={styles.breadcrumb}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href="/">Beranda</Link>
              <span>›</span>
              <Link href="/berita">Berita &amp; Jurnal</Link>
              <span>›</span>
              <span className={styles.breadcrumbActive}>{berita.category}</span>
            </motion.div>
            <motion.span
              className={styles.catBadge}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {berita.category}
            </motion.span>
            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {berita.title}
            </motion.h1>
            <motion.div
              className={styles.heroMeta}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span>📅 {berita.date}</span>
              <span>✍️ Tim Riset &amp; Publikasi FPPI</span>
              {hasPdf && <span>📄 Dokumen PDF Tersedia</span>}
            </motion.div>
          </div>
        </section>

        {/* TAMPILAN DOKUMEN JURNAL / PDF */}
        {hasPdf ? (
          <section className={styles.pdfSection}>
            <div className={styles.pdfCard}>
              <div className={styles.pdfHeader}>
                <div className={styles.pdfTitle}>
                  <span>{isJurnal ? "📚 Pratinjau Jurnal Ilmiah" : "📄 Pratinjau Dokumen PDF"}</span>
                </div>
                <div className={styles.pdfActions}>
                  <a
                    href={pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.pdfBtn}
                  >
                    📥 Unduh / Buka Fullscreen ↗
                  </a>
                </div>
              </div>

              {/* EMBEDDED PDF VIEWER */}
              <iframe
                src={pdfLink}
                title={berita.title}
                className={styles.pdfFrame}
              />

              <div className={styles.pdfNotice}>
                <span>💡 Dokumen jurnal dimuat langsung dari repository publikasi FPPI.</span>
                <a
                  href={pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--blue2)", textDecoration: "underline" }}
                >
                  Klik di sini jika PDF tidak tampil otomatis di browser Anda
                </a>
              </div>
            </div>
          </section>
        ) : (
          /* ISI ARTIKEL TEKS BIASA */
          <section className={styles.article}>
            <motion.div
              className={styles.articleInner}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.p variants={itemVariants} className={styles.lead}>
                Informasi dan rilis resmi terkait {berita.title} yang diterbitkan oleh Forum Penalaran Penelitian Ilmiah (FPPI).
              </motion.p>
              <motion.p variants={itemVariants}>
                FPPI senantiasa mendorong partisipasi aktif mahasiswa dalam berbagai kegiatan penelitian,
                penulisan karya tulis ilmiah, serta keikutsertaan dalam ajang kompetisi tingkat nasional maupun internasional.
              </motion.p>
              <motion.p variants={itemVariants}>
                Untuk informasi lebih lanjut mengenai kegiatan dan program ini, silakan hubungi pengurus divisi terkait melalui kontak resmi FPPI.
              </motion.p>
            </motion.div>
          </section>
        )}

        {/* BACK BUTTON */}
        <motion.div
          className={styles.backWrap}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/berita" className={styles.backBtn}>
            ← Kembali ke Daftar Berita &amp; Jurnal
          </Link>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}