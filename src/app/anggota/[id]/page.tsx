"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { divisiData } from "@/lib/config";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import React from "react";

import { motion, Variants } from "framer-motion";

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
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function DetailDivisiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const divisi = divisiData.find((d) => d.id === id);
  // if (!divisi) notFound();
  
  if (!divisi) {
    return (
      <div style={{ padding: 100, color: 'white' }}>
        <h1>404 DEBUG</h1>
        <p>ID passed from URL: "{id}"</p>
        <p>Type of ID: {typeof id}</p>
        <p>Available IDs: {divisiData.map(d => d.id).join(", ")}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <img src={divisi.foto} alt={divisi.nama} className={styles.heroBgImg} />
            <div className={styles.heroOverlay} />
          </div>
          <div className={styles.heroContent}>
            <div className={styles.breadcrumb}>
              <Link href="/">Beranda</Link>
              <span>›</span>
              <Link href="/anggota">Divisi</Link>
              <span>›</span>
              <span className={styles.breadcrumbActive}>{divisi.nama}</span>
            </div>
            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {divisi.nama}
            </motion.h1>
            <motion.p
              className={styles.heroSub}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              FPPI UKM • 2024–2025
            </motion.p>
            <motion.div
              className={styles.heroStats}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.statBox}>
                <div className={styles.statNum}>{divisi.jumlahAnggota}</div>
                <div className={styles.statLabel}>Anggota</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statNum}>{divisi.jumlahProgram}</div>
                <div className={styles.statLabel}>Program Kerja</div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Anggota Divisi</h2>
            <p className={styles.sectionSub}>
              Tim solid yang bergerak bersama untuk mencapai visi divisi
            </p>
          </div>
          <motion.div
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {divisi.anggota.map((anggota, index) => (
              <motion.div key={index} variants={itemVariants} className={styles.card}>
                <div className={styles.photoWrap}>
                  <img
                    src={anggota.foto}
                    alt={anggota.nama}
                    className={styles.photo}
                  />
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardName}>{anggota.nama}</div>
                  <div className={styles.cardJabatan}>{anggota.jabatan}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}