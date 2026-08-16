import { useQuery } from "@tanstack/react-query";

import transactionService from "../services/transactionService";

export function useAverageSalary(months = 6) {

    return useQuery({

        queryKey: ["averageSalary", months],

        queryFn: () =>
            transactionService.getAverageSalary(months),

    });

}