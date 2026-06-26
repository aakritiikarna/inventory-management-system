/**
 * Shared search + filter bar used at the top of every list page.
 * `filters` is an array of { label, value, onChange, options: [{value,label}] }
 * rendered as <select> dropdowns next to the search box.
 */
export default function SearchFilterBar({ search, onSearchChange, filters = [], actions }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <input
        type="text"
        className="input max-w-xs"
        placeholder="Search..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {filters.map((f) => (
        <select
          key={f.label}
          className="input w-auto max-w-[160px]"
          value={f.value}
          onChange={(e) => f.onChange(e.target.value)}
        >
          <option value="">{f.label}</option>
          {f.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
      <div className="flex-1" />
      {actions}
    </div>
  );
}
