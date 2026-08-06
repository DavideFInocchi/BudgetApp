export function toDashboardBudget(budget) {

    return {

        id: budget.id,

        category_name: budget.category_name,

        category_color: budget.category_color,

        category_icon: budget.category_icon,

        budget: budget.budget,

        balance: budget.balance,

        consumed: budget.consumed,

        variance: budget.variance,

        utilization: budget.utilization,

    };

}