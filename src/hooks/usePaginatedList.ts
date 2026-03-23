import { useState } from 'react';

export function usePaginatedList<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(items.length / pageSize);
  const paginated = items.slice(page * pageSize, (page + 1) * pageSize);
  const pageStart = items.length === 0 ? 0 : page * pageSize + 1;
  const pageEnd = Math.min((page + 1) * pageSize, items.length);

  return { page, setPage, paginated, totalPages, pageStart, pageEnd };
}
