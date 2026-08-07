import { useQuery } from "@tanstack/react-query";

import budgetService from "../services/budgetService";

export function useBudgetConfiguration(period) {

    return useQuery({

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

}