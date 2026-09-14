import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext.tsx';
import { PageHeader } from '../../../components/layout/PageHeader.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { LoadingSpinner } from '../../../components/feedback/LoadingSpinner.tsx';
import { ErrorAlert } from '../../../components/feedback/ErrorAlert.tsx';
import { EmptyState } from '../../../components/feedback/EmptyState.tsx';
import { getErrorMessage } from '../../../api/errorHandler.ts';
import { productApi } from '../../products/api/productApi.ts';
import { transactionApi } from '../api/transactionApi.ts';
import { TransactionTable } from '../components/TransactionTable.tsx';
import { StockAdjustmentModal } from '../components/StockAdjustmentModal.tsx';
import { TransactionDetailsModal } from '../components/TransactionDetailsModal.tsx';
import type {
  InventoryTransactionResponseDto,
  ProductResponseDto,
  CreateTransactionParams,
} from '../../../types/index.ts';

export const TransactionsPage: React.FC = () => {
  const { isAdmin } = useAuth();

  const [transactions, setTransactions] = useState<InventoryTransactionResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Products for filter selector
  const [products, setProducts] = useState<ProductResponseDto[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');

  // Modal states
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [selectedDetailsTransaction, setSelectedDetailsTransaction] =
    useState<InventoryTransactionResponseDto | null>(null);

  // Load product list for filter selector
  const fetchProducts = useCallback(async () => {
    try {
      const res = await productApi.getAll({ pageSize: 100 });
      setProducts(res.items);
    } catch {
      // Silently ignore product filter load failure
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch transactions (either all or by product ID)
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (selectedProductId && Number(selectedProductId) > 0) {
        const data = await transactionApi.getByProductId(Number(selectedProductId));
        setTransactions(data);
      } else {
        const data = await transactionApi.getAll();
        setTransactions(data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [selectedProductId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleOpenAdjustmentModal = () => {
    setModalError(null);
    setIsAdjustmentModalOpen(true);
  };

  const handleCloseAdjustmentModal = () => {
    if (isSubmitting) return;
    setIsAdjustmentModalOpen(false);
    setModalError(null);
  };

  const handleSubmitAdjustment = async (params: CreateTransactionParams) => {
    setIsSubmitting(true);
    setModalError(null);
    try {
      await transactionApi.create(params);
      await Promise.all([fetchTransactions(), fetchProducts()]);
      setIsAdjustmentModalOpen(false);
    } catch (err) {
      setModalError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearFilter = () => {
    setSelectedProductId('');
  };

  const selectedProduct = products.find((p) => p.id === Number(selectedProductId));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <PageHeader
        title="Inventory Transactions"
        description="Audit log of all stock adjustments, restocks, sales, returns, and inventory movements."
        action={
          isAdmin ? (
            <Button variant="primary" onClick={handleOpenAdjustmentModal}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Stock Adjustment
            </Button>
          ) : undefined
        }
      />

      {/* Filter by Product Bar */}
      <div
        className="card"
        style={{
          padding: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <label
            htmlFor="filter-product"
            style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}
          >
            Filter by Product:
          </label>
          <select
            id="filter-product"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value ? Number(e.target.value) : '')}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.8125rem',
              outline: 'none',
              backgroundColor: '#ffffff',
              minWidth: '220px',
            }}
          >
            <option value="">All Products (Full Audit History)</option>
            {products.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name}
              </option>
            ))}
          </select>

          {selectedProductId && (
            <Button variant="ghost" size="sm" onClick={handleClearFilter}>
              Clear Filter
            </Button>
          )}
        </div>

        {selectedProductId && (
          <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Showing audit trail for <strong>{selectedProduct?.name || `Product #${selectedProductId}`}</strong>
          </div>
        )}
      </div>

      {/* Content / Loading / Error / Empty States */}
      {isLoading ? (
        <div className="card">
          <LoadingSpinner message="Retrieving transaction audit history..." size="md" />
        </div>
      ) : error ? (
        <ErrorAlert
          title="Could not load inventory transactions"
          message={error}
          onRetry={fetchTransactions}
        />
      ) : transactions.length === 0 ? (
        <EmptyState
          title={
            selectedProductId
              ? `No Transactions for ${selectedProduct?.name || 'Selected Product'}`
              : 'No Inventory Transactions Recorded'
          }
          description={
            selectedProductId
              ? 'No stock movements or adjustments have been recorded for this specific product.'
              : 'There are currently no stock adjustment records in the system.'
          }
          action={
            selectedProductId ? (
              <Button variant="outline" size="sm" onClick={handleClearFilter}>
                View All Transactions
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={handleOpenAdjustmentModal}>
                Record First Stock Adjustment
              </Button>
            )
          }
        />
      ) : (
        <TransactionTable
          transactions={transactions}
          onViewDetails={(tx) => setSelectedDetailsTransaction(tx)}
        />
      )}

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={isAdjustmentModalOpen}
        onClose={handleCloseAdjustmentModal}
        onSubmit={handleSubmitAdjustment}
        isSubmitting={isSubmitting}
        error={modalError}
        preselectedProductId={selectedProductId ? Number(selectedProductId) : null}
      />

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={!!selectedDetailsTransaction}
        onClose={() => setSelectedDetailsTransaction(null)}
        transaction={selectedDetailsTransaction}
      />
    </div>
  );
};
