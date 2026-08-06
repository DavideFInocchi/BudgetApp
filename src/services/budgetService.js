import { supabase } from "./supabase";


const MONTH_TABLE = "vw_budget_metrics";
const YEAR_TABLE = "vw_budget_metrics_year";
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
            period.from.toISOString().split("T")[0]
        )

        .lte(
            "month",
            period.to.toISOString().split("T")[0]
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

    }

};


export default budgetService;