import { useQuery } from "@tanstack/react-query";
import { getActiveCategories } from "../services/categoryService";

export function useActiveCategories() {
    return useQuery({
        queryKey: ["categories", "active"],
        queryFn: getActiveCategories,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
        refetchOnWindowFocus: false,
    });
}