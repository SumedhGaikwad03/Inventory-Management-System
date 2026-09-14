import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext.tsx';
import { PageHeader } from '../../../components/layout/PageHeader.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { Pagination } from '../../../components/ui/Pagination.tsx';
import { LoadingSpinner } from '../../../components/feedback/LoadingSpinner.tsx';
import { ErrorAlert } from '../../../components/feedback/ErrorAlert.tsx';
import { EmptyState } from '../../../components/feedback/EmptyState.tsx';
import { getErrorMessage } from '../../../api/errorHandler.ts';
import { productApi } from '../api/productApi.ts';
import { ProductTable } from '../components/ProductTable.tsx';
import { ProductFilters } from '../components/ProductFilters.tsx';
import { ProductModal } from '../components/ProductModal.tsx';
import { DeleteProductDialog } from '../components/DeleteProductDialog.tsx';
import type {
  ProductResponseDto,
  ProductPagedResponseDto,
  ProductQueryDto,
  CreateProductDto,
  UpdateProductDto,
} from '../../../types/index.ts';

export const ProductsPage: React.FC = () => {
  const { isAdmin } = useAuth();

  // Query / Filter state
  const [query, setQuery] = useState<ProductQueryDto>({
    page: 1,
    pageSize: 10,
    search: undefined,
    lowStock: false,
    sortBy: undefined,
    sortOrder: 'asc',
  });

  // Server response state
  const [pagedData, setPagedData] = useState<ProductPagedResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal (Create / Edit) state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductResponseDto | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productApi.getAll(query);
      setPagedData(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle filter changes and reset page to 1
  const handleQueryChange = (partial: Partial<ProductQueryDto>) => {
    setQuery((prev) => ({
      ...prev,
      ...partial,
      page: partial.page !== undefined ? partial.page : 1,
    }));
  };

  const handleResetFilters = () => {
    setQuery({
      page: 1,
      pageSize: 10,
      search: undefined,
      lowStock: false,
      sortBy: undefined,
      sortOrder: 'asc',
    });
  };

  const handlePageChange = (page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  // Open Create modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (product: ProductResponseDto) => {
    setEditingProduct(product);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEditingProduct(null);
    setModalError(null);
  };

  // Submit Create or Edit
  const handleSubmitModal = async (data: CreateProductDto | UpdateProductDto) => {
    setIsSubmitting(true);
    setModalError(null);
    try {
      if (editingProduct) {
        await productApi.update(editingProduct.id, data);
      } else {
        await productApi.create(data);
      }
      await fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      setModalError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Delete confirmation dialog
  const handleOpenDelete = (product: ProductResponseDto) => {
    setDeletingProduct(product);
    setDeleteError(null);
    setIsDeleteDialogOpen(true);
  };

  // Close Delete confirmation dialog
  const handleCloseDelete = () => {
    if (isDeleting) return;
    setIsDeleteDialogOpen(false);
    setDeletingProduct(null);
    setDeleteError(null);
  };

  // Execute deletion
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await productApi.delete(deletingProduct.id);

      const currentPage = query.page || 1;
      // If this was the only item on a page > 1, adjust page
      if (pagedData && pagedData.items.length === 1 && currentPage > 1) {
        setQuery((prev) => ({ ...prev, page: currentPage - 1 }));
      } else {
        await fetchProducts();
      }

      setIsDeleteDialogOpen(false);
      setDeletingProduct(null);
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const hasItems = pagedData && pagedData.items.length > 0;
  const isFiltered = Boolean(query.search) || Boolean(query.lowStock) || Boolean(query.sortBy);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <PageHeader
        title="Products"
        description="Browse, filter, and manage products in the central inventory catalog."
        action={
          isAdmin ? (
            <Button variant="primary" onClick={handleOpenCreate}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Product
            </Button>
          ) : undefined
        }
      />

      {/* Query / Filter Controls */}
      <ProductFilters
        query={query}
        onQueryChange={handleQueryChange}
        onReset={handleResetFilters}
      />

      {/* Table & Feedback State Content */}
      {isLoading ? (
        <div className="card">
          <LoadingSpinner message="Fetching products catalog..." size="md" />
        </div>
      ) : error ? (
        <ErrorAlert
          title="Could not load products"
          message={error}
          onRetry={fetchProducts}
        />
      ) : !hasItems ? (
        <EmptyState
          title={isFiltered ? 'No Matching Products' : 'No Products in Catalog'}
          description={
            isFiltered
              ? 'No products match your current search or filter criteria.'
              : 'There are currently no products registered in the inventory catalog.'
          }
          action={
            isFiltered ? (
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Clear Active Filters
              </Button>
            ) : isAdmin ? (
              <Button variant="primary" size="sm" onClick={handleOpenCreate}>
                Add First Product
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div>
          <ProductTable
            products={pagedData.items}
            isAdmin={isAdmin}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />

          {/* Pagination Controls */}
          <Pagination
            currentPage={pagedData.page}
            totalPages={pagedData.totalPages}
            totalItems={pagedData.totalItems}
            pageSize={pagedData.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}

      {/* Product Create / Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingProduct}
        onSubmit={handleSubmitModal}
        isSubmitting={isSubmitting}
        error={modalError}
      />

      {/* Product Delete Confirmation Dialog */}
      <DeleteProductDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDelete}
        product={deletingProduct}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
};
