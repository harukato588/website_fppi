import { contactData } from "@/lib/config";
import styles from "./ContactSection.module.css";

const contactItems = [
  {
    icon: "📞",
    label: "Telepon Resmi",
    value: contactData.phone,
    href: `tel:${contactData.phone.replace(/\s+/g, "")}`,
    external: false,
  },
  {
    icon: "📱",
    label: "WhatsApp Panitia & Info",
    value: contactData.whatsapp,
    href: `https://wa.me/${contactData.whatsapp.replace(/\D/g, "")}?text=Halo%20UKM%20FPPI,%20saya%20ingin%20bertanya%20seputar%20kegiatan%20dan%20informasi%20FPPI.`,
    external: true,
  },
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
