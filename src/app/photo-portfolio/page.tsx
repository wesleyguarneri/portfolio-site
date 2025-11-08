import fs from "node:fs";
import path from "node:path";
import GalleryGrid from "./gallery-grid";
import type { GalleryPhoto } from "./gallery.types";
import styles from "./photo-portfolio.module.css";

const photoDirectory = path.join(process.cwd(), "public", "photos");
const filmStocks = ["Portra 400", "Cinestill 800T", "Fujifilm 200", "Portra 160"];
const cameraBodies = ["Canon AE-1", "Contax T2", "Mamiya 7ii", "Nikon F3"];
const travelNotes = [
  "Blue hour on State Street",
  "Rain clinging to the window seat",
  "Citrus grove at noon",
  "Late-night platform glow",
  "Soft light in the conservatory",
];

function readPhotos(): GalleryPhoto[] {
  if (!fs.existsSync(photoDirectory)) {
    return [];
  }

  return fs
    .readdirSync(photoDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
    .sort()
    .map((filename, index) => {
      const slug = filename.replace(/\.[^/.]+$/, "");
      return {
        src: `/photos/${filename}`,
        filename,
        slug,
        label: `Frame ${String(index + 1).padStart(2, "0")}`,
        filmStock: filmStocks[index % filmStocks.length],
        camera: cameraBodies[index % cameraBodies.length],
        note: travelNotes[index % travelNotes.length],
      };
    });
}

export default function PhotoPortfolioPage() {
  const photos = readPhotos();
  const totalFrames = photos.length;

  return (
    <main className={styles.canvas}>
      <section className={styles.infoRail}>
        <p className={styles.overline}>Archive &amp; Gallery</p>
        <div className={styles.headlineGroup}>
          <h1>Analog fragments curated like a contact sheet.</h1>
          <p>
            A rolling field journal of portraits, documentary fragments, and travel
            notes. Shot on 35mm, scanned at high resolution, then sequenced to reward
            slow scrolling.
          </p>
        </div>

        <div className={styles.legend}>
          {["Portraits", "Documentary", "Travel"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <dl className={styles.stats}>
          <div>
            <dt>Total frames</dt>
            <dd>{totalFrames.toString().padStart(2, "0")}</dd>
          </div>
          <div>
            <dt>Formats</dt>
            <dd>35mm / 120</dd>
          </div>
          <div>
            <dt>On rotation</dt>
            <dd>{filmStocks.slice(0, 3).join(" / ")}</dd>
          </div>
        </dl>

        <div className={styles.scheduleCard}>
          <div>
            <p>Next drop</p>
            <h2>Nov 21</h2>
          </div>
          <div>
            <p>Location</p>
            <h2>Chicago &amp; Lisbon</h2>
          </div>
        </div>
      </section>

      <section className={styles.galleryRail}>
        <GalleryGrid photos={photos} />
      </section>
    </main>
  );
}
