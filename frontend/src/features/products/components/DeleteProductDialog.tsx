import React from 'react';
import { Modal } from '../../../components/ui/Modal.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import type { ProductResponseDto } from '../../../types/index.ts';
import { formatCurrency } from '../../../utils/formatters.ts';

interface DeleteProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductResponseDto | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
  error: string | null;
}

export const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  isOpen,
  onClose,
  product,
  onConfirm,
  isDeleting,
  error,
}) => {
  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Product"
      maxWidth="440px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && (
          <div
            role="alert"
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '6px',
              color: '#b91c1c',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5 }}>
          Are you sure you want to permanently delete{' '}
          <strong style={{ color: '#0f172a' }}>"{product.name}"</strong>?
        </p>

        <div
          style={{
            backgroundColor: '#f8fafc',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            fontSize: '0.8125rem',
            color: '#475569',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          <div>Category: <strong>{product.categoryName || 'Unassigned'}</strong></div>
          <div>Unit Price: <strong>{formatCurrency(product.price)}</strong></div>
          <div>Current Stock: <strong>{product.quantity} units</strong></div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isDeleting}
            onClick={onConfirm}
          >
            Delete Product
          </Button>
        </div>
      </div>
    </Modal>
  );
};
