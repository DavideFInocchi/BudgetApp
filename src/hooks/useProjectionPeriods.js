import { useQuery } from "@tanstack/react-query";

import projectionService
    from "../services/projectionService";

export function useProjectionPeriods() {

    return useQuery({

        queryKey: ["projection-periods"],

        queryFn: () =>
            projectionService.getAvailablePeriods()

    });

}