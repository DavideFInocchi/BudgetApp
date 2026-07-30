import { useMemo, useState } from "react";

import { useCategories } from "../../hooks/useCategories";

import AppCard from "../../components/ui/AppCard";
import AppSpinner from "../../components/ui/AppSpinner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

import toastService from "../../services/toastService";

import CategoryToolbar from "./CategoryToolbar";
import CategoryTable from "./CategoryTable";
import CategoryModal from "./CategoryModal";

export default function CategoriesPage() {

    const {
        data: categories = [],
        isLoading,
        error,
        remove
    } = useCategories();

    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [search, setSearch] = useState("");

    const handleAdd = () => {

        setSelectedCategory(null);
        setShowModal(true);

    };

    const handleEdit = (category) => {

        setSelectedCategory(category);
        setShowModal(true);

    };

    const handleDelete = (category) => {

        setCategoryToDelete(category);

    };

    const confirmDelete = async () => {

        if (!categoryToDelete)
            return;

        const toastId = toastService.loading("Eliminazione categoria...");

        try {

            await remove.mutateAsync(categoryToDelete.id);

            toastService.dismiss(toastId);
            toastService.success("Categoria eliminata.");

        } catch (err) {

            console.error(err);

            toastService.dismiss(toastId);
            toastService.error(err.message);

        } finally {

            setCategoryToDelete(null);

        }

    };

    const filteredCategories = useMemo(() => {

        return categories.filter(category =>
            category.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    }, [categories, search]);

    if (isLoading) {

        return <AppSpinner />;

    }

    if (error) {

        return (

            <div className="alert alert-danger">

                {error.message}

            </div>

        );

    }

    return (

        <div className="container py-4">

            <CategoryToolbar
                search={search}
                setSearch={setSearch}
                onAdd={handleAdd}
            />

            <AppCard>

                <CategoryTable
                    categories={filteredCategories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            </AppCard>

            <CategoryModal
                show={showModal}
                category={selectedCategory}
                onClose={() => {

                    setShowModal(false);
                    setSelectedCategory(null);

                }}
            />

            <ConfirmDialog
                open={!!categoryToDelete}
                title="Elimina categoria"
                message={
                    categoryToDelete
                        ? `Vuoi eliminare la categoria "${categoryToDelete.name}"?`
                        : ""
                }
                confirmText="Elimina"
                cancelText="Annulla"
                confirmVariant="danger"
                onConfirm={confirmDelete}
                onClose={() => setCategoryToDelete(null)}
            />

        </div>

    );

}