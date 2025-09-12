import type { Filters } from "../components/types";
import type {
  HostawayReview,
  HostawayReviewCategory,
  NormalizedHostawayReview,
} from "../pages/types";
import { parseDate } from "./format";

export const SLUG = (s = "") =>
  (s || "")
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const calculateAverageScore = (
  categories: HostawayReviewCategory[] = []
) => {
  const valid = (categories || [])
    .map((category) => category?.rating)
    .filter((n) => typeof n === "number");
  if (!valid.length) return null;
  return (
    Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10
  );
};

export const normalizeReviews = (
  reviews: HostawayReview[] = []
): NormalizedHostawayReview[] => {
  return (reviews || []).map((review) => {
    const submitted = parseDate(review?.submittedAt);
    const monthKey = submitted
      ? `${submitted.getFullYear()}-${String(submitted.getMonth() + 1).padStart(
          2,
          "0"
        )}`
      : null;
    const property = review?.listingName || "Unknown";
    const propertySlug = SLUG(property);
    const categoryAverage =
      calculateAverageScore(review?.reviewCategory) ?? review?.rating ?? null;
    const channel = review?.channel || "Direct";
    return {
      ...review,
      submittedAtDate: submitted,
      monthKey,
      property,
      propertySlug,
      categoryAverage,
      channel,
    };
  });
};

export const groupBy = (
  reviews: NormalizedHostawayReview[],
  keyFn: (review: NormalizedHostawayReview) => void
) => {
  const map = new Map();
  for (const review of reviews) {
    const key = keyFn(review);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(review);
  }
  return map;
};

export const propertyMetrics = (
  normalized: NormalizedHostawayReview[] = []
) => {
  const groups = groupBy(
    normalized,
    (r: NormalizedHostawayReview) => r.propertySlug
  );
  const result = [];
  for (const [slug, reviews] of groups.entries()) {
    const name = reviews[0]?.property || slug;
    const total = reviews.length;
    const visible = reviews.filter(
      (r: NormalizedHostawayReview) => !r.hidden
    ).length;
    const avg = (() => {
      const vals: [number] = reviews
        .map((review: NormalizedHostawayReview) =>
          typeof review.categoryAverage === "number"
            ? review.categoryAverage
            : null
        )
        .filter((categoryAverage: number | null) => categoryAverage != null);
      if (!vals.length) return null;
      return (
        Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
      );
    })();

    const metrics: {
      channels: { [key: string]: number };
      types: { [key: string]: number };
      issues: { [key: string]: number };
    } = { channels: {}, types: {}, issues: {} };

    for (const review of reviews)
      metrics.channels[review.channel] =
        (metrics.channels[review.channel] || 0) + 1;

    for (const review of reviews)
      metrics.types[review.type] = (metrics.types[review.type] || 0) + 1;

    for (const review of reviews) {
      for (const categoryItem of review.reviewCategory || []) {
        if (
          typeof categoryItem?.rating === "number" &&
          categoryItem.rating <= 6
        ) {
          const key = categoryItem.category;
          metrics.issues[key] = (metrics.issues[key] || 0) + 1;
        }
      }
    }
    const topIssues = Object.entries(metrics.issues)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => ({ category: k, count: v }));
    result.push({
      slug,
      name,
      total,
      visible,
      avg,
      channels: metrics.channels,
      types: metrics.types,
      topIssues,
    });
  }

  return result.sort((a, b) => b.total - a.total);
};

export const filterReviews = (
  normalized: NormalizedHostawayReview[] = [],
  filters: Filters = {
    query: "",
    score: "all",
    includeHidden: false,
    type: "all",
    category: "all",
    channel: "all",
    time: "all",
    sort: "newest",
  }
) => {
  const {
    type = "all",
    category = "all",
    channel = "all",
    time = "all",
    sort = "newest",
    score = "all",
  } = filters;
  let reviews = [...normalized];
  if (type !== "all")
    reviews = reviews.filter((review) => review.type === type);
  if (channel !== "all")
    reviews = reviews.filter((review) => review.channel === channel);
  if (category !== "all") {
    reviews = reviews.filter((review) =>
      (review.reviewCategory || []).some((cat) => cat.category === category)
    );
  }
  if (time !== "all") {
    const now = new Date();
    const cutoff = new Date(now);
    if (time === "30d") cutoff.setDate(now.getDate() - 30);
    else if (time === "90d") cutoff.setDate(now.getDate() - 90);
    else if (time === "1y") cutoff.setFullYear(now.getFullYear() - 1);
    reviews = reviews.filter(
      (review) => review.submittedAt && new Date(review.submittedAt) >= cutoff
    );
  }
  if (score !== "all") {
    reviews = reviews.filter((review: NormalizedHostawayReview) => {
      const averageScore = review.categoryAverage;
      if (averageScore == null) return false;
      if (score === ">=9") return averageScore >= 9;
      if (score === ">=7") return averageScore >= 7;
      if (score === "<7") return averageScore < 7;
      return true;
    });
  }
  reviews.sort((a, b) => {
    const aDate = new Date(a.submittedAt);
    const bDate = new Date(b.submittedAt);
    if (sort === "newest")
      return (bDate?.getTime() || 0) - (aDate?.getTime() || 0);
    if (sort === "oldest")
      return (aDate?.getTime() || 0) - (bDate?.getTime() || 0);
    if (sort === "highest")
      return (b.categoryAverage || 0) - (a.categoryAverage || 0);
    if (sort === "lowest")
      return (a.categoryAverage || 0) - (b.categoryAverage || 0);
    return 0;
  });
  return reviews;
};
