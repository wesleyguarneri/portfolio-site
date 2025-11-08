"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./gallery-grid.module.css";
import type { GalleryPhoto } from "./gallery.types";

type Props = {
  photos: GalleryPhoto[];
};

export default function GalleryGrid({ photos }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showNext = useCallback(() => {
    if (!photos.length) {
      return;
    }

    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }
      return (current + 1) % photos.length;
    });
  }, [photos.length]);

  const showPrevious = useCallback(() => {
    if (!photos.length) {
      return;
    }

    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }
      return (current - 1 + photos.length) % photos.length;
    });
  }, [photos.length]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
      if (event.key === "ArrowRight") {
        showNext();
      }
      if (event.key === "ArrowLeft") {
        showPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeIndex, closeLightbox, showNext, showPrevious]);

  const introCopy = useMemo(() => {
    if (!photos.length) {
      return "Awaiting frames from the latest scan.";
    }

    return `Currently featuring ${photos.length} frames curated from recent rolls.`;
  }, [photos.length]);

  if (!photos.length) {
    return <p className={styles.emptyState}>{introCopy}</p>;
  }

  return (
    <>
      <p className={styles.galleryIntro}>{introCopy}</p>
      <div className={styles.grid} role="list">
        {photos.map((photo, index) => (
          <button
            key={photo.filename}
            type="button"
            className={styles.card}
            onClick={() => openLightbox(index)}
            aria-label={`Expand ${photo.label}`}
          >
            <div className={styles.asset}>
              <Image
                src={photo.src}
                alt={`${photo.label} - ${photo.note}`}
                width={1200}
                height={1800}
                quality={85}
                sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 3}
              />
              <span className={styles.assetLabel}>{photo.label}</span>
            </div>

            <div className={styles.cardMeta}>
              <div>
                <p>{photo.note}</p>
                <span>
                  {photo.camera} / {photo.filmStock}
                </span>
              </div>
              <span className={styles.zoomHint}>View</span>
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        activeIndex={activeIndex}
        photos={photos}
        onClose={closeLightbox}
        onNext={showNext}
        onPrevious={showPrevious}
      />
    </>
  );
}

type LightboxProps = {
  activeIndex: number | null;
  photos: GalleryPhoto[];
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

function Lightbox({ activeIndex, photos, onClose, onNext, onPrevious }: LightboxProps) {
  if (activeIndex === null || !photos[activeIndex]) {
    return null;
  }

  const frame = photos[activeIndex];

  return (
    <div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={`${frame.label} viewer`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <button className={styles.dismiss} type="button" onClick={onClose}>
        Close
      </button>

      <div className={styles.lightboxContent}>
        <div className={styles.lightboxMeta}>
          <p>{frame.label}</p>
          <h3>{frame.note}</h3>
          <span>
            {frame.camera} / {frame.filmStock}
          </span>
        </div>

        <div className={styles.lightboxImage}>
          <Image
            src={frame.src}
            alt={frame.note}
            fill
            sizes="(max-width: 1200px) 90vw, 70vw"
            quality={90}
            priority
          />
        </div>
      </div>

      <div className={styles.lightboxControls}>
        <button type="button" onClick={onPrevious}>
          Previous
        </button>
        <button type="button" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
}
