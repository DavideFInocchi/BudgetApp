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

                budgets.map((budget, index) => (

                    <div
                        key={budget.categoryId}
                        className={
                        index === budgets.length - 1
                            ? ""
                            : "pb-4 mb-4 border-bottom"
                        }
                    >

                    <div className="d-flex justify-content-between align-items-center mb-2">

                        <div className="d-flex align-items-center">

                            <span
                                className="rounded-circle me-2"
                                style={{
                                    width: 10,
                                    height: 10,
                                    backgroundColor: budget.color,
                                    display: "inline-block",
                                }}
                            />

                            <span className="fw-semibold">

                                {budget.category}

                            </span>

                        </div>

                        <span className="text-muted fw-semibold">

                            {budget.progress}%

                        </span>

                    </div>
                        <div className="my-2">

                            <AppProgress
                                value={budget.progress}
                                variant={
                                    budget.exceeded
                                        ? "danger"
                                        : "success"
                                }
                            />

                        </div>
                        

                        <div className="d-flex justify-content-between mt-2">

                            <small className="text-muted">

                                {formatCurrency(budget.spent)}
                                {" / "}
                                {formatCurrency(budget.budget)}

                            </small>

                            <small
                                className={
                                    budget.exceeded
                                        ? "text-danger"
                                        : "text-success"
                                }
                            >

                                {budget.exceeded
                                    ? "Budget superato"
                                    : `Restano ${formatCurrency(budget.remaining)}`}

                            </small>

                        </div>

                    </div>

                ))

            )}

        </AppCard>

    );

}