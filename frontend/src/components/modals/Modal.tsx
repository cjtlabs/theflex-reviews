import { useEffect } from "react";
import type { ModalProps } from "./types";

export default function Modal({
  open,
  onClose,
  children,
  contentClassName,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: { key: string }) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={`relative z-10 w-full max-w-2xl ${
          contentClassName ||
          "rounded-2xl bg-white shadow-lg border border-slate-200"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
