import { supabase } from "./supabase";
import { roundCurrency } from "../utils/currency";
const projectionService = {
    async getAvailablePeriods() {

        const { data, error } = await supabase

            .from("vw_transactions")

            .select(
                "transaction_date"
            )

            .order(
                "transaction_date",
                { ascending: true }
            );

        if (error)
            throw error;

        const transactions = data ?? [];

        const monthly =
            buildMonthlyData(transactions);

        const currentDate = new Date();

        const currentMonth =
            `${currentDate.getFullYear()}-${String(
                currentDate.getMonth() + 1
            ).padStart(2, "0")}`;

        return monthly

            .filter(
                month =>
                    month.month < currentMonth
            )

            .map(
                month =>
                    month.month
            );

    },
    async getProjection(period) {

        const { data, error } = await supabase

            .from("vw_transactions")

            .select(
                "transaction_date, transaction_type, amount, balance_type"            
            )

            .order(
                "transaction_date",
                { ascending: true }
            );

        if (error)
            throw error;

        const transactions = data ?? [];

        const monthly = buildMonthlyData(
            transactions
        );

        const currentDate = new Date();

        const currentMonth =
            `${currentDate.getFullYear()}-${String(
                currentDate.getMonth() + 1
            ).padStart(2, "0")}`;

        const completedMonths =
            monthly.filter(
                month => month.month < currentMonth
            );
        const selectedMonths =
            completedMonths.filter(month =>
                month.month >= period.from &&
                month.month <= period.to
            );
        const availablePeriods =
            completedMonths.map(
                month => month.month
            );
        const recentMonths =
            selectedMonths;

        if (!recentMonths.length) {

            return {
                historical: [],
                projection: [],
                averages: {
                    income: 0,
                    expenses: 0,
                    balance: 0
                }
            };

        }

        const averageIncome =
            average(
                recentMonths.map(
                    month => month.ordinaryIncome
                )
            );

        const averageExpenses =
            average(
                recentMonths.map(
                    month => month.ordinaryExpenses
                )
            );

        const averageBalance =
            average(
                recentMonths.map(
                    month => month.ordinaryBalance
                )
            );
        const averageTotalBalance =
            average(
                recentMonths.map(
                    month => month.totalBalance
                )
            );

        const historical =
            buildHistoricalCumulative(
                recentMonths
            );

        const lastMonth =
            historical.at(-1);

        const projection =
            buildProjection(
                lastMonth,
                averageBalance,
                averageTotalBalance
            );

        return {

            historical,

            projection,

            averages: {
                ordinaryIncome: averageIncome,
                ordinaryExpenses: averageExpenses,
                ordinaryBalance: averageBalance,
                totalBalance: averageTotalBalance
            }

        };

    }

};

function buildMonthlyData(transactions) {

    const months = new Map();

    transactions.forEach(transaction => {

        const date = new Date(
            `${transaction.transaction_date}T00:00:00`
        );

        const month =
            `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;

        if (!months.has(month)) {

            months.set(month, {

                month,

                ordinaryIncome: 0,
                ordinaryExpenses: 0,
                ordinaryBalance: 0,

                extraordinaryIncome: 0,
                extraordinaryExpenses: 0,
                extraordinaryBalance: 0,

                totalBalance: 0

            });

        }

        const current =
            months.get(month);

        const amount =
            Math.abs(
                Number(transaction.amount) || 0
            );

        const isOrdinary =
            transaction.balance_type === "Ordinario";

        const isExtraordinary =
            transaction.balance_type === "Straordinario";

        if (isOrdinary) {

            if (
                transaction.transaction_type ===
                "Entrata"
            ) {

                current.ordinaryIncome += amount;

            } else if (
                transaction.transaction_type ===
                "Uscita"
            ) {

                current.ordinaryExpenses += amount;

            }

        }

        if (isExtraordinary) {

            if (
                transaction.transaction_type ===
                "Entrata"
            ) {

                current.extraordinaryIncome += amount;

            } else if (
                transaction.transaction_type ===
                "Uscita"
            ) {

                current.extraordinaryExpenses += amount;

            }

        }

        current.ordinaryBalance =
            current.ordinaryIncome -
            current.ordinaryExpenses;

        current.extraordinaryBalance =
            current.extraordinaryIncome -
            current.extraordinaryExpenses;

        current.totalBalance =
            current.ordinaryBalance +
            current.extraordinaryBalance;

    });

    return [...months.values()]

        .map(month => ({

            ...month,

            ordinaryIncome:
                roundCurrency(
                    month.ordinaryIncome
                ),

            ordinaryExpenses:
                roundCurrency(
                    month.ordinaryExpenses
                ),

            ordinaryBalance:
                roundCurrency(
                    month.ordinaryBalance
                ),

            extraordinaryIncome:
                roundCurrency(
                    month.extraordinaryIncome
                ),

            extraordinaryExpenses:
                roundCurrency(
                    month.extraordinaryExpenses
                ),

            extraordinaryBalance:
                roundCurrency(
                    month.extraordinaryBalance
                ),

            totalBalance:
                roundCurrency(
                    month.totalBalance
                )

        }))

        .sort(
            (a, b) =>
                a.month.localeCompare(b.month)
        );

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

function buildProjection(
    lastMonth,
    averageOrdinaryBalance,
    averageTotalBalance
) {

    if (!lastMonth)
        return [];

    const result = [];

    const startDate = new Date(
        `${lastMonth.month}-01T00:00:00`
    );

    let cumulativeOrdinaryBalance =
        lastMonth.cumulativeOrdinaryBalance;

    let cumulativeTotalBalance =
        lastMonth.cumulativeTotalBalance;

    for (
        let i = 1;
        i <= 3;
        i++
    ) {

        const date = new Date(startDate);

        date.setMonth(
            date.getMonth() + i
        );

        const month =
            `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;

        cumulativeOrdinaryBalance =
            roundCurrency(
                cumulativeOrdinaryBalance +
                averageOrdinaryBalance
            );

        cumulativeTotalBalance =
            roundCurrency(
                cumulativeTotalBalance +
                averageTotalBalance
            );

        result.push({

            month,

            ordinaryBalance:
                roundCurrency(
                    averageOrdinaryBalance
                ),

            totalBalance:
                roundCurrency(
                    averageTotalBalance
                ),

            cumulativeOrdinaryBalance,

            cumulativeTotalBalance

        });

    }

    return result;

}

function buildHistoricalCumulative(months) {

    let cumulativeOrdinaryBalance = 0;
    let cumulativeExtraordinaryBalance = 0;
    let cumulativeTotalBalance = 0;

    return months.map(month => {

        cumulativeOrdinaryBalance =
            roundCurrency(
                cumulativeOrdinaryBalance +
                month.ordinaryBalance
            );

        cumulativeExtraordinaryBalance =
            roundCurrency(
                cumulativeExtraordinaryBalance +
                month.extraordinaryBalance
            );

        cumulativeTotalBalance =
            roundCurrency(
                cumulativeTotalBalance +
                month.totalBalance
            );

        return {

            ...month,

            cumulativeOrdinaryBalance,

            cumulativeExtraordinaryBalance,

            cumulativeTotalBalance

        };

    });

}

export default projectionService;