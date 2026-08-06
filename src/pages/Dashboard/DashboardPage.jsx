// src/pages/Dashboard/DashboardPage.jsx

import { useState } from "react";

import { useDashboard } from "../../hooks/useDashboard";

import DashboardHeader from "./DashboardHeader";
import DashboardSummary from "./DashboardSummary";
import DashboardCashFlowChart from "./DashboardCashFlowChart";
import DashboardCategoryChart from "./DashboardCategoryChart";
import DashboardBudget from "./DashboardBudget";
import DashboardLatestTransactions from "./DashboardLatestTransactions";

import AppSpinner from "../../components/ui/AppSpinner";
import AppCard from "../../components/ui/AppCard";

export default function DashboardPage() {

    const [period, setPeriod] = useState(null);

    const {

        data,

        isLoading,

        isError,

        error,

    } = useDashboard(period);

    if (isLoading) {

        return <AppSpinner />;

    }

    if (isError) {

        return (

            <AppCard>

                <p className="text-danger mb-0">

                    {error?.message}

                </p>

            </AppCard>

        );

    }
console.log(data.budgets);
    return (

        <div className="container-fluid">

            <DashboardHeader

                period={data.selectedPeriod}

                periods={data.periods}

                onPeriodChange={setPeriod}

            />

            <DashboardSummary

                summary={data.summary}

            />

            <div className="row g-4 mb-4">

                <div className="col-12 col-xl-6">

                    <DashboardCashFlowChart

                        cashFlow={data.cashFlow}

                    />

                </div>

                <div className="col-12 col-xl-6">

                    <DashboardCategoryChart

                        categoryExpenses={data.categories}

                    />

                </div>

            </div>

            <div className="row g-4">

                <div className="col-12 col-xl-5">

                    <DashboardBudget

                        budgets={data.budgets}

                    />

                </div>

                <div className="col-12 col-xl-7">

                    <DashboardLatestTransactions

                        transactions={data.latestTransactions}

                    />

                </div>

            </div>

        </div>

    );

}