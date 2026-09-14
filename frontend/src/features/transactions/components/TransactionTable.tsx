import React from 'react';
import type { InventoryTransactionResponseDto } from '../../../types/index.ts';
import { formatDate } from '../../../utils/formatters.ts';
import { Badge } from '../../../components/ui/Badge.tsx';
import { Button } from '../../../components/ui/Button.tsx';

interface TransactionTableProps {
  transactions: InventoryTransactionResponseDto[];
  onViewDetails: (transaction: InventoryTransactionResponseDto) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onViewDetails,
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
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Quantity Changed</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Logged By</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Timestamp</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right', width: '100px' }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const isPositive = tx.quantityChanged > 0;

              return (
                <tr
                  key={tx.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.1s ease',
                  }}
                >
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                    {tx.productName}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <Badge variant="default" size="sm">
                      {tx.transactionType}
                    </Badge>
                  </td>
                  <td
                    style={{
                      padding: '0.875rem 1rem',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      color: isPositive ? '#16a34a' : '#dc2626',
                    }}
                  >
                    {isPositive ? `+${tx.quantityChanged}` : tx.quantityChanged} units
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>
                    {tx.username}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                    {formatDate(tx.createdDate)}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(tx)}
                      title="View Transaction Details"
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
