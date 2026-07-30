import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../services/categoryService";

export function useCategories() {

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        retry: 1,
        refetchOnWindowFocus: false,
    });

    const create = useMutation({
        mutationFn: createCategory,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
    });

    const update = useMutation({
        mutationFn: ({ id, category }) =>
            updateCategory(id, category),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
    });

    const remove = useMutation({
        mutationFn: deleteCategory,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
    });

    return {
        ...query,
        create,
        update,
        remove,
    };
}
