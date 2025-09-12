export type Filters = {
  query: string;
  score: string;
  includeHidden: boolean;
  type: string;
  category: string;
  channel: string;
  time: string;
  sort: string;
};

export type FilterBarProps = {
  filters: Filters;
  onChange: React.Dispatch<React.SetStateAction<Filters>>;
};
