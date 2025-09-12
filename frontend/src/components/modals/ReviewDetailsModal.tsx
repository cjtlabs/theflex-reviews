import Modal from "./Modal";
import { formatDate, scoreColor } from "../../utils/format";
import type { ReviewModalProps } from "./types";
import { calculateAverageScore } from "../../utils/analytics";

export default function ReviewDetailsModal({
  open,
  onClose,
  review,
  onToggleHidden,
}: ReviewModalProps) {
  if (!review) return null;

  const average = calculateAverageScore(review?.reviewCategory);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <img
              src={`https://i.pravatar.cc/96?u=${encodeURIComponent(
                review?.guestName || "Guest"
              )}`}
              alt={review?.guestName || "Guest"}
              className="h-12 w-12 rounded-full object-cover"
              loading="lazy"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  {review?.guestName}
                </h3>
                {average != null && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${scoreColor(
                      Math.round(average)
                    )}`}
                  >
                    Avg {average}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {review?.listingName} • {formatDate(review?.submittedAt)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 grid place-items-center rounded-lg border border-slate-300 hover:bg-slate-50"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {review?.publicReview && (
          <p className="mt-4 text-base leading-relaxed text-slate-700 italic whitespace-pre-line">
            “{review.publicReview}”
          </p>
        )}

        {Array.isArray(review?.reviewCategory) &&
          review.reviewCategory.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {review.reviewCategory.map((c, i) => (
                <div
                  key={i}
                  className={`text-xs px-2 py-1 rounded-lg ${scoreColor(
                    c?.rating
                  )}`}
                >
                  <span className="capitalize">
                    {c?.category?.replaceAll("_", " ")}
                  </span>
                  : <b>{c?.rating}</b>
                </div>
              ))}
            </div>
          )}

        <div className="mt-4 flex items-center justify-end">
          {typeof review?.hidden === "boolean" && (
            <button
              onClick={() => onToggleHidden?.(review.id, review.hidden)}
              className="text-xs px-2 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              {review.hidden ? "Unhide" : "Hide"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
