// src/pages/Dashboard/DashboardSummary.jsx

import AppStatCard from "../../components/ui/AppStatCard";

export default function DashboardSummary({ summary = {} }) {
  return (
    <div className="row g-3 mb-4 dashboard-summary">
      <div className="col-12 col-md-6 col-xl-3">
        <AppStatCard
          title="Saldo"
          value={summary.balance ?? 0}
          icon="wallet2"
          variant="primary"
        />
      </div>

      <div className="col-12 col-md-6 col-xl-3">
        <AppStatCard
          title="Entrate"
          value={summary.income ?? 0}
          icon="arrow-down-circle"
          variant="success"
        />
      </div>

      <div className="col-12 col-md-6 col-xl-3">
        <AppStatCard
          title="Uscite"
          value={summary.expense ?? 0}
          icon="arrow-up-circle"
          variant="danger"
        />
      </div>

      <div className="col-12 col-md-6 col-xl-3">
        <AppStatCard
          title="Transazioni"
          value={summary.transactionsCount ?? 0}
          type="number"
          icon="receipt"
          variant="info"
        />
      </div>
    </div>
  );
}