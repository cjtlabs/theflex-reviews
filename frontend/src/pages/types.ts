export type HostawayReviewResponse = {
  status: "success" | "error";
  result: HostawayReview[];
};

export type HostawayReviewCategory = {
  category: "cleanliness" | "communication" | "respect_house_rules";
  rating: number;
};

export type HostawayReview = {
  id: number;
  type: "host-to-guest" | "guest-to-host";
  status: "published" | "draft" | "hidden";
  rating: number | null;
  publicReview: string | null;
  reviewCategory: HostawayReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel: string;
  hidden: boolean;
};

export type NormalizedHostawayReview = {
  property: string;
  propertySlug: string;
  categoryAverage: number | null;
  monthKey: string | null;
  submittedAtDate: Date | null;
} & HostawayReview;
