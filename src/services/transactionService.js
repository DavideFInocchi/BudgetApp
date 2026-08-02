import { supabase } from "./supabase";

const TABLE = "transactions";



const transactionService = {

    async getAll() {

    const { data, error } = await supabase

        .from("vw_transactions")

        .select("*")

        .order("transaction_date", { ascending: false })

        .order("created_at", { ascending: false });
        console.log(data);
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

}
};

export default transactionService;