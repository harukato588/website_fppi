import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { programData } from "@/lib/config";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export default async function DetailProgramPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const program = programData.find((p) => p.slug === slug);
    if (!program) notFound();

    const otherPrograms = programData.filter((p) => p.slug !== slug);

    return (
        <>
            <Navbar />
            <main>
                {/* HERO */}
                <section className={styles.hero}>
                    <div className={styles.heroBg}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={program.image} alt={program.judul} className={styles.heroBgImg} />
                        <div className={styles.heroOverlay} />
                    </div>
                    <div className={styles.heroContent}>
                        <div className={styles.breadcrumb}>
                            <Link href="/">Beranda</Link>
                            <span>›</span>
                            <Link href="/program">Program</Link>
                            <span>›</span>
                            <span className={styles.breadcrumbActive}>{program.judul}</span>
                        </div>
                        <div className={styles.badges}>
                            <span className={styles.catBadge}>{program.kategori}</span>
                            <span className={`${styles.statusBadge} ${program.status === "Selesai" ? styles.statusDone : styles.statusPlan}`}>
                                {program.status}
                            </span>
                        </div>
                        <h1 className={styles.heroTitle}>{program.judul}</h1>
                        <div className={styles.heroMeta}>
                            <span>📅 {program.tanggal}</span>
                        </div>
                    </div>
                </section>

                {/* DETAIL */}
                <section className={styles.detail}>
                    <div className={styles.detailInner}>
                        <div className={styles.mainContent}>
                            <h2 className={styles.subTitle}>Tentang Program</h2>
                            <p className={styles.desc}>{program.deskripsi}</p>
                            <p className={styles.desc}>
                                Program ini merupakan salah satu program unggulan FPPI yang bertujuan untuk meningkatkan kualitas dan kapasitas anggota dalam bidang penalaran, penelitian, dan penulisan karya ilmiah. Seluruh anggota diharapkan dapat berpartisipasi aktif demi kelancaran dan kesuksesan program ini.
                            </p>

                            <div style={{ marginTop: 32, padding: "20px 24px", background: "rgba(59, 127, 245, 0.08)", borderRadius: "12px", border: "1px solid rgba(59, 127, 245, 0.2)" }}>
                                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: 6 }}>Tertarik Berkolaborasi atau Mengikuti Kegiatan Ini?</h4>
                                <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: 16 }}>Hubungi pengurus atau panitia divisi terkait untuk informasi pendaftaran dan jadwal lengkap.</p>
                                <Link href="/daftar" className="btn-primary" style={{ fontSize: "13px", padding: "8px 18px" }}>
                                    Informasi Pendaftaran &amp; Kolaborasi →
                                </Link>
                            </div>
                        </div>

                        {/* TIM PELAKSANA & INFO */}
                        <div className={styles.sidebar}>
                            <div className={styles.timCard}>
                                <h3 className={styles.timTitle}>👥 Tim Pelaksana</h3>
                                <div className={styles.timList}>
                                    {program.timPelaksana.map((t, i) => (
                                        <div key={i} className={styles.timItem}>
                                            <div className={styles.timAvatar}>
                                                {t.nama.charAt(0)}
                                            </div>
                                            <div>
                                                <div className={styles.timNama}>{t.nama}</div>
                                                <div className={styles.timPeran}>{t.peran}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.infoCard}>
                                <h3 className={styles.timTitle}>📋 Info Program</h3>
                                <div className={styles.infoList}>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Kategori</span>
                                        <span className={styles.infoVal}>{program.kategori}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Status</span>
                                        <span className={styles.infoVal}>{program.status}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Tanggal</span>
                                        <span className={styles.infoVal}>{program.tanggal}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* OTHER PROGRAMS & BACK */}
                <div className={styles.backWrap} style={{ paddingTop: 0 }}>
                    <div style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: "15px", color: "var(--muted)", marginBottom: 12 }}>
                            Program Kerja Lainnya:
                        </h3>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            {otherPrograms.slice(0, 3).map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/program/${p.slug}`}
                                    className="btn-outline"
                                    style={{ fontSize: "12px", padding: "6px 14px" }}
                                >
                                    {p.judul} →
                                </Link>
                            ))}
                        </div>
                    </div>

                    <Link href="/program" className={styles.backBtn}>
                        ← Kembali ke Semua Program
                    </Link>
                </div>
            </main>
            <Footer />
        </>
    );
}
