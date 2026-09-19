import Link from "next/link";
import { contactData, navLinks, siteConfig } from "@/lib/config";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.brandName}>
            FPPI <span>UKM</span>
          </div>
          <p className={styles.brandDesc}>
            {siteConfig.fullName} — Wadah mahasiswa berprestasi dalam penelitian dan karya ilmiah.
          </p>
        </div>

        <div>
          <div className={styles.linksTitle}>Navigasi</div>
          <div className={styles.links}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.link}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.linksTitle}>Anggota</div>
          <div className={styles.links}>
            <Link href="/anggota" className={styles.link}>Daftar Anggota</Link>
            <Link href="/pengurus" className={styles.link}>Pengurus</Link>
            <Link href="/alumni" className={styles.link}>Alumni</Link>
          </div>
        </div>

        <div>
          <div className={styles.linksTitle}>Kontak</div>
          <div className={styles.links}>
            <a href={`https://wa.me/${contactData.whatsapp.replace(/\D/g, "")}`} className={styles.link} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href={`https://instagram.com/${contactData.instagram.replace("@", "")}`} className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={`mailto:${contactData.email}`} className={styles.link}>Email</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span suppressHydrationWarning>© {new Date().getFullYear()} UKM FPPI. Semua hak dilindungi.</span>
        <div className={styles.bottomRight}>
          <Link href="/admin" className={styles.adminLink} title="Akses Dashboard Admin">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="13" 
              height="13" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={styles.lockIcon}
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Admin Panel
          </Link>
          <span className={styles.dot}>•</span>
          <span>Dibuat dengan ❤️ oleh Tim FPPI</span>
        </div>
      </div>

      <div className={styles.bigText}>
        <span>FORUM PENALARAN <span className={styles.bigAccent}>PENELITIAN</span> ILMIAH</span>
      </div>
    </footer>
  );
}
