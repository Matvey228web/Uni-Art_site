"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type Props = {
  src: string;
  title: string;
  onClose: () => void;
};

/** Модальное окно с встроенным плеером (YouTube/Vimeo embed-URL). */
export default function VideoModal({ src, title, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  // Окно рисуется прямо в body. Анимация дрожания на main делает его
  // содержащим блоком для fixed-потомков, и модалка уехала бы вниз страницы.
  // На сервере окна не существует: оно появляется только по клику.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="eyebrow">{title}</p>
          <button
            ref={closeRef}
            onClick={onClose}
            className="rounded-full border border-line px-4 py-1.5 text-sm text-muted transition hover:border-accent hover:text-fg"
          >
            Закрыть
          </button>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-line bg-black">
          <iframe
            src={src}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
