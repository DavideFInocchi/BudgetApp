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

        const { data, error } = await supabase

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

        if (error)
            throw error;

        const transactions = data ?? [];

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
                    total + Math.abs(Number(transaction.amount)),
                0
            );

        const balance = income - expenses;

        const months = getMonthsInPeriod(
            period.from,
            period.to
        );

        const averageMonthlyBalance =
            months.length > 0
                ? balance / months.length
                : 0;

        return {
            income,
            expenses,
            balance,
            averageMonthlyBalance,
            months: months.length
        };

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

    const date = new Date(`${period}T00:00:00`);

    date.setMonth(
        date.getMonth() + 1
    );

    return date;

}
export default reportService;