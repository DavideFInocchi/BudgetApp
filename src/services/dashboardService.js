// src/services/dashboardService.js

/**
 * Recupera tutti i dati necessari alla Dashboard.
 *
 * @param {Object} period
 * @param {string} period.from
 * @param {string} period.to
 * @returns {Promise<Object>}
 */

import { toDashboardTransaction } from "../mappers/transactionMapper";
import transactionService from "./transactionService";
import budgetService from "./budgetService";
import { buildPeriods } from "../utils/periodUtils";
import { toDashboardBudget } from "../mappers/budgetMapper";
// ======================================================
// Dashboard Loader
// ======================================================
export async function getDashboard(period) {

    const transactions =
        await transactionService.getByPeriod(period);

    const budgets =
        await budgetService.getByPeriod(period);

    return {

        summary: buildSummary(transactions),

        cashFlow: buildCashFlow(transactions, period),

        categories: buildCategories(transactions),

        budgets: budgets.map(toDashboardBudget),

        latestTransactions: buildLatestTransactions(transactions),

    };

}

function calculateTotals(transactions) {

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {

        const amount = Number(transaction.amount);

        if (amount > 0) {

            income += amount;

        } else if (amount < 0) {

            expense += Math.abs(amount);

        }

    });

    return {

        income,

        expense,

    };

}

// ======================================================
// Summary
// ======================================================
function buildSummary(transactions) {

    const { income, expense } =
        calculateTotals(transactions);

    return {

        income,

        expense,

        balance: income - expense,

        saving: income - expense,

        transactionsCount: transactions.length,

    };

}

// ======================================================
// Cash Flow
// ======================================================

function buildCashFlow(transactions, period) {

    const daily = new Map();

    transactions.forEach(transaction => {

        const date = transaction.transaction_date;
        const amount = Number(transaction.amount);

        daily.set(
            date,
            (daily.get(date) ?? 0) + amount
        );

    });

    const result = [];

    let cumulative = 0;

    const start = new Date(period.from);
    const end = new Date(period.to);

    for (
        let current = new Date(start);
        current <= end;
        current.setDate(current.getDate() + 1)
    ) {

        const date = current.toISOString().slice(0, 10);

        cumulative += daily.get(date) ?? 0;

        result.push({
            date,
            value: cumulative,
        });

    }

    return result;
}

function buildCategories(transactions) {

  
    const map = new Map();

    transactions
        .filter(t => t.amount < 0)
        .forEach(transaction => {

            const key = transaction.category_name;

            if (!map.has(key)) {

                map.set(key, {

                    id: key,

                    name: transaction.category_name,

                    color: transaction.category_color,

                    total: 0,

                });

            }

            map.get(key).total += Math.abs(transaction.amount);

        });

    const result = [...map.values()];

return result;

}




function buildLatestTransactions(transactions) {

return transactions

    .slice(0, 5)

    .map(toDashboardTransaction);

}

