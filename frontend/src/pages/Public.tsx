import { useEffect, useState } from "react";
import { getReviews } from "../services/api";
import type { HostawayReview } from "./types";
import { calculateAverageScore } from "../utils/analytics";

export default function Public() {
  const [reviews, setReviews] = useState<HostawayReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setLoading(true);
    getReviews(false)
      .then((data) => setReviews((data || []).filter((r: any) => !r.hidden)))
      .finally(() => setLoading(false));
  }, []);

  const images = [1, 2, 3, 4, 5, 6].map(
    (i) => `https://picsum.photos/seed/flex-${i}/1600/1200`
  );
  const propertyName = "1 Bed Flat near Westfield";
  const propertyReviews = (reviews || []).filter(
    (r) => (r?.listingName || "") === propertyName
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] md:h-[520px]">
        <img
          src={images[0]}
          alt="Property"
          className="col-span-2 row-span-2 h-full w-full object-cover rounded-lg"
          loading="lazy"
        />
        <img
          src={images[1]}
          alt="Property"
          className="h-full w-full object-cover rounded-lg"
          loading="lazy"
        />
        <img
          src={images[2]}
          alt="Property"
          className="h-full w-full object-cover rounded-lg"
          loading="lazy"
        />
        <img
          src={images[3]}
          alt="Property"
          className="h-full w-full object-cover rounded-lg"
          loading="lazy"
        />
        <div className="relative">
          <img
            src={images[4]}
            alt="Property"
            className="h-full w-full object-cover rounded-lg"
            loading="lazy"
          />
          <button className="absolute bottom-2 right-2 rounded-md bg-black/70 text-white text-xs px-3 py-1.5 hover:bg-black/80">
            View all photos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              1 Bed Flat near Westfield
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-slate-600">
              <span className="inline-flex items-center gap-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h7v-2.5c0-2.33-4.67-3.5-8-3.5z" />
                </svg>{" "}
                2 guests
              </span>
              <span className="inline-flex items-center gap-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21 10V7a2 2 0 0 0-2-2h-3V3H8v2H5a2 2 0 0 0-2 2v3h18zM3 12v7h18v-7H3z" />
                </svg>{" "}
                1 bedroom
              </span>
              <span className="inline-flex items-center gap-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M10 4a2 2 0 0 0-2 2v7H4a2 2 0 1 0 0 4h12a3 3 0 0 0 3-3V6a2 2 0 1 0-4 0v5h-3V6a2 2 0 0 0-2-2z" />
                </svg>{" "}
                1 bathroom
              </span>
              <span className="inline-flex items-center gap-1">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm1 15h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1 .45-1.9 1.17-2.58l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                </svg>{" "}
                Wi‑Fi
              </span>
            </div>
          </div>

          <section
            id="about"
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <h2 className="text-base font-semibold text-slate-900">
              About this property
            </h2>
            <p className="mt-2 text-sm text-slate-700">
              A comfortable 1 bedroom apartment in Shepherd's Bush conveniently
              located near Westfield and tube. Perfect for business travel or a
              weekend London base.
            </p>
          </section>

          <section
            id="amenities"
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <h2 className="text-base font-semibold text-slate-900">
              Amenities
            </h2>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-slate-700">
              {[
                "Kitchen",
                "Wi‑Fi",
                "Washer",
                "Workspace",
                "Heating",
                "TV",
                "Essentials",
                "Dishwasher",
                "Microwave",
              ].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                  </svg>
                  {label}
                </span>
              ))}
            </div>
          </section>

          <section
            id="policies"
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <h2 className="text-base font-semibold text-slate-900">
              Stay Policies
            </h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Check-in</div>
                <div className="font-medium text-slate-800">3:00 PM</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Check-out</div>
                <div className="font-medium text-slate-800">10:00 AM</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Smoking</div>
                <div className="font-medium text-slate-800">No smoking</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Parties</div>
                <div className="font-medium text-slate-800">
                  No parties or events
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-base font-semibold text-slate-900">
              Cancellation policy
            </h2>
            <div className="mt-3 space-y-3 text-sm text-slate-700">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="font-medium text-slate-900">
                  For stays less than 28 days
                </div>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>Free cancellation within 48 hours of booking.</li>
                  <li>50% refund up to 7 days before check‑in.</li>
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="font-medium text-slate-900">
                  For stays of 28 days or more
                </div>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>Full refund if canceled 30 days before check‑in.</li>
                  <li>50% refund if canceled 14 days before check‑in.</li>
                </ul>
              </div>
            </div>
          </section>
          <section
            id="location"
            className="rounded-xl border border-slate-200 bg-white p-3"
          >
            <div className="h-[320px] w-full overflow-hidden rounded-lg">
              <iframe
                title="map"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-0.141%2C51.51%2C-0.11%2C51.53&layer=mapnik"
              />
            </div>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-8 md:p-10 text-center relative">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
              What Our Clients Think
            </h2>
            <p className="mt-2 text-slate-600 text-sm md:text-base max-w-3xl mx-auto">
              Hear from the companies we work with. Discover how our flexible
              corporate rental solutions help them simplify relocations, support
              staff, and secure reliable short- and long-term housing with ease.
            </p>
            {loading ? (
              <div className="mt-10 h-40 bg-slate-100 rounded-xl animate-pulse" />
            ) : propertyReviews.length === 0 ? (
              <div className="mt-10 text-sm text-slate-600">
                No public reviews yet.
              </div>
            ) : (
              (() => {
                const current =
                  propertyReviews[
                    (idx + propertyReviews.length) % propertyReviews.length
                  ];
                const avg =
                  (calculateAverageScore(current?.reviewCategory) as
                    | number
                    | null) ??
                  (typeof current?.rating === "number"
                    ? (current.rating as number)
                    : null);
                const stars = Math.max(
                  0,
                  Math.min(5, Math.round(((avg ?? 10) as number) / 2))
                );
                return (
                  <div className="mt-8">
                    <div className="text-emerald-800/30 mx-auto">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mx-auto"
                      >
                        <path d="M7 7h3v3H8.5A1.5 1.5 0 0 0 7 11.5V17H3v-5.5A4.5 4.5 0 0 1 7.5 7H7zm10 0h3v3h-1.5A1.5 1.5 0 0 0 17 11.5V17h-4v-5.5A4.5 4.5 0 0 1 17.5 7H17z" />
                      </svg>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <img
                        src={`https://i.pravatar.cc/120?u=${encodeURIComponent(
                          current?.guestName || "Guest"
                        )}`}
                        alt={current?.guestName || "Guest"}
                        className="h-16 w-16 rounded-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill={i < stars ? "currentColor" : "#e5e7eb"}
                        >
                          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    {current?.publicReview && (
                      <p className="mt-4 text-slate-700 italic text-base md:text-lg max-w-2xl mx-auto">
                        “{current.publicReview}”
                      </p>
                    )}
                    <div className="mt-4">
                      <div className="font-semibold">
                        {current?.guestName || "Guest"}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {current?.listingName || ""}
                      </div>
                    </div>
                    <button
                      aria-label="Previous"
                      onClick={() => setIdx((i) => i - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow"
                    >
                      ‹
                    </button>
                    <button
                      aria-label="Next"
                      onClick={() => setIdx((i) => i + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow"
                    >
                      ›
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-5">
                      {propertyReviews.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setIdx(i)}
                          className={`h-2.5 w-2.5 rounded-full ${
                            i ===
                            ((idx % propertyReviews.length) +
                              propertyReviews.length) %
                              propertyReviews.length
                              ? "bg-slate-900"
                              : "bg-slate-300"
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()
            )}
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="bg-[rgb(40_78_76_/_1)] text-white px-4 py-3">
              <div className="text-sm font-semibold">Book Your Stay</div>
              <div className="text-xs text-white/80">
                Select dates to see prices
              </div>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="rounded-lg border border-slate-300 overflow-hidden">
                <div className="grid grid-cols-3">
                  <button className="col-span-2 flex items-center gap-2 px-3 py-2 text-left">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-slate-600"
                    >
                      <path d="M7 10h5v5H7z" fill="none" />
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                    </svg>
                    <span className="text-slate-600">Select dates</span>
                  </button>
                  <button className="col-span-1 flex items-center justify-between gap-2 px-3 py-2 border-l border-slate-300">
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13z" />
                      </svg>
                      1
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-slate-500"
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>
                </div>
              </div>
              <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-400 text-white py-2 font-medium hover:bg-slate-500">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 10h5v5H7z" fill="none" />
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                </svg>
                Check availability
              </button>
              <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 text-slate-700 py-2 font-medium hover:bg-slate-50">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                Send Inquiry
              </button>
              <div className="pt-1 text-center text-xs text-slate-500 inline-flex items-center justify-center gap-2 w-full">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-slate-400"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm1.07-7.75-.9.92C12.45 13.9 12 14.5 12 16h-2v-.5c0-1 .45-1.9 1.17-2.58l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                </svg>
                Instant booking confirmation
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
