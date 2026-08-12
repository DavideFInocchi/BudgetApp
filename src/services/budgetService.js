import { supabase } from "./supabase";
import { formatSqlDate } from "../utils/dateUtils";

const MONTH_TABLE = "vw_budget_metrics";
const YEAR_TABLE = "vw_budget_metrics_year";
const CONFIGURATION_TABLE = "vw_budget_configuration";

const budgetService = {

    async getAll() {

        const { data, error } = await supabase

            .from(MONTH_TABLE)

            .select("*")

            .order("month", { ascending: true })

            .order("category_name", { ascending: true });

        if (error)
            throw error;

        return data;

    },

    async getByPeriod(period) {

        if (period.type === "month") {

            return this.getMonthlyBudget(period);

        }

        if (period.type === "year") {

            return this.getYearlyBudget(period);

        }

        throw new Error("Tipo periodo non supportato");

    },
    async getMonthlyBudget(period) {

    const { data, error } = await supabase

        .from(MONTH_TABLE)

        .select("*")

        .gte(
            "month",
            formatSqlDate(period.from)
        )

        .lte(
            "month",
            formatSqlDate(period.to)
        )

        .order("month", { ascending: true })

        .order("category_name", { ascending: true });

    if (error)
        throw error;

    return data;

    },
    async getYearlyBudget(period) {

    const { data, error } = await supabase

        .from(YEAR_TABLE)

        .select("*")

        .eq(
            "year",
            period.from.getFullYear()
        )

        .order("category_name", {
            ascending: true,
        });

        if (error)
            throw error;

        return data;

    },
    async getConfigurationByMonth(period) {

        const { data, error } = await supabase

            .from(CONFIGURATION_TABLE)

            .select("*")

            .eq(
                "month",
                formatSqlDate(period.from)
            )

            .order("category_name", {
                ascending: true,
            });

        if (error)
            throw error;

        return data;

    },
    async createMonth(period, copy = true) {

        const { data, error } = await supabase.rpc(

            "budget_create_month",

            {

                p_month: formatSqlDate(period.from),

                p_copy: copy

            }

        );

        if (error)
            throw error;

        return data[0];

    },
    async getFirstMonth() {

        const { data, error } = await supabase

            .from("budgets")

            .select("month")

            .order("month", { ascending: true })

            .limit(1);

        if (error)
            throw error;

        return data[0]?.month ?? null;

    },
    async saveMonth(period, budgets) {

        const { data, error } = await supabase.rpc(

            "budget_save_month",

            {
                p_month: formatSqlDate(period.from),
                p_budgets: budgets.map(budget => ({
                    id: budget.id,
                    amount: budget.budget
                }))
            }

        );

        if (error)
            throw error;

        return data[0];

    },
};


export default budgetService;