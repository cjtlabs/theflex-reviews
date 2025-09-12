import { useEffect, useMemo, useState } from "react";
import { getReviews, hideReview, showReview } from "../services/api";
import ReviewCard from "../components/cards/ReviewCard";
import FilterBar from "../components/FilterBar";
import ReviewDetailsModal from "../components/modals/ReviewDetailsModal";
import { normalizeReviews, filterReviews } from "../utils/analytics";
import ConfirmModal from "../components/modals/ConfirmModal";
import type { HostawayReview, NormalizedHostawayReview } from "./types";
import type { Filters } from "../components/types";

export default function Reviews() {
  const [reviews, setReviews] = useState<HostawayReview[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    query: "",
    score: "all",
    includeHidden: true,
    type: "all",
    category: "all",
    channel: "all",
    time: "all",
    sort: "newest",
  });
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<HostawayReview | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<{
    id: number;
    hidden: boolean;
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    getReviews(filters.includeHidden)
      .then(setReviews)
      .finally(() => setLoading(false));
  }, [filters.includeHidden]);

  const filtered = useMemo(() => {
    const query = (filters.query || "").toLowerCase();
    let normalized: NormalizedHostawayReview[] | HostawayReview[] =
      normalizeReviews(reviews || []);

    if (!filters.includeHidden)
      normalized = normalized.filter((r) => !r.hidden);

    if (query) {
      normalized = normalized.filter(
        (r) =>
          (r.guestName || "").toLowerCase().includes(query) ||
          (r.listingName || "").toLowerCase().includes(query) ||
          (r.publicReview || "").toLowerCase().includes(query)
      );
    }

    normalized = filterReviews(
      normalized as NormalizedHostawayReview[],
      filters
    );
    return normalized;
  }, [reviews, filters]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-1/2 bg-slate-200 rounded animate-pulse" />
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white rounded-2xl shadow animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Reviews Management
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Reviews accross all properties.
        </p>
      </section>
      <FilterBar filters={filters} onChange={setFilters} />
      {filtered.length === 0 ? (
        <div className="text-center border border-dashed border-slate-300 rounded-xl p-8 bg-white">
          <div className="text-sm text-slate-600">
            No reviews match your filters.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onOpen={() => {
                setSelected(review);
                setOpen(true);
              }}
              onToggleHidden={(id: number, hidden: boolean) => {
                setConfirmData({ id, hidden });
                setConfirmOpen(true);
              }}
            />
          ))}
        </div>
      )}
      <ReviewDetailsModal
        open={open}
        onClose={() => setOpen(false)}
        review={selected}
        onToggleHidden={(id: number, hidden: boolean) => {
          setConfirmData({ id, hidden });
          setConfirmOpen(true);
        }}
      />
      <ConfirmModal
        open={confirmOpen}
        title={confirmData?.hidden ? "Make Review Public" : "Hide Review"}
        message={
          confirmData?.hidden
            ? "Are you sure you want to make this review visible to the public?"
            : "Are you sure you want to hide this review from the public?"
        }
        confirmLabel={confirmData?.hidden ? "Make Public" : "Hide"}
        tone={confirmData?.hidden ? "warning" : "danger"}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmData(null);
        }}
        onConfirm={async () => {
          if (!confirmData) return;
          const { id, hidden } = confirmData;
          try {
            const updated = hidden
              ? await showReview(id)
              : await hideReview(id);
            setReviews((prev: HostawayReview[]) =>
              prev.map((r) => (r.id === id ? updated : r))
            );
            setSelected((prev: HostawayReview | null) =>
              prev && prev.id === id ? updated : prev
            );
            window.dispatchEvent(new Event("reviews-updated"));
          } catch (e) {
            console.error("Failed to toggle visibility", e);
          } finally {
            setConfirmOpen(false);
            setConfirmData(null);
          }
        }}
      />
    </div>
  );
}
