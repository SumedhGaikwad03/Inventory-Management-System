import React from 'react';
import type { CategoryResponseDto } from '../../../types/index.ts';
import { formatDate } from '../../../utils/formatters.ts';
import { Button } from '../../../components/ui/Button.tsx';


// it receives catagories form the parent 
interface CategoryTableProps {
  categories: CategoryResponseDto[];
  isAdmin: boolean;
  onEdit: (category: CategoryResponseDto) => void;
  onDelete: (category: CategoryResponseDto) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Description</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Created</th>
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
            {categories.map((category) => (
              <tr
                key={category.id}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background-color 0.1s ease',
                }}
              >
                <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                  {category.name}
                </td>
                <td style={{ padding: '0.875rem 1rem', color: '#475569', maxWidth: '320px' }}>
                  {category.description || (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                      No description
                    </span>
                  )}
                </td>
                <td style={{ padding: '0.875rem 1rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {formatDate(category.createdDate)}
                </td>
                {isAdmin && (
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(category)}// this travels back to the main parent 
                        // page so it shows the the edit modal 
                        title="Edit Category"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(category)}
                        // same this proprs bubble upwards and the catgori api then handels it form 
                        // the catagiry page 
                        title="Delete Category"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
