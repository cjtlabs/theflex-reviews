export default function Stars({ value = 0, max = 5, className = "" }) {
  const full = Math.round(Math.max(0, Math.min(max, value)));
  return (
    <div
      className={`inline-flex items-center gap-0.5 text-amber-500 ${className}`}
      aria-label={`${full} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className="text-lg leading-none select-none">
          {i < full ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}
