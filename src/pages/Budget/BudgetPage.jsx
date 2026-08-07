import { useState } from "react";

import { usePeriods } from "../../hooks/usePeriods";
import { useBudgetConfiguration } from "../../hooks/useBudgetConfiguration";

import AppCard from "../../components/ui/AppCard";
import AppSpinner from "../../components/ui/AppSpinner";

import DashboardHeader from "../Dashboard/DashboardHeader";
import BudgetConfigurationTable from "./BudgetConfigurationTable";
import BudgetEmptyState from "./BudgetEmptyState";

export default function BudgetPage() {

    const {

        periods,
        selectedPeriod,
        setSelectedPeriod,
        isLoading: periodsLoading,
        error: periodsError,

    } = usePeriods();

    const {

        data: configuration = [],
        isLoading,
        isError,
        error,

    } = useBudgetConfiguration(selectedPeriod);

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

    if (periodsLoading || isLoading) {

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

            <DashboardHeader

                period={selectedPeriod}
                periods={periods}
                onPeriodChange={setSelectedPeriod}

            />

            <AppCard>

                {budgets.length === 0 ? (

                    <BudgetEmptyState

                        onCopy={() => console.log("copy")}

                        onCreate={() => console.log("create")}

                    />

                ) : (

                    <BudgetConfigurationTable

                        budgets={budgets}

                        editable={true}

                        onBudgetChange={handleBudgetChange}

                    />

                )}

            </AppCard>

        </div>

    );

}