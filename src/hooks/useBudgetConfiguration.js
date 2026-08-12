import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";

import budgetService from "../services/budgetService";

export function useBudgetConfiguration(period) {

    const queryClient = useQueryClient();

    const query = useQuery({

        queryKey: [

            "budget-configuration",

            period?.from?.toISOString()

        ],

        queryFn: () =>

            budgetService.getConfigurationByMonth(period),

        enabled: !!period,

        staleTime: 1000 * 60 * 5,

        gcTime: 1000 * 60 * 30,

        refetchOnWindowFocus: false,

    });

    const createMonth = useMutation({

        mutationFn: ({ period, copy }) =>

            budgetService.createMonth(period, copy),

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["budget-configuration"]

            });

        }

    });
    const saveMonth = useMutation({

        mutationFn: ({ period, budgets }) =>

            budgetService.saveMonth(period, budgets),

        onSuccess: () => {

            queryClient.invalidateQueries({

                queryKey: ["budget-configuration"]

            });

        }

    });

    return {

        ...query,

        createMonth,
        saveMonth

    };

}