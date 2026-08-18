import { useQuery } from "@tanstack/react-query";

import reportService from "../services/reportService";

export function useReport(period) {

    const periodsQuery = useQuery({

        queryKey: ["report-periods"],

        queryFn: () =>
            reportService.getPeriods()

    });

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

        periods: periodsQuery.data ?? [],

        summary: summaryQuery.data,

        isLoading:
            periodsQuery.isLoading ||
            summaryQuery.isLoading,

        error:
            periodsQuery.error ||
            summaryQuery.error

    };

}