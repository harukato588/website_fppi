import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { divisiData } from "@/lib/config";
import { getAnggotaByDivisi } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    notFound();
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

  // Divisi lain untuk navigasi cepat
  const otherDivisions = divisiData.filter((d) => d.id !== id);

  return (
    <>
      <Navbar />
      <main>
        {/* HERO DIVISI */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
            <p className={styles.heroSub}>{divisi.deskripsi}</p>
            <div className={styles.heroStats}>
              <div className={styles.statBox}>
                <div className={styles.statNum}>{listToRender.length}</div>
                <div className={styles.statLabel}>Anggota Aktif</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statNum}>{divisi.jumlahProgram}</div>
                <div className={styles.statLabel}>Program Kerja</div>
              </div>
            </div>
          </div>
        </section>

        {/* LIST ANGGOTA */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Anggota Divisi</h2>
            <p className={styles.sectionSub}>
              Tim solid yang berkolaborasi untuk mewujudkan visi dan misi divisi {divisi.nama}.
            </p>
          </div>
          <div className={styles.grid}>
            {listToRender.map((anggota, index) => (
              <div key={anggota.id || index} className={styles.card}>
                <div className={styles.photoWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={anggota.foto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=70"}
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

          {/* NAVIGASI DIVISI LAINNYA */}
          <div style={{ marginTop: 60, paddingTop: 40, borderTop: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "16px", color: "var(--muted)", marginBottom: 16 }}>
              Eksplorasi Divisi Lainnya:
            </h3>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {otherDivisions.map((other) => (
                <Link
                  key={other.id}
                  href={`/anggota/${other.id}`}
                  className="btn-outline"
                  style={{ fontSize: "13px", padding: "8px 16px" }}
                >
                  {other.nama} →
                </Link>
              ))}
              <Link
                href="/anggota"
                className="btn-primary"
                style={{ fontSize: "13px", padding: "8px 16px" }}
              >
                ← Semua Divisi
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
