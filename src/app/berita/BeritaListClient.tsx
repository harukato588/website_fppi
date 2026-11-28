"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Berita } from "@/lib/config";
import { isValidHttpOrRelativeUrl } from "@/lib/validation";
import styles from "./page.module.css";

export default function BeritaListClient({ initialBerita }: { initialBerita: Berita[] }) {
  const [selectedFilter, setSelectedFilter] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredList = initialBerita.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    if (selectedFilter === "semua") return true;
    if (selectedFilter === "jurnal") {
      return item.category.toLowerCase().includes("jurnal") || item.category.toLowerCase().includes("karya");
    }
    if (selectedFilter === "proposal") {
      return item.category.toLowerCase().includes("proposal") || item.category.toLowerCase().includes("pkm");
    }
    if (selectedFilter === "berita") {
      return !item.category.toLowerCase().includes("jurnal") && !item.category.toLowerCase().includes("proposal");
    }
    return true;
  });

  const totalJurnal = initialBerita.filter((b) =>
    b.category.toLowerCase().includes("jurnal") || b.category.toLowerCase().includes("karya")
  ).length;

  const totalProposal = initialBerita.filter((b) =>
    b.category.toLowerCase().includes("proposal") || b.category.toLowerCase().includes("pkm")
  ).length;

  return (
    <section className={styles.listSection}>
      {/* FILTER & SEARCH */}
      <div className={styles.filterWrap}>
        <button
          className={`${styles.filterBtn} ${selectedFilter === "semua" ? styles.filterBtnActive : ""}`}
          onClick={() => setSelectedFilter("semua")}
        >
          Semua Publikasi ({initialBerita.length})
        </button>
        <button
          className={`${styles.filterBtn} ${selectedFilter === "jurnal" ? styles.filterBtnActive : ""}`}
          onClick={() => setSelectedFilter("jurnal")}
        >
          📚 Jurnal &amp; Karya Ilmiah {totalJurnal > 0 ? `(${totalJurnal})` : ""}
        </button>
        <button
          className={`${styles.filterBtn} ${selectedFilter === "proposal" ? styles.filterBtnActive : ""}`}
          onClick={() => setSelectedFilter("proposal")}
        >
          💡 Proposal PKM {totalProposal > 0 ? `(${totalProposal})` : ""}
        </button>
        <button
          className={`${styles.filterBtn} ${selectedFilter === "berita" ? styles.filterBtnActive : ""}`}
          onClick={() => setSelectedFilter("berita")}
        >
          📢 Kegiatan &amp; Pengumuman
        </button>
      </div>

      {/* SEARCH BAR INPUT */}
      <div style={{ maxWidth: 1200, margin: "0 auto 28px", display: "flex", justifyContent: "flex-end" }}>
        <input
          type="text"
          placeholder="Cari judul jurnal, dokumen, atau kegiatan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "10px",
            padding: "10px 16px",
            color: "#fff",
            fontSize: "0.9rem",
            width: "100%",
            maxWidth: "360px",
            outline: "none",
          }}
        />
      </div>

      {/* DAFTAR KARTU BERITA & JURNAL */}
      {filteredList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
          Tidak ada dokumen atau berita yang sesuai dengan pencarian Anda.
        </div>
      ) : (
        <div className={styles.listGrid}>
          {filteredList.map((item) => {
            const rawPdfLink = (item.pdfUrl || (item as any).pdf_url || "") as string;
            const hasPdf = Boolean(rawPdfLink && isValidHttpOrRelativeUrl(rawPdfLink));
            const pdfLink = hasPdf ? rawPdfLink : "";
            const isJurnal = item.category.toLowerCase().includes("jurnal");
            const isProposal = item.category.toLowerCase().includes("proposal") || item.category.toLowerCase().includes("pkm");

            return (
              <div key={item.id} className={styles.card}>
                <Link
                  href={`/berita/${item.slug}`}
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                >
                  <div className={styles.cardImg}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute(
                          "src",
                          "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=70"
                        );
                      }}
                    />
                    <span className={styles.cardBadge}>{item.category}</span>
                    {hasPdf && (
                      <span className={isJurnal ? styles.journalBadge : styles.pdfBadge}>
                        {isJurnal ? "📚 JURNAL PDF" : "📄 PDF"}
                      </span>
                    )}
                  </div>
                </Link>

                <div className={styles.cardBody}>
                  <p className={styles.cardDate}>📅 {item.date}</p>
                  <Link
                    href={`/berita/${item.slug}`}
                    style={{ textDecoration: "none", color: "inherit", flex: 1 }}
                  >
                    <h2 className={styles.cardTitle}>{item.title}</h2>
                  </Link>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "auto",
                      paddingTop: 12,
                    }}
                  >
                    <Link href={`/berita/${item.slug}`} className={styles.cardLink}>
                      {isJurnal
                        ? "Baca Jurnal 📄 →"
                        : isProposal
                        ? "Lihat Proposal 📄 →"
                        : hasPdf
                        ? "Buka Dokumen 📄 →"
                        : "Baca Selengkapnya →"}
                    </Link>
                    {hasPdf && (
                      <a
                        href={pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "0.75rem",
                          color: "#38bdf8",
                          background: "rgba(56, 189, 248, 0.1)",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: "1px solid rgba(56, 189, 248, 0.2)",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        Unduh PDF ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
