import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { divisiData } from "@/lib/config";
import { getAnggotaByDivisi } from "@/lib/supabase";
import Link from "next/link";
import styles from "./page.module.css";
import React from "react";

export default async function DetailDivisiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const divisi = divisiData.find((d) => d.id === id);

  if (!divisi) {
    return (
      <div style={{ padding: 100, color: "white" }}>
        <h1>404 Halaman Tidak Ditemukan</h1>
        <p>Divisi tidak ditemukan.</p>
      </div>
    );
  }

  const anggotaList = await getAnggotaByDivisi(id);
  const listToRender =
    anggotaList.length > 0
      ? anggotaList
      : divisi.anggota.map((a, idx) => ({
          id: idx,
          divisi_id: id,
          nama: a.nama,
          jabatan: a.jabatan,
          foto: a.foto,
        }));

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
            <h1 className={styles.heroTitle}>{divisi.nama}</h1>
            <p className={styles.heroSub}>FPPI UKM • 2024–2025</p>
            <div className={styles.heroStats}>
              <div className={styles.statBox}>
                <div className={styles.statNum}>{listToRender.length}</div>
                <div className={styles.statLabel}>Anggota</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statNum}>{divisi.jumlahProgram}</div>
                <div className={styles.statLabel}>Program Kerja</div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Anggota Divisi</h2>
            <p className={styles.sectionSub}>
              Tim solid yang bergerak bersama untuk mencapai visi divisi
            </p>
          </div>
          <div className={styles.grid}>
            {listToRender.map((anggota, index) => (
              <div key={anggota.id || index} className={styles.card}>
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
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}