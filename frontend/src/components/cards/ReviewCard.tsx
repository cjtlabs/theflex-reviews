import { formatDate, scoreColor } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";
import type { ReviewCardProps } from "./types";
import { calculateAverageScore } from "../../utils/analytics";

export default function ReviewCard({
  review,
  onToggleHidden,
  onOpen,
}: ReviewCardProps) {
  const auth = useAuth();
  const everage = calculateAverageScore(review?.reviewCategory);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md ${
        review?.hidden ? "opacity-60" : ""
      }`}
      onClick={() => onOpen?.()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen?.();
        }
      }}
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1">
          <img
            src={`https://i.pravatar.cc/96?u=${encodeURIComponent(
              review?.guestName || "Guest"
            )}`}
            alt={review?.guestName || "Guest"}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
            loading="lazy"
          />
          {everage != null && (
            <span
              className={`mt-1 text-[10px] px-2 py-0.5 rounded-full ${scoreColor(
                Math.round(everage)
              )}`}
            >
              Avg {everage}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-semibold text-slate-900 truncate">
                {review?.guestName}
              </h2>
              <div className="text-xs text-slate-500 truncate">
                {review?.listingName} • {formatDate(review?.submittedAt)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {review?.status && (
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 capitalize">
                  {review.status}
                </span>
              )}
              {auth?.user && typeof review?.hidden === "boolean" && (
                <button
                  className="text-xs px-2 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleHidden?.(review.id, review.hidden);
                  }}
                  title={review.hidden ? "Show review" : "Hide review"}
                >
                  {review.hidden ? "Unhide" : "Hide"}
                </button>
              )}
            </div>
          </div>
          {review?.publicReview && (
            <p className="mt-2 text-sm text-slate-700 italic whitespace-pre-line">
              “{review.publicReview}”
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {(review?.reviewCategory || []).map((c, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-1 rounded-lg ${scoreColor(
                  c?.rating
                )}`}
              >
                <span className="capitalize">
                  {(c?.category || "").replaceAll("_", " ")}
                </span>
                : <b>{c?.rating}</b>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
