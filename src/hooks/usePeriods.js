import { useEffect, useState } from "react";

import transactionService from "../services/transactionService";
import { buildPeriods } from "../utils/periodUtils";

export function usePeriods() {

    const [periods, setPeriods] = useState([]);

    const [selectedPeriod, setSelectedPeriod] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {

        async function load() {

            try {

                const availablePeriods =
                    await transactionService.getAvailablePeriods();

                const builtPeriods =
                    buildPeriods(availablePeriods);

                setPeriods(builtPeriods);

                setSelectedPeriod(builtPeriods[0] ?? null);

            } catch (err) {

                setError(err);

            } finally {

                setIsLoading(false);

            }

        }

        load();

    }, []);

    return {

        periods,

        selectedPeriod,

        setSelectedPeriod,

        isLoading,

        error,

    };

}