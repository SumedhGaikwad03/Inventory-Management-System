import React from 'react';
import { Button } from './Button.tsx';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.875rem 1rem',
        borderTop: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.875rem',
        color: '#64748b',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>
          Showing <strong>{startItem}</strong>-<strong>{endItem}</strong> of <strong>{totalItems}</strong> items
        </span>

        {onPageSizeChange && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.5rem' }}>
            <span>| Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid #cbd5e1',
                fontSize: '0.8125rem',
                outline: 'none',
                backgroundColor: '#ffffff',
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>

        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#334155' }}>
          Page {currentPage} of {Math.max(totalPages, 1)}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
