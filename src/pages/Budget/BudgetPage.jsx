import { useState } from "react";

import { useBudgetPeriods } from "../../hooks/useBudgetPeriods";
import { useBudgetConfiguration } from "../../hooks/useBudgetConfiguration";
import { useAverageSalary } from "../../hooks/useAverageSalary";
import { useBudgetCalibration } from "../../hooks/useBudgetCalibration";

import AppCard from "../../components/ui/AppCard";
import AppSpinner from "../../components/ui/AppSpinner";

import BudgetToolbar from "./BudgetToolbar";
import BudgetConfigurationTable from "./BudgetConfigurationTable";
import BudgetEmptyState from "./BudgetEmptyState";
import BudgetCalibrationPeriodSlider
    from "./BudgetCalibrationPeriodSlider";
import BudgetCalibrationSummary
    from "./BudgetCalibrationSummary";
import BudgetCalibrationRecommendations
    from "./BudgetCalibrationRecommendations";


import BudgetCalibrationChart
    from "./BudgetCalibrationChart";

import BudgetCalibrationTrendChart
    from "./BudgetCalibrationTrendChart";

export default function BudgetPage() {

    /*------------------------
    BUDGET TABLE SETUP - START
    -------------------------*/

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

    /*------------------------
    BUDGET CALIBRATION
    -------------------------*/

    const {
        analysisPeriod,
        calibrationFrom,
        calibrationTo,
        periods: calibrationPeriods,
        setCalibrationFrom,
        data: calibration,
        isLoading: calibrationLoading,
        error: calibrationError
    } = useBudgetCalibration(
        selectedPeriod?.from
    );

    /*------------------------
    LOCAL EDITOR STATE
    -------------------------*/

    const [draftBudgets, setDraftBudgets] =
        useState(null);

    const [
        appliedCalibrationChanges,
        setAppliedCalibrationChanges
    ] = useState({});

    const budgets =
        draftBudgets ?? configuration ?? [];

    /*------------------------
    BUDGET EDITOR
    -------------------------*/

    const handleBudgetChange = (
        id,
        changes
    ) => {

        setDraftBudgets(previous => {

            const current =
                previous ?? configuration;

            return current.map(
                budget =>
                    budget.id === id
                        ? {
                            ...budget,
                            ...changes
                        }
                        : budget
            );

        });

    };

    /*------------------------
    CALIBRATION -> DRAFT
    -------------------------*/

    const handleCalibrationApply = (
        category,
        newBudget
    ) => {

        const budgetRow =
            configuration.find(
                budget =>
                    budget.category_id ===
                    category.categoryId
            );

        if (!budgetRow)
            return;

        const numericBudget =
            Number(newBudget);

        if (
            !Number.isFinite(
                numericBudget
            ) ||
            numericBudget < 0
        ) {
            return;
        }

        handleBudgetChange(
            budgetRow.id,
            {
                budget:
                    numericBudget
            }
        );

        setAppliedCalibrationChanges(
            previous => ({
                ...previous,
                [category.categoryId]:
                    numericBudget
            })
        );

    };

    /*------------------------
    CREATE / COPY MONTH
    -------------------------*/

    const handleCopy = async () => {

        try {

            const result =
                await createMonth.mutateAsync({

                    period:
                        selectedPeriod,

                    copy: true

                });

            console.log(
                "CREATE MONTH COPY:",
                result
            );

        } catch (error) {

            console.error(
                "CREATE MONTH COPY ERROR:",
                error
            );

        }

    };

    const handleCreate = async () => {

        try {

            const result =
                await createMonth.mutateAsync({

                    period:
                        selectedPeriod,

                    copy: false

                });

            console.log(
                "CREATE MONTH:",
                result
            );

        } catch (error) {

            console.error(
                "CREATE MONTH ERROR:",
                error
            );

        }

    };

    /*------------------------
    SAVE MONTH
    -------------------------*/

    const handleSave = async () => {

        try {

            const result =
                await saveMonth.mutateAsync({

                    period:
                        selectedPeriod,

                    budgets:
                        draftBudgets ??
                        configuration

                });

            console.log(
                "SAVE MONTH:",
                result
            );

            setDraftBudgets(null);

            setAppliedCalibrationChanges({});

        } catch (error) {

            console.error(
                "SAVE MONTH ERROR:",
                error
            );

        }

    };

    /*------------------------
    LOADING
    -------------------------*/

    if (
        periodsLoading ||
        isLoading ||
        salaryLoading
    ) {

        return <AppSpinner />;

    }

    /*------------------------
    ERRORS
    -------------------------*/

    if (
        periodsError ||
        isError ||
        calibrationError
    ) {

        return (

            <AppCard>

                <p className="text-danger mb-0">

                    {
                        periodsError?.message ??
                        error?.message ??
                        calibrationError?.message
                    }

                </p>

            </AppCard>

        );

    }

    /*------------------------
    BUDGET TABLE SETUP - END
    -------------------------*/

    return (

        <div className="container-fluid">

            <BudgetToolbar
                period={selectedPeriod}
                periods={periods}
                onPeriodChange={
                    setSelectedPeriod
                }
                onSave={handleSave}
            />

            {/* ========================
                CALIBRATION
                ======================== */}

            <AppCard>

                <BudgetCalibrationPeriodSlider
                    periods={
                        calibrationPeriods
                    }
                    from={
                        calibrationFrom
                    }
                    to={
                        calibrationTo
                    }
                    onChange={
                        setCalibrationFrom
                    }
                />

                {calibrationLoading && (

                    <div className="small text-muted mt-2">
                        Aggiornamento analisi…
                    </div>

                )}

                    <BudgetCalibrationSummary
                        calibration={calibration}
                    />

                    <BudgetCalibrationChart
                        calibration={calibration}
                    />
                    <BudgetCalibrationTrendChart
                        calibration={calibration}
                    />
                    <BudgetCalibrationRecommendations
                        calibration={calibration}
                        onApply={handleCalibrationApply}
                        appliedChanges={appliedCalibrationChanges}
                    />

            </AppCard>

            {/* ========================
                BUDGET
                ======================== */}

            <AppCard>

                {budgets.length === 0 ? (

                    <BudgetEmptyState
                        onCopy={
                            handleCopy
                        }
                        onCreate={
                            handleCreate
                        }
                    />

                ) : (

                    <BudgetConfigurationTable
                        budgets={
                            budgets
                        }
                        editable={true}
                        onBudgetChange={
                            handleBudgetChange
                        }
                        averageSalary={
                            averageSalary
                        }
                    />

                )}

            </AppCard>

        </div>

    );

}