import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { programData } from "@/lib/config";
import Link from "next/link";
import styles from "./page.module.css";

export default function ProgramPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* HEADER */}
        <section className={styles.header}>
          <div>
            <span className="section-tag">Kegiatan</span>
            <h1 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginTop: "8px" }}>
              Program <span>Kerja</span>
            </h1>
            <p className="section-sub">
              Berbagai program unggulan FPPI yang dirancang untuk mengembangkan potensi anggota dan mengharumkan nama organisasi.
            </p>
          </div>
        </section>

        {/* GRID PROGRAM */}
        <section className={styles.section}>
          <div className={styles.grid}>
            {programData.map((program) => (
              <Link key={program.id} href={`/program/${program.slug}`} className={styles.card}>
                <div className={styles.thumb}>
                  <img src={program.image} alt={program.judul} className={styles.thumbImg} />
                  <span className={`${styles.status} ${program.status === "Selesai" ? styles.statusDone : styles.statusPlan}`}>
                    {program.status}
                  </span>
                </div>
                <div className={styles.body}>
                  <div className={styles.meta}>
                    <span className={styles.cat}>{program.kategori}</span>
                    <span className={styles.tanggal}>📅 {program.tanggal}</span>
                  </div>
                  <h3 className={styles.judul}>{program.judul}</h3>
                  <p className={styles.desc}>{program.deskripsi}</p>
                  <div className={styles.tim}>
                    <span className={styles.timLabel}>👥 Tim Pelaksana</span>
                    {program.timPelaksana.map((t, i) => (
                      <div key={i} className={styles.timItem}>
                        <span className={styles.timNama}>{t.nama}</span>
                        <span className={styles.timPeran}>{t.peran}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}