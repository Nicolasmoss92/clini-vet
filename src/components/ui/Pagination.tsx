interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
      <p className="text-xs text-gray-400">
        {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} de {total} agendamentos
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(0)}
          disabled={page === 0}
          className="px-2 py-1 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
        >
          «
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="px-3 py-1 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
        >
          ‹ Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => i)
          .filter((i) => i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1)
          .reduce<(number | '...')[]>((acc, i, idx, arr) => {
            if (
              idx > 0 &&
              typeof arr[idx - 1] === 'number' &&
              (i as number) - (arr[idx - 1] as number) > 1
            )
              acc.push('...');
            acc.push(i);
            return acc;
          }, [])
          .map((item, idx) =>
            item === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-xs text-gray-400">
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => onPageChange(item as number)}
                className={`w-8 h-7 text-xs rounded-lg border transition ${
                  page === item
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {(item as number) + 1}
              </button>
            ),
          )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages - 1}
          className="px-3 py-1 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
        >
          Próxima ›
        </button>
        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={page === totalPages - 1}
          className="px-2 py-1 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
        >
          »
        </button>
      </div>
    </div>
  );
}
