import { useQuery } from "@tanstack/react-query";

import reportService from "../services/reportService";

export function useReportFocus(focusMonth) {

    return useQuery({

        queryKey: [
            "report-focus",
            focusMonth
        ],

        queryFn: () =>
            reportService.getFocusDistribution(
                focusMonth
            ),

        enabled:
            Boolean(focusMonth)

    });

}