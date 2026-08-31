import { useEffect, useState } from "react";

import transactionService from "../services/transactionService";
import { buildPeriods } from "../utils/periodUtils";

const DASHBOARD_PERIOD_STORAGE_KEY =
    "budgetapp.dashboard.period";

export function usePeriods() {

    const [periods, setPeriods] =
        useState([]);

    const [selectedPeriod, setSelectedPeriod] =
        useState(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    useEffect(() => {

        async function load() {

            try {

                const availablePeriods =
                    await transactionService
                        .getAvailablePeriods();

                const builtPeriods =
                    buildPeriods(
                        availablePeriods
                    );

                setPeriods(
                    builtPeriods
                );


                /*
                 * Recuperiamo l'ultimo periodo
                 * selezionato dalla Dashboard.
                 */
                const savedPeriod =
                    localStorage.getItem(
                        DASHBOARD_PERIOD_STORAGE_KEY
                    );


                const savedPeriodObject =
                    builtPeriods.find(
                        period =>
                            period.key ===
                            savedPeriod
                    );


                /*
                 * Se il periodo salvato esiste ancora
                 * lo utilizziamo.
                 *
                 * Altrimenti manteniamo il comportamento
                 * precedente e partiamo dal primo disponibile.
                 */
                setSelectedPeriod(
                    savedPeriodObject ??
                    builtPeriods[0] ??
                    null
                );

            } catch (err) {

                setError(
                    err
                );

            } finally {

                setIsLoading(
                    false
                );

            }

        }

        load();

    }, []);


    const handlePeriodChange =
        period => {

            setSelectedPeriod(
                period
            );


            /*
             * Salviamo solamente la chiave del periodo.
             */
            if (period?.key) {

                localStorage.setItem(
                    DASHBOARD_PERIOD_STORAGE_KEY,
                    period.key
                );

            } else {

                localStorage.removeItem(
                    DASHBOARD_PERIOD_STORAGE_KEY
                );

            }

        };


    return {

        periods,

        selectedPeriod,

        setSelectedPeriod:
            handlePeriodChange,

        isLoading,

        error,

    };

}