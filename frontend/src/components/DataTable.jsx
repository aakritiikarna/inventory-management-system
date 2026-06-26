import LoadingSpinner from "./LoadingSpinner";

/**
 * Generic data table.
 *
 * columns: [{ key, header, render?(row) }]
 * pagination: { count, page, pageSize, onPageChange }
 *   - count is DRF's PageNumberPagination `count` field.
 */
export default function DataTable({ columns, rows, isLoading, emptyMessage = "No records found.", pagination }) {
  if (isLoading) return <LoadingSpinner />;

  if (!rows || rows.length === 0) {
    return (
      <div className="card text-center text-sm text-slate-500 py-12">
        {emptyMessage}
      </div>
    );
  }

  const totalPages = pagination ? Math.max(1, Math.ceil(pagination.count / pagination.pageSize)) : 1;

  return (
    <div className="card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id ?? idx} className="hover:bg-slate-50">
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
          <span className="text-xs text-slate-500">
            Page {pagination.page} of {totalPages} &middot; {pagination.count} total
          </span>
          <div className="flex gap-2">
            <button
              className="btn-secondary px-3 py-1.5"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              Previous
            </button>
            <button
              className="btn-secondary px-3 py-1.5"
              disabled={pagination.page >= totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
