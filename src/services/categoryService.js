import { supabase } from "./supabase";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return data;
}

export async function getActiveCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return data;
}

export async function getCategory(id) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createCategory(category) {
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateCategory(id, category) {
  const { data, error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteCategory(id) {

    const { error } = await supabase

        .from("categories")

        .delete()

        .eq("id", id);


    if (error) {

        /*
         * Categoria ancora utilizzata da una o più
         * transazioni.
         *
         * Il vincolo FK del database impedisce
         * correttamente la cancellazione.
         */
        if (
            error.code === "23503" ||
            error.message?.includes(
                "fk_transaction_category"
            )
        ) {

            throw new Error(
                "Impossibile eliminare la categoria: " +
                "è ancora utilizzata da una o più transazioni."
            );

        }


        throw error;

    }

}
