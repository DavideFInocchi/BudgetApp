import AppInput from "../../components/ui/AppInput";

import { formatCurrency } from "../../utils/currency";

export default function BudgetConfigurationTable({

    budgets = [],

    editable = false,

    onBudgetChange

}) {

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

                    <td style={{ width: 180 }}>

                        {editable ? (

                            <AppInput

                                type="number"

                                className="text-end"

                                value={budget.budget}

                                onChange={(event) =>

                                    onBudgetChange(

                                        budget.id,

                                        {

                                            budget: Number(event.target.value)

                                        }

                                    )

                                }

                            />

                        ) : (

                            <div className="text-end">

                                {formatCurrency(budget.budget)}

                            </div>

                        )}

                    </td>

                    </tr>

                ))}

            </tbody>

        </table>

    );

}