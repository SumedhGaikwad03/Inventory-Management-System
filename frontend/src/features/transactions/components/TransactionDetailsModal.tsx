import React from 'react';
import { Modal } from '../../../components/ui/Modal.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { Badge } from '../../../components/ui/Badge.tsx';
import type { InventoryTransactionResponseDto } from '../../../types/index.ts';
import { formatDate } from '../../../utils/formatters.ts';

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: InventoryTransactionResponseDto | null;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  if (!transaction) return null;

  const isPositive = transaction.quantityChanged > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Audit Details"
      description={`Record ID #${transaction.id}`}
      maxWidth="460px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.625rem',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <span style={{ color: '#64748b' }}>Product:</span>
            <strong style={{ color: '#0f172a' }}>{transaction.productName} (ID: {transaction.productId})</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <span style={{ color: '#64748b' }}>Transaction Type:</span>
            <Badge variant="default" size="sm">{transaction.transactionType}</Badge>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <span style={{ color: '#64748b' }}>Quantity Change:</span>
            <strong style={{ color: isPositive ? '#16a34a' : '#dc2626', fontSize: '1rem' }}>
              {isPositive ? `+${transaction.quantityChanged}` : transaction.quantityChanged} units
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <span style={{ color: '#64748b' }}>Logged By User:</span>
            <span style={{ fontWeight: 500, color: '#334155' }}>
              {transaction.username} (ID: {transaction.userId})
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Timestamp:</span>
            <span style={{ color: '#0f172a' }}>{formatDate(transaction.createdDate)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
