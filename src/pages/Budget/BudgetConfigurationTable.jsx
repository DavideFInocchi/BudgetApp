import AppEmptyState from "../../components/ui/AppEmptyState";

import { formatCurrency } from "../../utils/currency";

export default function BudgetConfigurationTable({

    budgets = []

}) {

    if (budgets.length === 0) {

        return (

            <AppEmptyState
                title="Nessun budget"
                description="Non esiste ancora un budget per il periodo selezionato."
            />

        );

    }

    return (

        <table className="table align-middle">

            <thead>

                <tr>

                    <th>Categoria</th>

                    <th>Tipo saldo</th>

                    <th className="text-end">Budget</th>

                </tr>

            </thead>

            <tbody>

                {budgets.map(budget => (

                    <tr key={budget.id}>

                        <td>

                            <div className="d-flex align-items-center">

                                <span
                                    className="rounded-circle me-2"
                                    style={{
                                        width: 10,
                                        height: 10,
                                        backgroundColor: budget.category_color,
                                        display: "inline-block",
                                    }}
                                />

                                {budget.category_name}

                            </div>

                        </td>

                        <td>

                            {budget.balance_type}

                        </td>

                        <td className="text-end">

                            {formatCurrency(budget.budget)}

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    );

}