import AppInput from "../../components/ui/AppInput";
import { formatCurrency } from "../../utils/currency";

export default function BudgetConfigurationTable({
    budgets = [],
    editable = false,
    onBudgetChange,
    averageSalary = 0
}) {

    const totalBudget = budgets.reduce(
        (total, budget) => total + Number(budget.budget || 0),
        0
    );
    const budgetPercentage = 
        averageSalary > 0 ? (totalBudget / averageSalary) * 100 : 0;

    const renderBudget = (budget) => (

        <div
            className="budget-table__item"
            key={budget.id}
        >

            <div className="budget-table__category">

                <div
                    className="budget-table__icon"
                    style={{
                        backgroundColor: budget.category_color
                    }}
                >
                    <i className={`bi bi-${budget.category_icon}`} />
                </div>

                <span>
                    {budget.category_name}
                </span>

            </div>

            <div className="budget-table__value">

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

                    <span>
                        {formatCurrency(budget.budget)}
                    </span>

                )}

            </div>

        </div>

    );

    return (

        <div className="budget-configuration">

            <div className="budget-configuration__summary">

                <div className="budget-configuration__header">

                    <span className="budget-configuration__summary-label">
                        Budget mensile
                    </span>

                    <span className="budget-configuration__summary-value">
                        {formatCurrency(totalBudget)}
                    </span>

                </div>

                <div className="budget-configuration__income">

                    <div className="budget-configuration__income-row">

                        <span>
                            Reddito previsto
                        </span>

                        <strong>
                            {formatCurrency(averageSalary)}
                        </strong>

                    </div>

                    <div className="budget-configuration__percentage">

                        <span>
                            Utilizzo del reddito
                        </span>

                        <strong>
                            {budgetPercentage.toFixed(1)}%
                        </strong>

                    </div>

                    <div className="budget-configuration__progress">

                        <div
                            className="budget-configuration__progress-bar"
                            style={{
                                width: `${Math.min(budgetPercentage, 100)}%`
                            }}
                        />

            </div>

    </div>

            </div>

            <div className="budget-table">

                {budgets.map(renderBudget)}

            </div>

        </div>

    );

}