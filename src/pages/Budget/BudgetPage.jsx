import { useState } from "react";

import { useBudgetPeriods } from "../../hooks/useBudgetPeriods";
import { useBudgetConfiguration } from "../../hooks/useBudgetConfiguration";
import { useAverageSalary } from "../../hooks/useAverageSalary";

import AppCard from "../../components/ui/AppCard";
import AppSpinner from "../../components/ui/AppSpinner";

import BudgetToolbar from "./BudgetToolbar";
import BudgetConfigurationTable from "./BudgetConfigurationTable";
import BudgetEmptyState from "./BudgetEmptyState";

export default function BudgetPage() {

    const {

        periods,
        selectedPeriod,
        setSelectedPeriod,
        isLoading: periodsLoading,
        error: periodsError,

    } = useBudgetPeriods();

    const {

        data: configuration = [],

        isLoading,

        isError,

        error,

        createMonth,

        saveMonth

    } = useBudgetConfiguration(selectedPeriod);
    const {
        data: averageSalary = 0,
        isLoading: salaryLoading
    } = useAverageSalary();
    // Stato dell'editor
    const [draftBudgets, setDraftBudgets] = useState(null);

    // Dati mostrati in pagina
    const budgets = draftBudgets ?? configuration ?? [];

    const handleBudgetChange = (id, changes) => {

        console.log(id, changes);

        setDraftBudgets(previous => {

            const current = previous ?? configuration;

            return current.map(budget =>

                budget.id === id

                    ? {
                        ...budget,
                        ...changes
                    }

                    : budget

            );

        });

    };
    const handleCopy = async () => {

        console.log("CLICK");

        try {

            console.log("MUTATION");

            const result = await createMonth.mutateAsync({

                period: selectedPeriod,

                copy: true

            });

            console.log("RESULT", result);

        } catch (error) {

            console.error("ERROR", error);

        }
    
console.log(selectedPeriod);
console.log(selectedPeriod.from);
console.log(selectedPeriod.to);
    };
    const handleCreate = async () => {

        try {

            const result = await createMonth.mutateAsync({

                period: selectedPeriod,

                copy: false

            });

            console.log(result);

        } catch (error) {

            console.error(error);

        }

    };
    const handleSave = async () => {

        try {

            const result = await saveMonth.mutateAsync({

                period: selectedPeriod,

                budgets: draftBudgets ?? configuration

            });

            console.log(result);

            setDraftBudgets(null);

        } catch (error) {

            console.error(error);

        }

    };
    if (periodsLoading || isLoading || salaryLoading)  {

        return <AppSpinner />;

    }

    if (periodsError || isError) {

        return (

            <AppCard>

                <p className="text-danger mb-0">

                    {periodsError?.message ?? error?.message}

                </p>

            </AppCard>

        );

    }

    return (

        <div className="container-fluid">

            <BudgetToolbar
                period={selectedPeriod}
                periods={periods}
                onPeriodChange={setSelectedPeriod}
                onSave={handleSave}
            />

            <AppCard>

                {budgets.length === 0 ? (

                <BudgetEmptyState

                    onCopy={handleCopy}

                    onCreate={handleCreate}

                />

                ) : (

                    <BudgetConfigurationTable

                        budgets={budgets}
                        editable={true}
                        onBudgetChange={handleBudgetChange}
                        averageSalary={averageSalary}

                    />

                )}

            </AppCard>

        </div>

    );

}