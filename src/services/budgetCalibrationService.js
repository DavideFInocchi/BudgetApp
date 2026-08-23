import { supabase } from "./supabase";
import { formatSqlDate } from "../utils/dateUtils";

const BUDGET_TABLE = "vw_budget_metrics";
const TRANSACTION_TABLE = "vw_transactions";

const budgetCalibrationService = {

    async getCalibrationPeriods() {

        const { data, error } = await supabase

            .from("vw_periods")

            .select("period_date")

            .order("period_date", {
                ascending: true
            });

        if (error)
            throw error;

        return data?.map(
            row => row.period_date
        ) ?? [];

    },
    async getMetrics({
        analysisPeriod,
        targetMonth
    }) {

        if (
            !analysisPeriod?.from ||
            !analysisPeriod?.to ||
            !targetMonth
        ) {
            return null;
        }


        // ==========================================
        // BUDGET + SALDO TOTALE
        // ==========================================

        const {
            data: budgetData,
            error: budgetError
        } = await supabase

            .from(BUDGET_TABLE)

            .select(
                "month, category_id, category_name, budget, balance"
            )

            .gte(
                "month",
                formatSqlDate(analysisPeriod.from)
            )
            .lte(
                "month",
                formatSqlDate(analysisPeriod.to)
            )

            .order("month", {
                ascending: true
            })

            .order("category_name", {
                ascending: true
            });


        if (budgetError)
            throw budgetError;


        // ==========================================
        // TRANSAZIONI ORDINARIE
        // ==========================================

        const {
            data: transactionData,
            error: transactionError
        } = await supabase

            .from(TRANSACTION_TABLE)

            .select(
                "transaction_date, category_id, amount, balance_type"
            )

            .gte(
                "transaction_date",
                formatSqlDate(analysisPeriod.from)
            )
            .lt(
                "transaction_date",
                getNextMonth(
                    analysisPeriod.to
                )
            );           

        if (transactionError)
            throw transactionError;
        const {
            data: targetBudgetData,
            error: targetBudgetError
        } = await supabase

            .from(BUDGET_TABLE)

            .select(
                "month, category_id, category_name, budget"
            )

            .eq(
                "month",
                formatSqlDate(targetMonth)
            )

            .order(
                "category_name",
                {
                    ascending: true
                }
            );

        if (targetBudgetError)
            throw targetBudgetError;

        const targetBudgets =
            targetBudgetData ?? [];
    
        const budgets =
            budgetData ?? [];

        const transactions =
            transactionData ?? [];

        // ==========================================
        // SALDO ORDINARIO PER MESE / CATEGORIA
        // ==========================================

        const ordinaryBalances =
            buildOrdinaryBalances(
                transactions
            );


        // ==========================================
        // COSTRUZIONE DELLE SERIE
        // ==========================================

        const categories =
            buildCategoryMetrics(
                budgets,
                ordinaryBalances,
                targetBudgets
            );

        // ==========================================
        // VINCOLO GLOBALE
        // ==========================================

        const {
            data: categoryRows,
            error: categoryError
        } = await supabase
            .from("categories")
            .select("id, name");

        if (categoryError)
            throw categoryError;

        const incomeCategoryIds =
            new Set(
                (categoryRows ?? [])
                    .filter(category =>
                        category.name === "Stipendio" ||
                        category.name === "Bonus / Extra"
                    )
                    .map(category => category.id)
            );

        const globalMonthlyData =
            buildGlobalMonthlyData(
                budgets,
                transactions,
                incomeCategoryIds
            );
        const capacity =
            buildCapacityMetrics(
                globalMonthlyData
            );
        console.log(
            "CAPACITY: ",
            capacity
        );
        const categoriesWithRecommendations =
            buildRecommendations(
                categories,
                capacity
            );
        const increaseCandidates =
            sortIncreaseCandidates(
                categoriesWithRecommendations
            );
        const prudentialMarginAvailable =
            Math.max(
                capacity.ordinaryMarginMedian,
                0
            );

        const increaseAllocation =
            allocateIncreaseBudget(
                increaseCandidates,
                prudentialMarginAvailable
            );

        const allocatedByCategory =
            new Map(
                increaseAllocation.allocations.map(
                    allocation => [
                        allocation.categoryId,
                        allocation
                    ]
                )
            );

        const categoriesWithAllocation =
            categoriesWithRecommendations.map(
                category => {

                    const allocation =
                        allocatedByCategory.get(
                            category.categoryId
                        );

                    return {

                        ...category,

                        allocation:
                            allocation ?? null

                    };

                }
            );
        console.log(
            "RECOMMENDATIONS: ",
            categoriesWithRecommendations
        );
        console.log(
            "CALIBRATION DATE RANGE",
            {
                from:
                    analysisPeriod.from,

                to:
                    analysisPeriod.to,

                transactionTo:
                    getNextMonth(
                        analysisPeriod.to
                    )
            }
        );
        return {

            analysisPeriod,

            targetMonth,

            capacity,
            
            monthlyData:
                globalMonthlyData,

            categories:
                categoriesWithAllocation,

            increaseCandidates,

            increaseAllocation

        };
    }

};


function buildOrdinaryBalances(transactions) {

    const balances = new Map();

    transactions.forEach(transaction => {

        if (
            transaction.balance_type !==
            "Ordinario"
        ) {
            return;
        }


        const date = new Date(
            `${transaction.transaction_date}T00:00:00`
        );


        const month =
            `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;


        const key =
            `${month}|${transaction.category_id}`;


        const amount =
            Number(transaction.amount) || 0;


        balances.set(
            key,
            (balances.get(key) ?? 0) +
            amount
        );

    });


    return balances;

}


function buildCategoryMetrics(
    budgets,
    ordinaryBalances,
    targetBudgets
) {

    const currentBudgets =
        new Map();

    targetBudgets.forEach(row => {

        currentBudgets.set(
            row.category_id,
            Number(row.budget) || 0
        );

    });

    const grouped =
        new Map();


    budgets.forEach(row => {


        const categoryId =
            row.category_id;

        if (!grouped.has(categoryId)) {

            grouped.set(
                categoryId,
                {
                    categoryId,
                    categoryName:
                        row.category_name,
                    months: []
                }
            );

        }


        const month =
            String(row.month).slice(0, 7);

        const key =
            `${month}|${row.category_id}`;


        const ordinaryBalance =
            ordinaryBalances.get(key) ?? 0;


        const totalBalance =
            Number(row.balance) || 0;


        grouped
            .get(categoryId)
            .months
            .push({

                month: row.month,

                budget:
                    Number(row.budget) || 0,

                ordinaryBalance,

                totalBalance

            });

    });


    return [...grouped.values()]
        .map(category => {

            const ordinaryValues =
                category.months.map(
                    month =>
                        month.ordinaryBalance
                );

            const totalValues =
                category.months.map(
                    month =>
                        month.totalBalance
                );
            
            const budgetValues =
                category.months.map(
                    month =>
                        month.budget
                );
            const currentBudget =
                currentBudgets.get(
                    category.categoryId
                ) ?? 0;

            const ordinaryMedianConsumption =
                median(
                    ordinaryValues.map(
                        balance => Math.abs(balance)
                    )
                );

            const structuralGap =
                Math.max(
                    ordinaryMedianConsumption -
                    currentBudget,
                    0
                );

            const structuralGapRate =
                currentBudget > 0
                    ? structuralGap / currentBudget
                    : 0;
            const ordinaryTrend =
                trendSlope(
                    ordinaryValues
                );

            const totalTrend =
                trendSlope(
                    totalValues
                );
            return {

                categoryId:
                    category.categoryId,

                categoryName:
                    category.categoryName,
                ordinary: {

                    monthlyBalances:
                        ordinaryValues,

                    average:
                        average(
                            ordinaryValues
                        ),

                    median:
                        median(
                            ordinaryValues
                        ),

                    standardDeviation:
                        standardDeviation(
                            ordinaryValues
                        ),

                    overBudgetRate:
                        overBudgetRate(
                            ordinaryValues,
                            budgetValues
                        ),

                    averageBudgetDeviation:
                        averageBudgetDeviation(
                            ordinaryValues,
                            budgetValues
                        ),

                    medianBudgetDeviation:
                        medianBudgetDeviation(
                            ordinaryValues,
                            budgetValues
                        ),

                    trend:
                        ordinaryTrend,

                    consumptionTrend:
                        -ordinaryTrend,

                    maxOverBudgetStreak:
                        maxOverBudgetStreak(
                            ordinaryValues,
                            budgetValues
                        ),

                    averageOverBudgetStreak:
                        averageOverBudgetStreak(
                            ordinaryValues,
                            budgetValues
                        )

                },
                total: {

                    monthlyBalances:
                        totalValues,

                    average:
                        average(
                            totalValues
                        ),

                    median:
                        median(
                            totalValues
                        ),

                    standardDeviation:
                        standardDeviation(
                            totalValues
                        ),

                    overBudgetRate:
                        overBudgetRate(
                            totalValues,
                            budgetValues
                        ),

                    averageBudgetDeviation:
                        averageBudgetDeviation(
                            totalValues,
                            budgetValues
                        ),

                    medianBudgetDeviation:
                        medianBudgetDeviation(
                            totalValues,
                            budgetValues
                        ),

                    trend:
                        totalTrend,

                    consumptionTrend:
                        -totalTrend,

                    maxOverBudgetStreak:
                        maxOverBudgetStreak(
                            totalValues,
                            budgetValues
                        ),

                    averageOverBudgetStreak:
                        averageOverBudgetStreak(
                            totalValues,
                            budgetValues
                        )

                },
                
                currentBudget,

                structuralGap,

                structuralGapRate,

            };

        });

}


function average(values) {

    if (!values.length)
        return 0;

    return (
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / values.length
    );

}

function median(values) {

    if (!values.length)
        return 0;

    const sorted = [...values].sort(
        (a, b) => a - b
    );

    const middle =
        Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {

        return (
            sorted[middle - 1] +
            sorted[middle]
        ) / 2;

    }

    return sorted[middle];

}

function standardDeviation(values) {

    if (!values.length)
        return 0;

    const mean =
        average(values);

    const variance =
        values.reduce(
            (sum, value) =>
                sum +
                Math.pow(
                    value - mean,
                    2
                ),
            0
        ) / values.length;

    return Math.sqrt(
        variance
    );

}

function overBudgetRate(
    monthlyBalances,
    budgets
) {

    if (!monthlyBalances.length)
        return 0;

    const exceededMonths =
        monthlyBalances.filter(
            (balance, index) =>
                Math.abs(balance) >
                budgets[index]
        ).length;

    return (
        exceededMonths /
        monthlyBalances.length
    ) * 100;

}

function averageBudgetDeviation(
    monthlyBalances,
    budgets
) {

    if (!monthlyBalances.length)
        return 0;

    const deviations =
        monthlyBalances.map(
            (balance, index) =>
                Math.abs(balance) -
                budgets[index]
        );

    return average(
        deviations
    );

}

function medianBudgetDeviation(
    monthlyBalances,
    budgets
) {

    if (!monthlyBalances.length)
        return 0;

    const deviations =
        monthlyBalances.map(
            (balance, index) =>
                Math.abs(balance) -
                budgets[index]
        );

    return median(
        deviations
    );

}

function trendSlope(values) {

    if (values.length < 2)
        return 0;

    const n = values.length;

    const xMean =
        (n - 1) / 2;

    const yMean =
        average(values);

    let numerator = 0;
    let denominator = 0;

    values.forEach(
        (value, index) => {

            const x =
                index - xMean;

            const y =
                value - yMean;

            numerator +=
                x * y;

            denominator +=
                x * x;

        }
    );

    if (denominator === 0)
        return 0;

    return numerator / denominator;

}

function maxOverBudgetStreak(
    monthlyBalances,
    budgets
) {

    if (!monthlyBalances.length)
        return 0;

    let currentStreak = 0;
    let maxStreak = 0;

    monthlyBalances.forEach(
        (balance, index) => {

            const exceeded =
                Math.abs(balance) >
                budgets[index];

            if (exceeded) {

                currentStreak += 1;

                maxStreak =
                    Math.max(
                        maxStreak,
                        currentStreak
                    );

            } else {

                currentStreak = 0;

            }

        }
    );

    return maxStreak;

}

function averageOverBudgetStreak(
    monthlyBalances,
    budgets
) {

    if (!monthlyBalances.length)
        return 0;

    const streaks = [];

    let currentStreak = 0;

    monthlyBalances.forEach(
        (balance, index) => {

            const exceeded =
                Math.abs(balance) >
                budgets[index];

            if (exceeded) {

                currentStreak += 1;

            } else {

                if (currentStreak > 0) {

                    streaks.push(
                        currentStreak
                    );

                    currentStreak = 0;

                }

            }

        }
    );

    // Chiude un'eventuale sequenza
    // che termina nell'ultimo mese
    if (currentStreak > 0) {

        streaks.push(
            currentStreak
        );

    }

    if (!streaks.length)
        return 0;

    return average(streaks);

}

function getNextMonth(period) {

    const [year, month] =
        String(period)
            .slice(0, 7)
            .split("-")
            .map(Number);

    if (
        !Number.isInteger(year) ||
        !Number.isInteger(month)
    ) {
        throw new Error(
            `Periodo non valido: ${period}`
        );
    }

    const nextMonth =
        month === 12
            ? 1
            : month + 1;

    const nextYear =
        month === 12
            ? year + 1
            : year;

    return `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

}
function buildGlobalMonthlyData(
    budgets,
    transactions,
    incomeCategoryIds
) {

    const months = new Map();

    // ==========================================
    // TUTTI I MESI PRESENTI NEL BUDGET
    // ==========================================

    budgets.forEach(row => {

        const month =
            String(row.month).slice(0, 7);

        if (!months.has(month)) {

            months.set(
                month,
                {
                    month,
                    budgetTotal: 0,
                    ordinaryIncome: 0,
                    totalIncome: 0,
                    ordinaryExpenseBalance: 0,
                    totalExpenseBalance: 0
                }
            );

        }

        months.get(month).budgetTotal +=
            Number(row.budget) || 0;

    });


    // ==========================================
    // TRANSAZIONI
    // ==========================================

    transactions.forEach(transaction => {

        const month =
            String(
                transaction.transaction_date
            ).slice(0, 7);

        if (!months.has(month)) {

            months.set(
                month,
                {
                    month,
                    budgetTotal: 0,
                    ordinaryIncome: 0,
                    totalIncome: 0,
                    ordinaryExpenseBalance: 0,
                    totalExpenseBalance: 0
                }
            );

        }

        const amount =
            Number(transaction.amount) || 0;

        const isIncomeCategory =
            incomeCategoryIds.has(
                transaction.category_id
            );


        // ==========================================
        // REDDITO
        // ==========================================

        if (
            amount > 0 &&
            isIncomeCategory
        ) {

            months.get(month).totalIncome +=
                amount;

            if (
                transaction.balance_type ===
                "Ordinario"
            ) {

                months.get(month).ordinaryIncome +=
                    amount;

            }

        }


        // ==========================================
        // SPESE
        // ==========================================

        if (!isIncomeCategory) {

            months.get(month).totalExpenseBalance +=
                amount;

            if (
                transaction.balance_type ===
                "Ordinario"
            ) {

                months.get(month).ordinaryExpenseBalance +=
                    amount;

            }

        }

    });


    // ==========================================
    // METRICHE MENSILI
    // ==========================================

    return [...months.values()]
        .sort(
            (a, b) =>
                a.month.localeCompare(b.month)
        )
        .map(month => ({

            ...month,

            ordinaryMargin:
                month.ordinaryIncome -
                month.budgetTotal,

            totalMargin:
                month.totalIncome -
                month.budgetTotal,

            ordinaryExpenseBudgetDeviation:
                Math.abs(
                    month.ordinaryExpenseBalance
                ) -
                month.budgetTotal,

            totalExpenseBudgetDeviation:
                Math.abs(
                    month.totalExpenseBalance
                ) -
                month.budgetTotal

        }));

}

function buildCapacityMetrics(
    monthlyData
) {

    if (!monthlyData.length) {

        return {

            ordinaryIncomeMean: 0,
            ordinaryIncomeMedian: 0,

            totalIncomeMean: 0,
            totalIncomeMedian: 0,

            budgetMean: 0,
            budgetMedian: 0,

            ordinaryMarginMean: 0,
            ordinaryMarginMedian: 0,

            totalMarginMean: 0,
            totalMarginMedian: 0,

            unsustainableMonths: 0,
            unsustainableRate: 0

        };

    }


    const ordinaryIncomeValues =
        monthlyData.map(
            month =>
                month.ordinaryIncome
        );

    const totalIncomeValues =
        monthlyData.map(
            month =>
                month.totalIncome
        );

    const budgetValues =
        monthlyData.map(
            month =>
                month.budgetTotal
        );

    const ordinaryMarginValues =
        monthlyData.map(
            month =>
                month.ordinaryMargin
        );

    const totalMarginValues =
        monthlyData.map(
            month =>
                month.totalMargin
        );
    const ordinaryExpenseBudgetDeviationValues =
        monthlyData.map(
            month =>
                month.ordinaryExpenseBudgetDeviation
        );

    const totalExpenseBudgetDeviationValues =
        monthlyData.map(
            month =>
                month.totalExpenseBudgetDeviation
        );

    const unsustainableMonths =
        monthlyData.filter(
            month =>
                month.ordinaryMargin < 0
        ).length;


    return {

        ordinaryIncomeMean:
            average(
                ordinaryIncomeValues
            ),

        ordinaryIncomeMedian:
            median(
                ordinaryIncomeValues
            ),

        totalIncomeMean:
            average(
                totalIncomeValues
            ),

        totalIncomeMedian:
            median(
                totalIncomeValues
            ),

        budgetMean:
            average(
                budgetValues
            ),

        budgetMedian:
            median(
                budgetValues
            ),

        ordinaryMarginMean:
            average(
                ordinaryMarginValues
            ),

        ordinaryMarginMedian:
            median(
                ordinaryMarginValues
            ),

        totalMarginMean:
            average(
                totalMarginValues
            ),

        totalMarginMedian:
            median(
                totalMarginValues
            ),
        medianOrdinaryExpenseBudgetDeviation:
            median(
                ordinaryExpenseBudgetDeviationValues
            ),

        medianTotalExpenseBudgetDeviation:
            median(
                totalExpenseBudgetDeviationValues
            ),
        unsustainableMonths,

        unsustainableRate:
            (
                unsustainableMonths /
                monthlyData.length
            ) * 100

    };

}

function getRecommendation(
    category,
    prudentialMarginAvailable
) {

    const ordinary =
        category.ordinary;

    const isHighlyVolatile =
    Math.abs(
        ordinary.median
    ) > 0 &&
    ordinary.standardDeviation >
        Math.abs(
            ordinary.median
        ) * 2;
    // ==========================================
    // AUMENTARE
    // ==========================================

    const canIncrease =
        category.structuralGap > 0 &&
        ordinary.overBudgetRate >= 65 &&
        ordinary.averageOverBudgetStreak > 1;


    if (canIncrease) {

        const correctionFactor =
            ordinary.consumptionTrend >= 0
                ? 1
                : 0.5;

        const suggestedIncrease =
            category.structuralGap *
            correctionFactor;

        const suggestedBudget =
            category.currentBudget +
            suggestedIncrease;

        return {

            type: "increase",

            structuralGap:
                category.structuralGap,

            structuralGapRate:
                category.structuralGapRate,

            correctionFactor,

            suggestedIncrease,

            suggestedBudget,

            financiallyAffordable:
                suggestedIncrease <=
                prudentialMarginAvailable

        };

    }


    // ==========================================
    // RIDURRE
    // ==========================================

    const ordinaryMedianConsumption =
        Math.abs(
            ordinary.median
        );

    const structuralHeadroom =
        category.currentBudget -
        ordinaryMedianConsumption;

    const structuralHeadroomRate =
        category.currentBudget > 0
            ? structuralHeadroom /
              category.currentBudget
            : 0;


    const canDecrease =
        structuralHeadroomRate >= 0.20 &&
        ordinary.overBudgetRate <= 35 &&
        ordinary.consumptionTrend <= 0 &&
        ordinary.averageOverBudgetStreak < 1.5 &&
        !isHighlyVolatile;

    if (canDecrease) {

        const suggestedDecrease =
            structuralHeadroom;

        const suggestedBudget =
            category.currentBudget -
            suggestedDecrease;

        return {

            type: "decrease",

            structuralHeadroom,

            structuralHeadroomRate,

            suggestedDecrease,

            suggestedBudget,

            financiallyAffordable: true

        };

    }


    // ==========================================
    // MANTENERE
    // ==========================================

    return {

        type: "maintain",
        
        reason:
        isHighlyVolatile
            ? "high_volatility"
            : "normal"
    };

}

function buildRecommendations(
    categories,
    capacity
) {

    const prudentialMarginAvailable =
        Math.max(
            capacity.ordinaryMarginMedian,
            0
        );

    return categories.map(
        category => ({

            ...category,

            recommendation:
                getRecommendation(
                    category,
                    prudentialMarginAvailable
                )

        })
    );

}

function sortIncreaseCandidates(categories) {

    return categories

        .filter(
            category =>
                category.recommendation?.type ===
                "increase"
        )

        .sort(
            (a, b) =>
                b.structuralGapRate -
                a.structuralGapRate
        );

}

function allocateIncreaseBudget(
    increaseCandidates,
    prudentialMarginAvailable
) {

    let remainingMargin =
        Math.max(
            prudentialMarginAvailable,
            0
        );

    const allocations =
        increaseCandidates.map(
            category => {

                const requested =
                    category.recommendation
                        ?.suggestedIncrease ?? 0;

                const allocated =
                    Math.min(
                        requested,
                        remainingMargin
                    );

                remainingMargin -=
                    allocated;

                return {

                    categoryId:
                        category.categoryId,

                    categoryName:
                        category.categoryName,

                    currentBudget:
                        category.currentBudget,

                    requestedIncrease:
                        requested,

                    allocatedIncrease:
                        allocated,

                    allocatedBudget:
                        category.currentBudget +
                        allocated

                };

            }
        );
        const requestedTotal =
            increaseCandidates.reduce(
                (sum, category) =>
                    sum +
                    (
                        category.recommendation
                            ?.suggestedIncrease ?? 0
                    ),
                0
            );

        const allocatedTotal =
            prudentialMarginAvailable -
            remainingMargin;

        const uncoveredAmount =
            Math.max(
                requestedTotal -
                allocatedTotal,
                0
            );

        const allocationStatus =
            uncoveredAmount > 0
                ? "insufficient"
                : "sustainable";

        return {
            allocations,
            requestedTotal,
            allocatedTotal,
            remainingMargin,
            uncoveredAmount,
            allocationStatus
        };

}



export default budgetCalibrationService;