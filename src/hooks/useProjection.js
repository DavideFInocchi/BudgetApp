import { useQuery } from "@tanstack/react-query";

import projectionService
    from "../services/projectionService";

export function useProjection(period) {

    return useQuery({

        queryKey: [
            "projection",
            period?.from,
            period?.to
        ],

        queryFn: () =>
            projectionService
                .getProjection(period),

        enabled:
            Boolean(
                period?.from &&
                period?.to
            )

    });

}