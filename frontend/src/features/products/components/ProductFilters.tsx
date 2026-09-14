import React, { useState, useEffect } from 'react';
import type { ProductQueryDto } from '../../../types/index.ts';
import { Button } from '../../../components/ui/Button.tsx';

interface ProductFiltersProps {
  query: ProductQueryDto;
  onQueryChange: (newQuery: Partial<ProductQueryDto>) => void;
  onReset: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  query,
  onQueryChange,
  onReset,
}) => {
  const [searchInput, setSearchInput] = useState(query.search || '');

  // Keep local search input in sync if query.search is cleared from outside
  useEffect(() => {
    setSearchInput(query.search || '');
  }, [query.search]);

  // Debounce search input changes (300ms) without third party libraries
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = searchInput.trim();
      if ((query.search || '') !== trimmed) {
        onQueryChange({ search: trimmed || undefined });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput, onQueryChange, query.search]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      onQueryChange({ sortBy: undefined, sortOrder: 'asc' });
      return;
    }

    const [sortBy, sortOrder] = value.split(':');
    onQueryChange({ sortBy, sortOrder });
  };

  const currentSortValue =
    query.sortBy ? `${query.sortBy}:${query.sortOrder || 'asc'}` : '';

  const hasActiveFilters =
    Boolean(query.search) || Boolean(query.lowStock) || Boolean(query.sortBy);

  return (
    <div
      className="card"
      style={{
        padding: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.875rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '360px' }}>
          <span
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>

          <input
            type="text"
            placeholder="Search products by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 2rem 0.5rem 2.25rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />

          {searchInput && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setSearchInput('');
                onQueryChange({ search: undefined });
              }}
              style={{
                position: 'absolute',
                right: '0.625rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Low Stock Toggle Button */}
        <button
          type="button"
          onClick={() => onQueryChange({ lowStock: !query.lowStock })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.8125rem',
            fontWeight: 500,
            border: `1px solid ${query.lowStock ? '#f59e0b' : '#cbd5e1'}`,
            backgroundColor: query.lowStock ? '#fef3c7' : '#ffffff',
            color: query.lowStock ? '#b45309' : '#475569',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Low Stock Only
        </button>

        {/* Sort Selector */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          <select
            value={currentSortValue}
            onChange={handleSortChange}
            aria-label="Sort products"
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.8125rem',
              outline: 'none',
              backgroundColor: '#ffffff',
              color: '#334155',
            }}
          >
            <option value="">Sort: Default</option>
            <option value="name:asc">Name (A to Z)</option>
            <option value="name:desc">Name (Z to A)</option>
            <option value="price:asc">Price (Low to High)</option>
            <option value="price:desc">Price (High to Low)</option>
            <option value="quantity:asc">Stock (Low to High)</option>
            <option value="quantity:desc">Stock (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset Filters
        </Button>
      )}
    </div>
  );
};
