// src/pages/Dashboard/DashboardPage.jsx
import { useEffect, useState } from "react";
import { useAvailablePeriods } from "../../hooks/useAvailablePeriods";
import { buildPeriods } from "../../utils/periodUtils";

import DashboardHeader from "./DashboardHeader";
import DashboardSummary from "./DashboardSummary";
import DashboardCashFlowChart from "./DashboardCashFlowChart";
import DashboardCategoryChart from "./DashboardCategoryChart";
import DashboardBudget from "./DashboardBudget";
import DashboardLatestTransactions from "./DashboardLatestTransactions";

import { useDashboard } from "../../hooks/useDashboard";
import AppSpinner from "../../components/ui/AppSpinner";
import AppCard from "../../components/ui/AppCard";
import { getCurrentMonth } from "../../utils/periodUtils";

export default function DashboardPage() {

  const [period, setPeriod] =
    useState(getCurrentMonth());
    const { data: availablePeriods } = useAvailablePeriods();

    const periods = buildPeriods(availablePeriods ?? []); 
    useEffect(() => {

        if (periods.length === 0)
            return;

        const exists = periods.some(p => p.key === period.key);

        if (!exists) {

            setPeriod(periods[0]);

        }

    }, [periods]);
  const { data, isLoading, isError, error } = useDashboard(period);

  

  if (isLoading) {
    return <AppSpinner />;
  }

  if (isError) {
    return (
      <AppCard>
        <p className="text-danger mb-0">
          {error?.message || "Errore durante il caricamento della dashboard."}
        </p>
      </AppCard>
    );
  }

  return (
    <div className="container-fluid">

      {/* Header */}
      <DashboardHeader
          period={period}
          periods={periods}
          onPeriodChange={setPeriod}
      />

      {/* KPI */}
      <DashboardSummary summary={data.summary} />

      {/* Grafici */}
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

      {/* Budget + Ultime transazioni */}
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