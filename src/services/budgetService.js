import { supabase } from "./supabase";

const TABLE = "vw_budget_status";

const budgetService = {

    async getAll() {

        const { data, error } = await supabase

            .from(TABLE)

            .select("*")

            .order("month", { ascending: true })

            .order("category_name", { ascending: true });

        if (error)
            throw error;

        return data;

    },

    async getByPeriod(period) {

        const { data, error } = await supabase

            .from(TABLE)

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

    }

};

export default budgetService;