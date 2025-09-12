import type { HostawayReview } from "../../pages/types";

export type ReviewCardProps = {
  review: HostawayReview;
  onToggleHidden: (id: number, hidden: boolean) => void;
  onOpen: () => void;
};
