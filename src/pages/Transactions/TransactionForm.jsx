import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { useActiveCategories } from "../../hooks/useActiveCategories";

import AppButton from "../../components/ui/AppButton";
import AppInput from "../../components/ui/AppInput";
import AppSelect from "../../components/ui/AppSelect";
import { formatSqlDate } from "../../utils/dateUtils";

import { BALANCE_TYPES } from "../../constants/balanceTypes";

const DEFAULT_VALUES = {

    transaction_date: formatSqlDate((new Date())),
    description: "",
    transaction_type: "Uscita",
    amount: "",
    balance_type: "Ordinario",

};

export default function TransactionForm({

    transaction,
    onSubmit,
    onCancel,
    loading

}) {

    const { data: categories = [] } = useActiveCategories();
    const defaultCategoryId = categories[0]?.id ?? "";
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            ...DEFAULT_VALUES,
            category_id: defaultCategoryId
        }
    });
        useEffect(() => {

        if (transaction) {

            reset({

                transaction_date: transaction.transaction_date,
                description: transaction.description,
                transaction_type: transaction.transaction_type,
                amount: transaction.amount,
                balance_type: transaction.balance_type,
                category_id: transaction.category_id

            });

        } else {

            reset({
                ...DEFAULT_VALUES,
                category_id: defaultCategoryId
            });

        }

    }, [transaction, reset]);

    const categoryOptions = categories.map(category => ({

        value: category.id,
        label: category.name

    }));

    return (

        <form onSubmit={handleSubmit(onSubmit)}>

            <div className="row g-3">

                <div className="col-md-6">

                    <AppInput
                        type="date"
                        label="Data"
                        error={errors.transaction_date?.message}
                        {...register("transaction_date", {

                            required: "Campo obbligatorio"

                        })}
                    />

                </div>

                <div className="col-md-6">

                    <AppInput
                        type="number"
                        step="0.01"
                        label="Importo"
                        error={errors.amount?.message}
                        {...register("amount", {

                            required: "Campo obbligatorio",
                            valueAsNumber: true,
                            min: {

                                value: 0.01,
                                message: "Importo non valido"

                            }

                        })}
                    />

                </div>

                <div className="col-12">

                    <AppInput
                        label="Descrizione"
                        error={errors.description?.message}
                        {...register("description", {

                            required: "Campo obbligatorio"

                        })}
                    />

                </div>

                <div className="col-md-6">

                    <Controller
                        name="category_id"
                        control={control}
                        rules={{

                            required: "Seleziona una categoria"

                        }}
                        render={({ field }) => (

                            <AppSelect
                                label="Categoria"
                                options={categoryOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.category_id?.message}
                            />

                        )}
                    />

                </div>

                <div className="col-md-3">

                    <Controller
                        name="transaction_type"
                        control={control}
                        render={({ field }) => (

                            <AppSelect
                                label="Tipo"
                                options={[
                                    {
                                        value: "Entrata",
                                        label: "Entrata"
                                    },
                                    {
                                        value: "Uscita",
                                        label: "Uscita"
                                    }
                                ]}
                                value={field.value}
                                onChange={field.onChange}
                            />

                        )}
                    />

                </div>

                <div className="col-md-3">

                    <Controller
                        name="balance_type"
                        control={control}
                        render={({ field }) => (

                        <AppSelect
                            label="Saldo"
                            options={BALANCE_TYPES}
                            value={field.value}
                            onChange={field.onChange}
                        />

                        )}
                    />

                </div>

            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">

                <AppButton
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                >
                    Annulla
                </AppButton>

                <AppButton
                    type="submit"
                    loading={loading}
                >
                    Salva
                </AppButton>

            </div>

        </form>

    );

}