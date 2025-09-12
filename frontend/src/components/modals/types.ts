import type { HostawayReview } from "../../pages/types";

export type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "warning" | "danger";
  requireAck?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  contentClassName?: string;
};

export type ReviewModalProps = {
  open: boolean;
  onClose: () => void;
  review: HostawayReview | null;
  onToggleHidden: (id: number, hidden: boolean) => void;
};
