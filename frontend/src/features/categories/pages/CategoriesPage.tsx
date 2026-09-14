import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext.tsx';
import { PageHeader } from '../../../components/layout/PageHeader.tsx';
import { Button } from '../../../components/ui/Button.tsx';
import { LoadingSpinner } from '../../../components/feedback/LoadingSpinner.tsx';
import { ErrorAlert } from '../../../components/feedback/ErrorAlert.tsx';
import { EmptyState } from '../../../components/feedback/EmptyState.tsx';
import { getErrorMessage } from '../../../api/errorHandler.ts';
import { categoryApi } from '../api/categoryApi.ts';
import { CategoryTable } from '../components/CategoryTable.tsx';
import { CategoryModal } from '../components/CategoryModal.tsx';
import { DeleteCategoryDialog } from '../components/DeleteCategoryDialog.tsx';
import type {
  CategoryResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../../types/index.ts';

export const CategoriesPage: React.FC = () => {
  const { isAdmin } = useAuth(); // checks if the user is admin 

  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal (Create / Edit) state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponseDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [deletingCategory, setDeletingCategory] = useState<CategoryResponseDto | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryApi.getAll();
      setCategories(data); // here we populate the catagory data in the form 
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []); // callback is keep the ref unless compnent is recreated 

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // when component mounts call fetch catagories 

  // Open modal in Create mode
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Open modal in Edit mode
  const handleOpenEdit = (category: CategoryResponseDto) => {
    setEditingCategory(category);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Close create/edit modal
  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEditingCategory(null);
    setModalError(null);
  };

  // Submit Create or Edit
  const handleSubmitModal = async (data: CreateCategoryDto | UpdateCategoryDto) => {
    setIsSubmitting(true);
    setModalError(null);
    try {
      if (editingCategory) {
        await categoryApi.update(editingCategory.id, data);//this is to update
        // the data 
      } else {
        await categoryApi.create(data);
        //this is to create new data as we call differnt endpoint for this
      }
      await fetchCategories(); // refecth the collection form backend to find out whats true 
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      setModalError(getErrorMessage(err)); 
      // the get error msg converts the error to a string and set modal error is populated 
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete confirmation dialog
  const handleOpenDelete = (category: CategoryResponseDto) => {
    setDeletingCategory(category);
    setDeleteError(null);
    setIsDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleCloseDelete = () => {
    if (isDeleting) return;
    setIsDeleteDialogOpen(false);
    setDeletingCategory(null);
    setDeleteError(null);
  };

  // Execute deletion , same orocess as above 
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await categoryApi.delete(deletingCategory.id);
      await fetchCategories();
      setIsDeleteDialogOpen(false);
      setDeletingCategory(null);
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

   // these are rendering below 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Categories"
        description="Organize and structure products into distinct inventory categories."
        action={
          isAdmin ? (
            <Button variant="primary" onClick={handleOpenCreate}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Category
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="card">
          <LoadingSpinner message="Loading categories..." size="md" />
        </div>
      ) : error ? (
        <ErrorAlert
          title="Could not load categories"
          message={error}
          onRetry={fetchCategories}
        />
      ) : categories.length === 0 ? (
        <EmptyState
          title="No Categories Found"
          description="There are currently no categories in the inventory system."
          action={
            isAdmin ? (
              <Button variant="primary" size="sm" onClick={handleOpenCreate}>
                Create First Category
              </Button>
            ) : undefined
          }
        />
      ) : (
        <CategoryTable
          categories={categories}
          isAdmin={isAdmin}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Create / Edit Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingCategory}
        onSubmit={handleSubmitModal}
        isSubmitting={isSubmitting}
        error={modalError}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCategoryDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDelete}
        category={deletingCategory}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
};
