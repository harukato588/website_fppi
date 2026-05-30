import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { programData } from "@/lib/config";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

export default function DetailProgramPage({
    params,
}: {
    params: { slug: string };
}) {
    const program = programData.find((p) => p.slug === params.slug);
    if (!program) notFound();

    return (
        <>
            <Navbar />
            <main>
                {/* HERO */}
                <section className={styles.hero}>
                    <div className={styles.heroBg}>
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
                                Program ini merupakan salah satu program unggulan FPPI yang bertujuan untuk meningkatkan kualitas dan kapasitas anggota dalam bidang penelitian dan karya ilmiah. Seluruh anggota diharapkan dapat berpartisipasi aktif demi kelancaran dan kesuksesan program ini.
                            </p>
                        </div>

                        {/* TIM PELAKSANA */}
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

                <div className={styles.backWrap}>
                    <Link href="/program" className={styles.backBtn}>
                        ← Kembali ke Program
                    </Link>
                </div>
            </main>
            <Footer />
        </>
    );
}