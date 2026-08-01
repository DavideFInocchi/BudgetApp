import AppCard from "../../components/ui/AppCard";
import AppEmptyState from "../../components/ui/AppEmptyState";
import { formatCurrency } from "../../utils/currency";
import { Link } from "react-router-dom";

export default function DashboardLatestTransactions({
    transactions = [],
}) {

    return (

        <AppCard
            title="Ultime transazioni"
            headerAction={
                <Link
                    to="/transactions"
                    className="text-decoration-none fw-semibold"
                >
                    Vedi tutte →
                </Link>
            }
        >

            {transactions.length === 0 ? (

                <AppEmptyState
                    title="Nessuna transazione"
                    description="Non ci sono transazioni da visualizzare."
                />

            ) : (

                <div>

                    {transactions.map((transaction) => (

                        <div
                            key={transaction.id}
                            className="py-3 border-bottom"
                        >

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <div className="fw-semibold">

                                        {transaction.description}

                                    </div>

                                    <small className="text-muted">

                                        {transaction.category}
                                        {" • "}
                                        {transaction.date}

                                    </small>

                                </div>

                                <div className="text-end"
                                    className="py-3"
                                    className={
                                        transaction.amount >= 0
                                            ? "text-success fw-bold"
                                            : "text-danger fw-bold"
                                    }
                                   
                                >

                                    {formatCurrency(transaction.amount)}
                                
                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </AppCard>

    );

}