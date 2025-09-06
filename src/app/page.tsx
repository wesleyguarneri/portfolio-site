import Image from "next/image";
import styles from "./page.module.css";
import PhotoPortfolioPage from "./photo-portfolio/page";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <PhotoPortfolioPage></PhotoPortfolioPage>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
