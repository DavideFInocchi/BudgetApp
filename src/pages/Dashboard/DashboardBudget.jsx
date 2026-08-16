import AppCard from "../../components/ui/AppCard";
import AppProgress from "../../components/ui/AppProgress";
import AppEmptyState from "../../components/ui/AppEmptyState";
import { formatCurrency } from "../../utils/currency";
import { Link } from "react-router-dom";

export default function DashboardBudget({
    budgets = [],
}) {

    return (

        <AppCard
            title="Budget"
            headerAction={
                <Link
                    to="/budget"
                    className="text-decoration-none fw-semibold"
                >
                    Vedi tutti →
                </Link>
            }
        >

            {budgets.length === 0 ? (

                <AppEmptyState
                    title="Nessun budget"
                    description="Non sono presenti budget."
                />

            ) : (
            <div className="row gx-3 gy-1">

                {
                budgets.map((budget) => {

                    const utilization = Math.max(
                        0,
                        Math.min(100, budget.utilization ?? 0)
                    );

                    return (

                        <div
                            key={budget.id}
                            className="col-12 col-md-6"
                        >

                            <div className="d-flex align-items-center gap-2">

                                <span
                                    className="rounded-circle flex-shrink-0"
                                    style={{
                                        width: 7,
                                        height: 7,
                                        backgroundColor: budget.category_color,
                                    }}
                                />

                                <span
                                    className="fw-semibold text-truncate"
                                    style={{
                                        width: 115,
                                        flexShrink: 0,
                                    }}
                                >
                                    {budget.category_name}
                                </span>

                                <div
                                    className="flex-grow-1"
                                    style={{
                                        height: 7,
                                        backgroundColor: "#e9eef3",
                                        borderRadius: 10,
                                        overflow: "hidden",
                                    }}
                                >

                                    <div
                                        style={{
                                            width: `${utilization}%`,
                                            height: "100%",
                                            backgroundColor:
                                                budget.utilization > 100
                                                    ? "#dc3545"
                                                    : "#198754",
                                            borderRadius: 10,
                                        }}
                                    />

                                </div>

                                <span
                                    className="text-muted fw-semibold flex-shrink-0"
                                    style={{
                                        width: 38,
                                        textAlign: "right",
                                        fontSize: "0.85rem",
                                    }}
                                >
                                    {budget.utilization}%
                                </span>

                            </div>

                            <div
                                className="text-muted"
                                style={{
                                    marginLeft: 119,
                                    fontSize: "0.72rem",
                                    lineHeight: 1,
                                }}
                            >
                                {formatCurrency(budget.consumed)}
                                {" / "}
                                {formatCurrency(budget.budget)}
                            </div>

                        </div>

                    );

                })
                }
            </div>
            )}

        </AppCard>

    );

}