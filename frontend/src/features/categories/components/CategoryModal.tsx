import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import type { // these are typescript types for uniform data handoff
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../../types/index.ts';

// This is majorly an ui/form that uses catagory api to send data to backend 

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: CategoryResponseDto | null;
  onSubmit: (data: CreateCategoryDto | UpdateCategoryDto) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
} 
// the above part is everything thing the parent component should provide

export const CategoryModal: React.FC<CategoryModalProps> = ({
  // we are destructuring the props here that the parent provided 
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isSubmitting,
  error,
}) => {
  const isEditing = !!initialData;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clientValidation, setClientValidation] = useState<string | null>(null);

  // Sync state when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setDescription(initialData.description || '');
      } else {
        setName('');
        setDescription('');
      }
      setClientValidation(null);
    }
  }, [isOpen, initialData]);
  // this helps syncronize form with models current model/data 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // doesnt let browser reload 
    setClientValidation(null); //  remove the old erroes for vaildation 

    const trimmedName = name.trim();
    if (!trimmedName) {
      setClientValidation('Category name is required.');
      return;
    } 

    if (trimmedName.length > 100) {
      setClientValidation('Category name cannot exceed 100 characters.');
      return;
    }

    if (description.length > 500) {
      setClientValidation('Description cannot exceed 500 characters.');
      return;
    }

    // above filelds check names , whether data is vaid or not 

    const payload: CreateCategoryDto = {
      name: trimmedName,
      description: description.trim() ? description.trim() : null,
    }; 
    // here we actually build the payload 

    await onSubmit(payload); // this submits the payload to parent 
  };

  const displayError = clientValidation || error;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Category' : 'Create Category'}
      description={
        isEditing
          ? 'Update existing category details.'
          : 'Add a new category to organize products in the inventory.'
      }
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {displayError && (
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
            {displayError}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label
            htmlFor="category-name"
            style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
          >
            Category Name <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            maxLength={100}
            required
            placeholder="e.g., Electronics, Stationery, Furniture"
            style={{
              padding: '0.625rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'right' }}>
            {name.length}/100
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label
            htmlFor="category-description"
            style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
          >
            Description (Optional)
          </label>
          <textarea
            id="category-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            maxLength={500}
            rows={3}
            placeholder="Brief description of the items included in this category..."
            style={{
              padding: '0.625rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'right' }}>
            {description.length}/500
          </span>
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
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            {isEditing ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
