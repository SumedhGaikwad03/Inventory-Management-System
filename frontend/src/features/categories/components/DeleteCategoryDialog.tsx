import React from 'react';
import { Modal } from '../../../components/ui/Modal.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import type { CategoryResponseDto } from '../../../types/index.ts';

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryResponseDto | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
  error: string | null;
}

export const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  isOpen,
  onClose,
  category,
  onConfirm,
  isDeleting,
  error,
}) => {
  if (!category) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Category"
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
          Are you sure you want to delete the category{' '}
          <strong style={{ color: '#0f172a' }}>"{category.name}"</strong>?
        </p>

        <p style={{ fontSize: '0.8125rem', color: '#dc2626', backgroundColor: '#fef2f2', padding: '0.625rem 0.75rem', borderRadius: '6px' }}>
          <strong>Note:</strong> Categories that currently have products assigned to them cannot be deleted.
        </p>

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
            Delete Category
          </Button>
        </div>
      </div>
    </Modal>
  );
};
