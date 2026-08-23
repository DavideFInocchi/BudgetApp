import { supabase } from "./supabase";
import { formatSqlDate } from "../utils/dateUtils";

const reportService = {
    async getPeriods() {

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
    async getSummary(period) {

        // ==============================
        // DATI DEL PERIODO SELEZIONATO
        // ==============================

        const { data: periodData, error: periodError } =
            await supabase
                .from("vw_transactions")
                .select(
                    "transaction_date, transaction_type, amount, balance_type"
                )
                .gte(
                    "transaction_date",
                    formatSqlDate(period.from)
                )
                .lt(
                    "transaction_date",
                    formatSqlDate(
                        getNextMonth(period.to)
                    )
                );

        if (periodError)
            throw periodError;


        const transactions =
            periodData ?? [];


        // ==============================
        // SUMMARY
        // ==============================

        const income = transactions
            .filter(
                transaction =>
                    transaction.transaction_type === "Entrata"
            )
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );


        const expenses = transactions
            .filter(
                transaction =>
                    transaction.transaction_type === "Uscita"
            )
            .reduce(
                (total, transaction) =>
                    total +
                    Math.abs(Number(transaction.amount)),
                0
            );


        const balance =
            income - expenses;


        const months =
            getMonthsInPeriod(
                period.from,
                period.to
            );


        const averageMonthlyBalance =
            months.length > 0
                ? balance / months.length
                : 0;


        // ==============================
        // RISULTATO
        // ==============================

        return {

            income,

            expenses,

            balance,

            averageMonthlyBalance,

            months,

            monthlyBalance:
                buildMonthlyBalance(
                    transactions
                )

        };

    },
    async getFocusDistribution(focusMonth) {

        const { data, error } = await supabase

            .from("vw_transactions")

            .select(
                "transaction_date, transaction_type, amount, balance_type"
            );

        if (error)
            throw error;

        return buildBalanceDistribution(
            data ?? [],
            focusMonth
        );

    }
};

function getMonthsInPeriod(from, to) {

    const start = new Date(from);
    const end = new Date(to);

    start.setDate(1);
    end.setDate(1);

    const months = [];

    while (start <= end) {

        months.push(
            new Date(start)
        );

        start.setMonth(
            start.getMonth() + 1
        );

    }

    return months;

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

    return `${nextYear}-${String(
        nextMonth
    ).padStart(2, "0")}-01`;

}

function buildMonthlyBalance(transactions) {

    const months = new Map();

    transactions.forEach(transaction => {

        const date = new Date(
            `${transaction.transaction_date}T00:00:00`
        );

        const month =
            `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;

        const amount = Number(transaction.amount) || 0;

        if (!months.has(month)) {

            months.set(month, {
                month,
                income: 0,
                expenses: 0,
                balance: 0
            });

        }

        const current = months.get(month);

        if (amount > 0) {

            current.income += amount;

        } else if (amount < 0) {

            current.expenses += Math.abs(amount);

        }

        current.balance =
            current.income - current.expenses;

    });

    return [...months.values()]
        .sort((a, b) =>
            a.month.localeCompare(b.month)
        );

}
function buildDailyMonthlyBalance(transactions) {

    const months = new Map();

    transactions.forEach(transaction => {

        const date = new Date(
            `${transaction.transaction_date}T00:00:00`
        );

        const month =
            `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;

        const day = date.getDate();

        if (!months.has(month)) {

            months.set(month, {
                month,
                transactions: []
            });

        }

        months.get(month).transactions.push({
            day,
            amount: Number(transaction.amount) || 0
        });

    });

    return [...months.values()]
        .sort((a, b) =>
            a.month.localeCompare(b.month)
        )
        .map(monthData => {

            const year = Number(
                monthData.month.slice(0, 4)
            );

            const month = Number(
                monthData.month.slice(5, 7)
            );

            const daysInMonth =
                new Date(year, month, 0).getDate();

            const dailyBalance = [];

            let cumulative = 0;

            for (let day = 1; day <= daysInMonth; day++) {

                const transactionsOfDay =
                    monthData.transactions.filter(
                        transaction =>
                            transaction.day === day
                    );

                transactionsOfDay.forEach(transaction => {

                    cumulative += transaction.amount;

                });

                dailyBalance.push({
                    day,
                    balance: cumulative
                });

            }

            return {
                month: monthData.month,
                dailyBalance
            };

        });

}
function percentile(values, percentile) {

    if (!values.length)
        return null;

    const sorted = [...values].sort(
        (a, b) => a - b
    );

    const index =
        (sorted.length - 1) * percentile;

    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper)
        return sorted[lower];

    return (
        sorted[lower] +
        (sorted[upper] - sorted[lower]) *
        (index - lower)
    );

}
function buildBalanceDistribution(
    transactions,
    focusMonth
) {

    const months = new Map();

    transactions.forEach(transaction => {

        const date = new Date(
            `${transaction.transaction_date}T00:00:00`
        );

        const month =
            `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;

        const day = date.getDate();

        if (!months.has(month)) {

            months.set(month, []);

        }

        months.get(month).push({
            day,
            amount:
                Number(transaction.amount) || 0
        });

    });

    const monthlyBalances = [];

    [...months.entries()]
        .sort(([a], [b]) =>
            a.localeCompare(b)
        )
        .forEach(([month, monthTransactions]) => {

            let cumulative = 0;

            const days = [];

            const year =
                Number(month.slice(0, 4));

            const monthNumber =
                Number(month.slice(5, 7));

            const daysInMonth =
                new Date(
                    year,
                    monthNumber,
                    0
                ).getDate();

            for (
                let day = 1;
                day <= daysInMonth;
                day++
            ) {

                monthTransactions
                    .filter(
                        transaction =>
                            transaction.day === day
                    )
                    .forEach(transaction => {

                        cumulative +=
                            transaction.amount;

                    });

                days.push({
                    day,
                    balance: cumulative
                });

            }

            monthlyBalances.push({
                month,
                days
            });

        });

    const historicalMonths = monthlyBalances;

    const focusData =
        monthlyBalances.find(
            item => item.month === focusMonth
        );

    const distribution = [];

    for (let day = 1; day <= 31; day++) {

        const values = historicalMonths
            .map(month => {

                const item =
                    month.days.find(
                        value =>
                            value.day === day
                    );

                return item?.balance;

            })
            .filter(
                value =>
                    value !== undefined
            );

        distribution.push({

            day,

            p25:
                percentile(values, 0.25),

            median:
                percentile(values, 0.50),

            p75:
                percentile(values, 0.75),

            focus:
                focusData?.days.find(
                    value =>
                        value.day === day
                )?.balance ?? null

        });

    }
    const monthlyPercentile =
        calculateMonthlyPercentile(
            monthlyBalances,
            focusMonth
        );

    const percentileDescription =
        getPercentileDescription(
            monthlyPercentile
        );
    const focusDays = distribution.filter(
        item =>
            item.focus !== null &&
            item.focus !== undefined
    );

    const daysInRange = focusDays.filter(
        item =>
            item.p25 !== null &&
            item.p75 !== null &&
            item.focus >= item.p25 &&
            item.focus <= item.p75
    ).length;

    const daysBelowRange = focusDays.filter(
        item =>
            item.p25 !== null &&
            item.focus < item.p25
    ).length;

    const daysAboveRange = focusDays.filter(
        item =>
            item.p75 !== null &&
            item.focus > item.p75
    ).length;

    const totalDays = focusDays.length;

    const percentageInRange =
        totalDays > 0
            ? (daysInRange / totalDays) * 100
            : 0;
    return {

        focusMonth,

        distribution,

        monthlyPercentile,

        percentileDescription,

        daysInRange,

        daysBelowRange,

        daysAboveRange,

        totalDays,

        percentageInRange

    };

}
function calculateMonthlyPercentile(
    monthlyBalances,
    focusMonth
) {

    const monthlyFinalBalances =
        monthlyBalances
            .map(month => {

                const lastDay =
                    month.days.at(-1);

                return {
                    month: month.month,
                    balance: lastDay?.balance ?? 0
                };

            })
            .filter(
                item =>
                    item.balance !== null &&
                    item.balance !== undefined
            );

    const focus =
        monthlyFinalBalances.find(
            item =>
                item.month === focusMonth
        );

    if (!focus || monthlyFinalBalances.length === 0) {

        return null;

    }

    const values =
        monthlyFinalBalances.map(
            item => item.balance
        );

    const countLessOrEqual =
        values.filter(
            value =>
                value <= focus.balance
        ).length;

    return (
        countLessOrEqual /
        values.length
    ) * 100;

}
function getPercentileDescription(percentile) {

    if (percentile === null || percentile === undefined)
        return "";

    if (percentile < 25) {

        return "Il saldo finale è tra i risultati più bassi dello storico.";

    }

    if (percentile > 75) {

        return "Il saldo finale è tra i risultati migliori dello storico.";

    }

    return "Il saldo finale è in linea con lo storico.";

}
export default reportService;