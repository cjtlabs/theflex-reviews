import { useState } from "react";
import Modal from "./Modal";
import type { ConfirmModalProps } from "./types";

export default function ConfirmModal({
  open,
  title = "Please Confirm",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "warning",
  requireAck = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [ack, setAck] = useState(false);

  const color =
    tone === "warning"
      ? "text-amber-600"
      : tone === "danger"
      ? "text-rose-600"
      : "text-slate-600";
  const icon = (
    <svg
      className={`h-12 w-12 ${color}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M10.29 3.86a2 2 0 0 1 3.42 0l8 13.86A2 2 0 0 1 20 21H4a2 2 0 0 1-1.71-3.28l8-13.86zM12 9a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0v-4a1 1 0 0 0-1-1zm0 8a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z" />
    </svg>
  );

  const handleClose = () => {
    setAck(false);
    onCancel?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
    setAck(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentClassName="rounded-md bg-white shadow-lg border border-slate-200 max-w-md"
    >
      <div className="p-6 text-center">
        <div className="flex justify-center mb-3">{icon}</div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}

        {requireAck && (
          <label className="mt-4 inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
            />
            I understand and want to proceed
          </label>
        )}

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded border border-slate-300 text-sm hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={requireAck && !ack}
            className={`px-4 py-2 rounded text-sm text-white ${
              tone === "danger"
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-amber-600 hover:bg-amber-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
