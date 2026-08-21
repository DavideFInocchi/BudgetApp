import { useQuery } from "@tanstack/react-query";

import reportService from "../services/reportService";

export function useReport(selectedPeriod) {

    const periodsQuery = useQuery({

        queryKey: ["report-periods"],

        queryFn: () =>
            reportService.getPeriods()

    });

    const periods =
        periodsQuery.data ?? [];

    const period =
        selectedPeriod ?? (
            periods.length
                ? {
                    from: periods[0],
                    to: periods[periods.length - 1]
                }
                : null
        );

    const summaryQuery = useQuery({

        queryKey: [
            "report-summary",
            period?.from,
            period?.to
        ],

        queryFn: () =>
            reportService.getSummary(period),

        enabled:
            Boolean(period?.from) &&
            Boolean(period?.to)

    });

    return {

        periods,

        period,

        summary:
            summaryQuery.data,

        isLoading:
            periodsQuery.isLoading ||
            summaryQuery.isLoading,

        error:
            periodsQuery.error ||
            summaryQuery.error

    };

}