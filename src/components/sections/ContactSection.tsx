import { contactData } from "@/lib/config";
import styles from "./ContactSection.module.css";

const contactItems = [
  {
    icon: "✉️",
    label: "Email Resmi",
    value: contactData.email,
    href: `mailto:${contactData.email}`,
    external: false,
  },
  {
    icon: "📷",
    label: "Instagram Organisasi",
    value: "@fppi_itda",
    href: `https://www.instagram.com/fppi_itda/`,
    external: true,
  },
];

export default function ContactSection() {
  return (
    <section className={styles.section}>
      <div className={styles.center}>
        <span className="section-tag">Hubungi Kami</span>
        <h2 className="section-title">
          Contact <span>Us</span>
        </h2>
      </div>

      <div className={styles.inner}>
        <div className={styles.logoWrap}>
          <div className={styles.logoCircle}>FPPI</div>
          <div className={styles.logoName}>UKM FPPI</div>
          <p className={styles.logoSub}>
            Forum Penalaran
            <br />
            Penelitian Ilmiah
          </p>
        </div>

        <div className={styles.list}>
          {contactItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={styles.row}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              title={`Klik untuk membuka ${item.label}`}
            >
              <div className={styles.iconWrap}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div className={styles.infoLabel}>{item.label}</div>
                <div className={styles.infoVal} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{item.value}</span>
                  <span style={{ fontSize: "11px", color: "var(--blue2)" }}>↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
