import { contactData } from "@/lib/config";
import styles from "./ContactSection.module.css";

const contactItems = [
  { icon: "📞", label: "Telepon", value: contactData.phone },
  { icon: "📱", label: "WhatsApp", value: contactData.whatsapp },
  { icon: "✉️", label: "Email", value: contactData.email },
  { icon: "📷", label: "Instagram", value: contactData.instagram },
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
            <div key={item.label} className={styles.row}>
              <div className={styles.iconWrap}>{item.icon}</div>
              <div>
                <div className={styles.infoLabel}>{item.label}</div>
                <div className={styles.infoVal}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
