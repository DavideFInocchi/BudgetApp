import { useQuery } from "@tanstack/react-query";

import projectionService
    from "../services/projectionService";

export function useProjectionPeriods() {

    return useQuery({

        queryKey: ["projection-periods"],

        queryFn: () =>
            projectionService.getAvailablePeriods(),

        // Ricalcola i periodi anche se il report resta aperto al cambio mese.
        refetchInterval: 60 * 60 * 1000,
        refetchOnWindowFocus: true

    });

}