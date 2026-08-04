import AppCard from "../../components/ui/AppCard";
import AppProgress from "../../components/ui/AppProgress";
import AppEmptyState from "../../components/ui/AppEmptyState";
import { formatCurrency } from "../../utils/currency";
import { Link } from "react-router-dom";

export default function DashboardBudget({
    budgets = [],
}) {
console.log(budgets);
    return (

        <AppCard
            title="Budget"
            headerAction={
    <span>
        Test
    </span>
}
        >     
      

            {budgets.length === 0 ? (

                <AppEmptyState
                    title="Nessun budget"
                    description="Non sono presenti budget."
                />

            ) : (

                budgets.map((budget, index) => {

                    console.log(index, budget);

                    return (

                        <div
                            key={budget.id}
                            className={
                                index === budgets.length - 1
                                    ? ""
                                    : "pb-4 mb-4 border-bottom"
                            }
                        >

                            ...

                        </div>

                    );

                })

            )}

        </AppCard>

    );

}