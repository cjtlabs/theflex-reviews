import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import FilterBar from "../../components/FilterBar";
import Review from "../../components/cards/ReviewCard";
import ReviewDetailsModal from "../../components/modals/ReviewDetailsModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { getReviews, hideReview, showReview } from "../../services/api";
import {
  normalizeReviews,
  propertyMetrics,
  filterReviews,
} from "../../utils/analytics";
import type { HostawayReview } from "../types";

export default function PropertyDetails() {
  const { slug } = useParams();
  const [reviews, setReviews] = useState<HostawayReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
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
    getReviews(true)
      .then((data) => setReviews(data || []))
      .finally(() => setLoading(false));
  }, []);

  const normalized = useMemo(() => normalizeReviews(reviews || []), [reviews]);
  const propertyItems = useMemo(
    () => normalized.filter((r) => r.propertySlug === slug),
    [normalized, slug]
  );
  const metrics = useMemo(
    () => propertyMetrics(propertyItems),
    [propertyItems]
  );
  const summary = metrics[0] || {
    name: slug,
    avg: null,
    total: 0,
    visible: 0,
    channels: {},
    types: {},
    topIssues: [],
  };

  const filtered = useMemo(() => {
    let arr = [...propertyItems];
    if (!filters.includeHidden) arr = arr.filter((r) => !r.hidden);
    const q = (filters.query || "").toLowerCase();
    if (q) {
      arr = arr.filter(
        (r) =>
          (r.guestName || "").toLowerCase().includes(q) ||
          (r.listingName || "").toLowerCase().includes(q) ||
          (r.publicReview || "").toLowerCase().includes(q)
      );
    }
    arr = filterReviews(arr, filters);
    return arr;
  }, [propertyItems, filters]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 w-full bg-slate-200 rounded-xl animate-pulse" />
        <div className="h-8 w-1/3 bg-slate-200 rounded animate-pulse" />
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
          Property Details
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Detailed information of the property.
        </p>
      </section>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="aspect-[16/7] bg-slate-100">
          <img
            src={`https://picsum.photos/seed/${encodeURIComponent(
              slug ?? ""
            )}/1280/560`}
            alt={summary.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
              {summary.name}
            </h1>
            {summary.avg != null && (
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                Avg {summary.avg}
              </span>
            )}
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-700">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
              <div className="text-xs text-slate-500">Reviews</div>
              <div className="font-semibold">
                {summary.visible} visible / {summary.total} total
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
              <div className="text-xs text-slate-500">Channels</div>
              <div className="font-semibold">
                {Object.entries(summary.channels).map(([k, v]) => (
                  <span key={k} className="inline-block mx-1 text-xs">
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
              <div className="text-xs text-slate-500">Top Issues</div>
              <div className="font-semibold">
                {summary.topIssues.length ? (
                  summary.topIssues.map((ti, i) => (
                    <span key={i} className="inline-block mx-1 text-xs">
                      {ti.category.replaceAll("_", " ")} ({ti.count})
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">None</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-5">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* Reviews list */}
      {filtered.length === 0 ? (
        <div className="mt-4 text-center border border-dashed border-slate-300 rounded-xl p-8 bg-white">
          <div className="text-sm text-slate-600">
            No reviews match your filters.
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((review) => (
            <Review
              key={review.id}
              review={review}
              onOpen={() => {
                setSelected(review);
                setOpen(true);
              }}
              onToggleHidden={(id, hidden) => {
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
        onToggleHidden={(id, hidden) => {
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
            setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
            setSelected((prev) => (prev && prev.id === id ? updated : prev));
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
