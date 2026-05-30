import { ketuaData,  }  from "@/lib/config";
import styles from "./KetuaSection.module.css";

export default function KetuaSection() {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.info}>
          <span className={styles.tag}> Sambutan</span>
          <h2 className={styles.name}>{ketuaData.name}</h2>
          <p className={styles.role}>{ketuaData.role}</p>
          <p className={styles.desc}>{ketuaData.description}</p>
          <div className={styles.namaFormal}>{ketuaData.nameFormal}</div>
        </div>
        <div className={styles.photoWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ketuaData.photo} alt={ketuaData.name} className={styles.photo}></img>
        </div>
      </div>
    </section>
  )
}