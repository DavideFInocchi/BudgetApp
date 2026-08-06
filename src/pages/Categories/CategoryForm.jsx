import { Controller, useForm, useWatch } from "react-hook-form";

import AppButton from "../../components/ui/AppButton";
import AppCheckbox from "../../components/ui/AppCheckbox";
import AppColorPicker from "../../components/ui/AppColorPicker";
import AppIconPicker from "../../components/ui/AppIconPicker";
import AppInput from "../../components/ui/AppInput";
import AppSelect from "../../components/ui/AppSelect";

import { CATEGORY_ICONS } from "../../constants/categoryIcons";
import { MOVEMENT_TYPES } from "../../constants/movementTypes";

export default function CategoryForm({

    onSubmit,
    initialValues = {}

}) {

    const {

        register,
        handleSubmit,
        control,
        formState: { errors }

    } = useForm({

        defaultValues: {

            name: initialValues.name ?? "",
            movement_type: initialValues.movement_type ?? "Uscita",
            icon: initialValues.icon ?? "wallet2",
            color: initialValues.color ?? "#0d6efd",
            active: initialValues.active ?? true,
            sort_order: initialValues.sort_order ?? 0

        }

    });

    const color = useWatch({

        control,
        name: "color",
        defaultValue: initialValues.color ?? "#0d6efd"

    });

    return (

        <form onSubmit={handleSubmit(onSubmit)}>

            <AppInput
                label="Nome"
                error={errors.name?.message}
                {...register("name", {
                    required: "Il nome è obbligatorio"
                })}
            />

            <AppSelect
                label="Movimento predefinito"
                options={MOVEMENT_TYPES}
                error={errors.movement_type?.message}
                {...register("movement_type", {
                    required: "Il movimento predefinito è obbligatorio"
                })}
            />

            <Controller
                name="icon"
                control={control}
                render={({ field }) => (

                    <AppIconPicker
                        label="Icona"
                        value={field.value}
                        onChange={field.onChange}
                        icons={CATEGORY_ICONS}
                        error={errors.icon?.message}
                    />

                )}
            />

            <AppColorPicker
                label="Colore"
                error={errors.color?.message}
                value={color}
                {...register("color")}
            />

            <AppCheckbox
                label="Categoria attiva"
                error={errors.active?.message}
                {...register("active")}
            />

            <AppInput
                type="number"
                label="Ordine"
                {...register("sort_order", {
                    valueAsNumber: true
                })}
            />

            <div className="d-flex justify-content-end gap-2">

                <AppButton
                    variant="secondary"
                    type="reset"
                >
                    Annulla
                </AppButton>

                <AppButton type="submit">
                    Salva
                </AppButton>

            </div>

        </form>

    );

}