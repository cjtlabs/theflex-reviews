import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getReviews } from "../../services/api";
import { normalizeReviews, propertyMetrics } from "../../utils/analytics";

export default function Properties() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getReviews(true)
      .then((data) => setReviews(data || []))
      .finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(
    () => propertyMetrics(normalizeReviews(reviews)),
    [reviews]
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-1/2 bg-slate-200 rounded animate-pulse" />
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-white rounded-2xl shadow animate-pulse"
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
          Properties Management
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Performance across properties based on all reviews.
        </p>
      </section>

      {metrics.length === 0 ? (
        <div className="text-center border border-dashed border-slate-300 rounded-xl p-8 bg-white">
          <div className="text-sm text-slate-600">No properties yet.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((property) => (
            <Link
              key={property.slug}
              to={`/dashboard/management/properties/${property.slug}`}
              className="group block overflow-hidden rounded-xl border border-slate-200 bg-white hover:shadow"
            >
              <div className="aspect-[16/9] bg-slate-100">
                <img
                  src={`https://picsum.photos/seed/${encodeURIComponent(
                    property.slug
                  )}/640/360`}
                  alt={property.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 truncate">
                    {property.name}
                  </h3>
                  {property.avg != null && (
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                      Avg {property.avg}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {property.visible} visible / {property.total} total
                </div>
                <div className="mt-3">
                  <div className="text-xs text-slate-700 mb-1">Top issues</div>
                  {property.topIssues.length === 0 ? (
                    <div className="text-xs text-slate-500">
                      No recurring issues
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {property.topIssues.map((topIssue, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                        >
                          {topIssue.category.replaceAll("_", " ")} (
                          {topIssue.count})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
