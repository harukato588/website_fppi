"use client";
 
import Link from "next/link";
import { divisiData } from "@/lib/config";
import styles from "./DivisiGrid.module.css";
 
export default function DivisiGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {divisiData.map((divisi) => (
          <Link
            key={divisi.id}
            href={`/anggota/${divisi.id}`}
            className={styles.card}
          >
            {/* Background foto */}
            <div className={styles.cardBg}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={divisi.foto} alt={divisi.nama} className={styles.cardImg} />
              <div className={styles.cardOverlay} />
            </div>
 
            {/* Arrow icon */}
            <div className={styles.arrow}>→</div>
 
            {/* Content */}
            <div className={styles.cardContent}>
              <h2 className={styles.cardName}>{divisi.nama}</h2>
              <p className={styles.cardDesc}>{divisi.deskripsi}</p>
              <div className={styles.cardStats}>
                <span className={styles.statBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  {divisi.jumlahAnggota} Anggota
                </span>
                <span className={styles.statBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  {divisi.jumlahProgram} Program
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}