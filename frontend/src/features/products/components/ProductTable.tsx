import React from 'react';
import type { ProductResponseDto } from '../../../types/index.ts';
import { formatCurrency, formatDate } from '../../../utils/formatters.ts';
import { Badge } from '../../../components/ui/Badge.tsx';
import { Button } from '../../../components/ui/Button.tsx';

interface ProductTableProps {
  products: ProductResponseDto[];
  isAdmin: boolean;
  onEdit: (product: ProductResponseDto) => void;
  onDelete: (product: ProductResponseDto) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                color: '#64748b',
              }}
            >
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Product</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Price</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Stock Status</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Updated</th>
              {isAdmin && (
                <th
                  style={{
                    padding: '0.75rem 1rem',
                    fontWeight: 600,
                    textAlign: 'right',
                    width: '140px',
                  }}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isOutOfStock = product.quantity === 0;
              const isLowStock = product.quantity <= 5 && !isOutOfStock;

              return (
                <tr
                  key={product.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.1s ease',
                  }}
                >
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                    {product.name}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.125rem 0.5rem',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '4px',
                        fontSize: '0.8125rem',
                      }}
                    >
                      {product.categoryName || 'Uncategorized'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#0f172a', fontWeight: 500 }}>
                    {formatCurrency(product.price)}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {isOutOfStock ? (
                      <Badge variant="danger">Out of Stock (0)</Badge>
                    ) : isLowStock ? (
                      <Badge variant="warning">Low Stock ({product.quantity})</Badge>
                    ) : (
                      <span style={{ color: '#334155', fontWeight: 500 }}>
                        {product.quantity} units
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                    {formatDate(product.updatedDate || product.createdDate)}
                  </td>
                  {isAdmin && (
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(product)}
                          title="Edit Product"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDelete(product)}
                          title="Delete Product"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
