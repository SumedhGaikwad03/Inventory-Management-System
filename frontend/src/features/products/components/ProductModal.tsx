import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { categoryApi } from '../../categories/api/categoryApi.ts';
import type {
  ProductResponseDto,
  CreateProductDto,
  UpdateProductDto,
  CategoryResponseDto,
} from '../../../types/index.ts';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProductResponseDto | null;
  onSubmit: (data: CreateProductDto | UpdateProductDto) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isSubmitting,
  error,
}) => {
  const isEditing = !!initialData;

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');

  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [clientValidation, setClientValidation] = useState<string | null>(null);

  // Load categories when modal opens
  useEffect(() => {
    if (isOpen) {
      let isMounted = true;
      setIsLoadingCategories(true);
      setCategoriesError(null);

      categoryApi
        .getAll()
        .then((cats) => {
          if (isMounted) {
            setCategories(cats);
          }
        })
        .catch(() => {
          if (isMounted) {
            setCategoriesError('Failed to load categories list.');
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoadingCategories(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }
  }, [isOpen]);

  // Sync form values on open / initialData change
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setCategoryId(initialData.categoryId);
        setPrice(initialData.price.toString());
        setQuantity(initialData.quantity.toString());
      } else {
        setName('');
        setCategoryId('');
        setPrice('');
        setQuantity('');
      }
      setClientValidation(null);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientValidation(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setClientValidation('Product name is required.');
      return;
    }

    if (trimmedName.length > 100) {
      setClientValidation('Product name cannot exceed 100 characters.');
      return;
    }

    if (!categoryId || Number(categoryId) <= 0) {
      setClientValidation('Please select a valid category.');
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setClientValidation('Price must be a positive number.');
      return;
    }

    const numQuantity = parseInt(quantity, 10);
    if (isNaN(numQuantity) || numQuantity < 0) {
      setClientValidation('Quantity must be an integer of 0 or greater.');
      return;
    }

    const payload: CreateProductDto = {
      name: trimmedName,
      categoryId: Number(categoryId),
      price: numPrice,
      quantity: numQuantity,
    };

    await onSubmit(payload);
  };

  const displayError = clientValidation || categoriesError || error;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Product' : 'Add New Product'}
      description={
        isEditing
          ? 'Update product catalog information, pricing, and stock.'
          : 'Create a new inventory product and assign it to a category.'
      }
      maxWidth="520px"
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

        {/* Product Name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label
            htmlFor="product-name"
            style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
          >
            Product Name <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            maxLength={100}
            required
            placeholder="e.g. Wireless Ergonomic Keyboard"
            style={{
              padding: '0.625rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Category Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label
            htmlFor="product-category"
            style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
          >
            Category <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <select
            id="product-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
            disabled={isSubmitting || isLoadingCategories}
            required
            style={{
              padding: '0.625rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              outline: 'none',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="">
              {isLoadingCategories ? 'Loading categories...' : '-- Select a Category --'}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && !isLoadingCategories && (
            <span style={{ fontSize: '0.75rem', color: '#b45309' }}>
              Warning: No categories exist. Please create a category first.
            </span>
          )}
        </div>

        {/* Price & Quantity Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label
              htmlFor="product-price"
              style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
            >
              Unit Price <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              id="product-price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isSubmitting}
              required
              placeholder="0.00"
              style={{
                padding: '0.625rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label
              htmlFor="product-quantity"
              style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
            >
              Initial Stock Quantity <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              id="product-quantity"
              type="number"
              step="1"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={isSubmitting}
              required
              placeholder="0"
              style={{
                padding: '0.625rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Actions */}
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
            disabled={categories.length === 0 && !isLoadingCategories}
          >
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
