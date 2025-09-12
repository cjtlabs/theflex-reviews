import type { FilterBarProps } from "./types";

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const {
    query = "",
    score = "all",
    includeHidden = true,
    type = "all",
    category = "all",
    channel = "all",
    time = "all",
    sort = "newest",
  } = filters || {};

  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
      <div className="flex-1">
        <label className="sr-only" htmlFor="search">
          Search
        </label>
        <input
          id="search"
          type="search"
          placeholder="Search by guest, listing, or text..."
          value={query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          className="w-full rounded-lg border border-slate-300 bg-white px-6 py-0.5 text-sm outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label htmlFor="score" className="text-sm text-slate-600">
            Score
          </label>
          <select
            id="score"
            value={score}
            onChange={(e) => onChange({ ...filters, score: e.target.value })}
            className="rounded-lg border px-2 py-0.5 border-slate-300 bg-white text-sm"
          >
            <option value="all">All</option>
            <option value=">=9">≥ 9</option>
            <option value=">=7">≥ 7</option>
            <option value="<7">&lt; 7</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="type" className="text-sm text-slate-600">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => onChange({ ...filters, type: e.target.value })}
            className="rounded-lg border px-2 py-0.5 border-slate-300 bg-white text-sm"
          >
            <option value="all">All</option>
            <option value="host-to-guest">Host → Guest</option>
            <option value="guest-to-host">Guest → Host</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="channel" className="text-sm text-slate-600">
            Channel
          </label>
          <select
            id="channel"
            value={channel}
            onChange={(e) => onChange({ ...filters, channel: e.target.value })}
            className="rounded-lg border px-2 py-0.5 border-slate-300 bg-white text-sm"
          >
            <option value="all">All</option>
            <option value="Airbnb">Airbnb</option>
            <option value="Booking">Booking</option>
            <option value="Expedia">Expedia</option>
            <option value="Direct">Direct</option>
            <option value="VRBO">VRBO</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="category" className="text-sm text-slate-600">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="rounded-lg border px-2 py-0.5 border-slate-300 bg-white text-sm"
          >
            <option value="all">All</option>
            <option value="cleanliness">Cleanliness</option>
            <option value="communication">Communication</option>
            <option value="respect_house_rules">House rules</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="time" className="text-sm text-slate-600">
            Time
          </label>
          <select
            id="time"
            value={time}
            onChange={(e) => onChange({ ...filters, time: e.target.value })}
            className="rounded-lg border px-2 py-0.5 border-slate-300 bg-white text-sm"
          >
            <option value="all">All</option>
            <option value="30d">Last 30d</option>
            <option value="90d">Last 90d</option>
            <option value="1y">Last 1y</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-slate-600">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value })}
            className="rounded-md border px-2 py-0.5 border-slate-300 bg-white text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
          </select>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={includeHidden}
            onChange={(e) =>
              onChange({ ...filters, includeHidden: e.target.checked })
            }
          />
          Include hidden
        </label>
        <button
          onClick={() =>
            onChange({
              query: "",
              score: "all",
              includeHidden: true,
              type: "all",
              category: "all",
              channel: "all",
              time: "all",
              sort: "newest",
            })
          }
          className="rounded-lg border border-slate-300 px-2 py-0.5 text-sm hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
