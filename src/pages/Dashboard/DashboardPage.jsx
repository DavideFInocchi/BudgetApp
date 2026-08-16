// src/pages/Dashboard/DashboardPage.jsx
import { useState } from "react";

import { useDashboard } from "../../hooks/useDashboard";
import { usePeriods } from "../../hooks/usePeriods";


import DashboardHeader from "./DashboardHeader";
import DashboardSummary from "./DashboardSummary";
import DashboardCashFlowChart from "./DashboardCashFlowChart";
import DashboardBudget from "./DashboardBudget";
import DashboardLatestTransactions from "./DashboardLatestTransactions";

import AppSpinner from "../../components/ui/AppSpinner";
import AppCard from "../../components/ui/AppCard";


import TransactionModal from "../Transactions/TransactionModal";

export default function DashboardPage() {
    const [showTransactionModal, setShowTransactionModal] = useState(false);

    const {

        periods,

        selectedPeriod,

        setSelectedPeriod,

        isLoading: periodsLoading,

        error: periodsError,

    } = usePeriods();
    const {

        data,

        isLoading,

        isError,

        error,

    } = useDashboard(selectedPeriod);

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
console.log(data.budgets);
    return (

        <div className="container-fluid">

            <DashboardHeader

                period={selectedPeriod}

                periods={periods}

                onPeriodChange={setSelectedPeriod}

                onNewTransaction={() =>
                        setShowTransactionModal(true)
                    }
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

                    <DashboardBudget
                        budgets={data.budgets}
                    />

                </div>

            </div>

            <div className="row g-4">

                <div className="col-12">

                    <DashboardLatestTransactions

                        transactions={data.latestTransactions}

                    />

                </div>

            </div>
                    <TransactionModal

                        show={showTransactionModal}

                        transaction={null}

                        onClose={() =>
                            setShowTransactionModal(false)
                        }

                    />
        </div>


    );

}