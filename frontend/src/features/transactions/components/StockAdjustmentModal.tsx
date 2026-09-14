import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { productApi } from '../../products/api/productApi.ts';
import type {
  ProductResponseDto,
  CreateTransactionParams,
} from '../../../types/index.ts';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: CreateTransactionParams) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  preselectedProductId?: number | null;
}

const COMMON_TRANSACTION_TYPES = [
  'Restock',
  'Sale',
  'Adjustment',
  'Return',
  'Damage',
  'Audit Correction',
];

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  preselectedProductId,
}) => {
  const [products, setProducts] = useState<ProductResponseDto[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [productId, setProductId] = useState<number | ''>('');
  const [transactionType, setTransactionType] = useState<string>('Restock');
  const [quantity, setQuantity] = useState<string>('1');
  const [direction, setDirection] = useState<'in' | 'out'>('in');
  const [clientValidation, setClientValidation] = useState<string | null>(null);

  // Load products when modal opens
  useEffect(() => {
    if (isOpen) {
      let isMounted = true;
      setIsLoadingProducts(true);
      setProductsError(null);

      productApi
        .getAll({ pageSize: 100 })
        .then((res) => {
          if (isMounted) {
            setProducts(res.items);
            if (preselectedProductId) {
              setProductId(preselectedProductId);
            }
          }
        })
        .catch(() => {
          if (isMounted) {
            setProductsError('Failed to load products list for adjustment.');
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoadingProducts(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }
  }, [isOpen, preselectedProductId]);

  // Reset form on open / close
  useEffect(() => {
    if (isOpen) {
      setProductId(preselectedProductId || '');
      setTransactionType('Restock');
      setQuantity('1');
      setDirection('in');
      setClientValidation(null);
    }
  }, [isOpen, preselectedProductId]);

  // Auto-adjust direction when transaction type changes
  const handleTypeChange = (newType: string) => {
    setTransactionType(newType);
    if (newType === 'Restock' || newType === 'Return') {
      setDirection('in');
    } else if (newType === 'Sale' || newType === 'Damage') {
      setDirection('out');
    }
  };

  const selectedProduct = products.find((p) => p.id === Number(productId));

  const parsedQty = parseInt(quantity, 10);
  const calculatedChange = isNaN(parsedQty)
    ? 0
    : direction === 'out'
    ? -Math.abs(parsedQty)
    : Math.abs(parsedQty);

  const estimatedNewStock =
    selectedProduct !== undefined ? selectedProduct.quantity + calculatedChange : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientValidation(null);

    if (!productId || Number(productId) <= 0) {
      setClientValidation('Please select a product.');
      return;
    }

    if (isNaN(parsedQty) || parsedQty <= 0) {
      setClientValidation('Quantity must be an integer greater than zero.');
      return;
    }

    if (!transactionType.trim()) {
      setClientValidation('Please select or specify a transaction type.');
      return;
    }

    if (
      selectedProduct &&
      direction === 'out' &&
      selectedProduct.quantity - parsedQty < 0
    ) {
      setClientValidation(
        `Cannot deduct ${parsedQty} units. Current stock is only ${selectedProduct.quantity} units (inventory cannot be negative).`
      );
      return;
    }

    const payload: CreateTransactionParams = {
      productId: Number(productId),
      quantityChanged: calculatedChange,
      transactionType: transactionType.trim(),
    };

    await onSubmit(payload);
  };

  const displayError = clientValidation || productsError || error;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Stock Adjustment"
      description="Record a new inventory transaction to adjust product stock."
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

        {/* Product Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label
            htmlFor="adjustment-product"
            style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
          >
            Product <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <select
            id="adjustment-product"
            value={productId}
            onChange={(e) => setProductId(e.target.value ? Number(e.target.value) : '')}
            disabled={isSubmitting || isLoadingProducts}
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
              {isLoadingProducts ? 'Loading products...' : '-- Select a Product --'}
            </option>
            {products.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name} (Current Stock: {prod.quantity} units)
              </option>
            ))}
          </select>
        </div>

        {/* Transaction Type */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label
            htmlFor="adjustment-type"
            style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
          >
            Transaction Type <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <select
            id="adjustment-type"
            value={transactionType}
            onChange={(e) => handleTypeChange(e.target.value)}
            disabled={isSubmitting}
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
            {COMMON_TRANSACTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Adjustment Direction & Quantity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label
              htmlFor="adjustment-direction"
              style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
            >
              Action Direction
            </label>
            <select
              id="adjustment-direction"
              value={direction}
              onChange={(e) => setDirection(e.target.value as 'in' | 'out')}
              disabled={isSubmitting}
              style={{
                padding: '0.625rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem',
                outline: 'none',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="in">Add Stock (+)</option>
              <option value="out">Deduct Stock (-)</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label
              htmlFor="adjustment-quantity"
              style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
            >
              Units to Adjust <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              id="adjustment-quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={isSubmitting}
              required
              placeholder="e.g. 10"
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

        {/* Impact Preview */}
        {selectedProduct && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Current Stock: <strong>{selectedProduct.quantity}</strong></span>
            <span style={{ color: calculatedChange >= 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
              Adjustment: {calculatedChange >= 0 ? `+${calculatedChange}` : calculatedChange}
            </span>
            <span>
              Resulting Stock:{' '}
              <strong style={{ color: (estimatedNewStock ?? 0) < 0 ? '#dc2626' : '#0f172a' }}>
                {estimatedNewStock} units
              </strong>
            </span>
          </div>
        )}

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
            disabled={products.length === 0 && !isLoadingProducts}
          >
            Submit Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};
