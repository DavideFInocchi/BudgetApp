import { useQuery } from "@tanstack/react-query";
import transactionService from "../services/transactionService";

export function useAvailablePeriods() {

    return useQuery({

        queryKey: ["available-periods"],

        queryFn: () => transactionService.getAvailablePeriods(),

        staleTime: Infinity,

    });

}