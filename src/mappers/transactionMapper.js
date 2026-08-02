export function toDashboardTransaction(row) {

    return {

        id: row.id,

        date: row.transaction_date,

        description: row.description,

        amount: row.amount,

        movementType: row.transaction_type,

        category: row.category_name,

        categoryColor: row.category_color,

        categoryIcon: row.category_icon,

    };

}