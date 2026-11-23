import { supabase } from "./supabase";
import { formatSqlDate } from "../utils/dateUtils";
import { fetchAllRows } from "./fetchAllRows";
const TABLE = "transactions";



const transactionService = {

    async getAll() {

        return fetchAllRows((from, to) =>
            supabase.from("vw_transactions").select("*")
                .order("transaction_date", { ascending: false })
                .order("created_at", { ascending: false })
                .order("id", { ascending: false }).range(from, to)
        );

    
    },

    async getByPeriod(period) {

        return fetchAllRows((from, to) =>
            supabase.from("vw_transactions").select("*")
                .gte("transaction_date", formatSqlDate(period.from))
                .lte("transaction_date", formatSqlDate(period.to))
                .order("transaction_date", { ascending: false })
                .order("created_at", { ascending: false })
                .order("id", { ascending: false }).range(from, to)
        );

    },
    
    async getAvailablePeriods() {

    const { data, error } = await supabase

        .from("vw_periods")

        .select("*")

        .order("period_date", { ascending: false });

        if (error)
            throw error;

        return data;

    },

    async create(transaction) {

        const { data, error } = await supabase

            .from(TABLE)

            .insert(transaction)

            .select()

            .single();

        if (error)
            throw error;

        return data;

    },

    async createMany(transactions) {

        const { data, error } = await supabase

            .from(TABLE)

            .insert(transactions)

            .select();

        if (error)
            throw error;

        return data;

    },

    async update(id, transaction) {

        const { data, error } = await supabase

            .from(TABLE)

            .update(transaction)

            .eq("id", id)

            .select()

            .single();

        if (error)
            throw error;

        return data;

    },

    async remove(id) {

        const { error } = await supabase

            .from(TABLE)

            .delete()

            .eq("id", id);

            if (error)
                throw error;

        },

    async getLatest(limit = 5) {

        const { data, error } = await supabase

            .from("vw_transactions")

            .select("*")

            .order("transaction_date", { ascending: false })

            .order("created_at", { ascending: false })

            .limit(limit);

        if (error)
            throw error;

        return data;

    },

    async getAverageSalary(months = 6) {

        const data = await fetchAllRows((from, to) =>
            supabase.from("vw_transactions")
                .select("id, amount, transaction_date, category_name")
                .eq("category_name", "Stipendio")
                .order("transaction_date", { ascending: false })
                .order("id", { ascending: false }).range(from, to)
        );

        const monthlySalaries = new Map();

        data.forEach(transaction => {

            const date = new Date(transaction.transaction_date);

            const key =
                `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}`;

            const amount = Number(transaction.amount) || 0;

            monthlySalaries.set(
                key,
                (monthlySalaries.get(key) || 0) + amount
            );

        });

        const salaries = [...monthlySalaries.values()]
            .slice(0, months);

        if (salaries.length === 0)
            return 0;

        const totalSalary = salaries.reduce(
            (total, salary) => total + salary,
            0
        );

        return totalSalary / salaries.length;

    },
    
    async checkImportDuplicates(transactions) {

        const fingerprints = [
            ...new Set(
                transactions
                    .map(transaction => transaction.source_fingerprint)
                    .filter(Boolean)
            )
        ];

        if (fingerprints.length === 0) {

            return {
                duplicates: [],
                newTransactions: transactions
            };

        }

        const data = [];
        const fingerprintBatchSize = 400;
        for (let index = 0; index < fingerprints.length; index += fingerprintBatchSize) {
            const batch = fingerprints.slice(index, index + fingerprintBatchSize);
            const rows = await fetchAllRows((from, to) =>
                supabase.from(TABLE).select("id, source_fingerprint")
                    .in("source_fingerprint", batch)
                    .order("id", { ascending: true }).range(from, to)
            );
            data.push(...rows);
        }

        const existingFingerprints = new Set(
            data.map(transaction =>
                transaction.source_fingerprint
            )
        );

        const duplicates = transactions.filter(
            transaction =>
                existingFingerprints.has(
                    transaction.source_fingerprint
                )
        );

        const newTransactions = transactions.filter(
            transaction =>
                !existingFingerprints.has(
                    transaction.source_fingerprint
                )
        );

        return {
            duplicates,
            newTransactions
        };

    },
    
    async findPossibleManualDuplicates(transactions) {

        if (!transactions?.length) {
            return [];
        }

        const dates = [
            ...new Set(
                transactions
                    .map(transaction => transaction.transaction_date)
                    .filter(Boolean)
            )
        ];

        const data = await fetchAllRows((from, to) =>
            supabase.from(TABLE).select(`
                id, transaction_date, amount, transaction_type, description, category_id
            `)
                .in("transaction_date", dates)
                .is("source_fingerprint", null)
                .order("transaction_date", { ascending: true })
                .order("id", { ascending: true }).range(from, to)
        );

        return transactions.map(transaction => {

            const matches = (data ?? []).filter(existing =>
                existing.transaction_date === transaction.transaction_date &&
                Number(existing.amount) === Number(transaction.amount) &&
                existing.transaction_type === transaction.transaction_type
            );

            return {
                transaction,
                matches
            };

        }).filter(result =>
            result.matches.length > 0
        );

    }
};

export default transactionService;