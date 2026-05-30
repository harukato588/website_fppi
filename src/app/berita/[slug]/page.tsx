"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { beritaData } from "@/lib/config";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { motion, Variants } from "framer-motion";
import React, { useEffect } from "react";

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
  const berita = beritaData.find((b) => b.slug === slug);
  
  useEffect(() => {
    if (berita && 'pdfUrl' in berita && berita.pdfUrl) {
      router.push(berita.pdfUrl as string);
    }
  }, [berita, router]);

  if (!berita) notFound();

  // Jika berita memiliki properti pdfUrl, kita tampilkan loading sebentar (atau null)
  // karena useEffect akan menangani redirect.
  if ('pdfUrl' in berita && berita.pdfUrl) {
    return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Membuka PDF...</div>;
  }

  return (
    <>
      <Navbar />
      <main>
        {/* HERO FOTO */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
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
              <Link href="/berita">Berita</Link>
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
              <span>✍️ Tim FPPI</span>
            </motion.div>
          </div>
        </section>

        {/* ISI ARTIKEL */}
        <section className={styles.article}>
          <motion.div
            className={styles.articleInner}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p variants={itemVariants} className={styles.lead}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </motion.p>
            <motion.p variants={itemVariants}>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </motion.p>
            <motion.p variants={itemVariants}>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </motion.p>
            <motion.p variants={itemVariants}>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed
              quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </motion.p>
          </motion.div>
        </section>

        {/* BACK BUTTON */}
        <motion.div
          className={styles.backWrap}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/berita" className={styles.backBtn}>
            ← Kembali ke Berita
          </Link>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}