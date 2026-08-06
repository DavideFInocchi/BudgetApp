import CategoryForm from "./CategoryForm";

import AppModal from "../../components/ui/AppModal";

import { useCategories } from "../../hooks/useCategories";
import toastService from "../../services/toastService";

export default function CategoryModal({

    show,
    category,
    onClose

}) {

    const {

        create,
        update

    } = useCategories();

    const handleSubmit = async (data) => {
         console.log("FORM DATA", data);
        const toastId = toastService.loading(

            category
                ? "Aggiornamento categoria..."
                : "Creazione categoria..."

        );

        try {

            if (category) {

                const result = await update.mutateAsync({

                    id: category.id,
                    category: data

                });

                console.log("RESULT", result);

                toastService.success("Categoria aggiornata.");

            } else {

                await create.mutateAsync(data);

                toastService.success("Categoria creata.");

            }

            toastService.dismiss(toastId);

            onClose();

        } catch (error) {

            console.error(error);

            toastService.dismiss(toastId);

            toastService.error(error.message);

        }

    };

    return (

        <AppModal

            open={show}

            title={

                category
                    ? "Modifica categoria"
                    : "Nuova categoria"

            }

            onClose={onClose}

            footer={null}

        >

            <CategoryForm

                initialValues={category ?? {}}

                onSubmit={handleSubmit}

            />

        </AppModal>

    );

}