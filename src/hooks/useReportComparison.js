import { useQuery } from "@tanstack/react-query";

import reportService
    from "../services/reportService";


export function useReportComparison(
    periodA,
    periodB
) {

    const queryA =
        useQuery({

            queryKey: [
                "report-comparison",
                periodA
            ],

            queryFn: () =>
                reportService.getTransactions({
                    from: periodA,
                    to: periodA
                }),

            enabled:
                Boolean(periodA)

        });


    const queryB =
        useQuery({

            queryKey: [
                "report-comparison",
                periodB
            ],

            queryFn: () =>
                reportService.getTransactions({
                    from: periodB,
                    to: periodB
                }),

            enabled:
                Boolean(periodB)

        });


    return {

        transactionsA:
            queryA.data ?? [],

        transactionsB:
            queryB.data ?? [],

        isLoading:
            queryA.isLoading ||
            queryB.isLoading,

        error:
            queryA.error ||
            queryB.error

    };

}