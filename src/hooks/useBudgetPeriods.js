import { useEffect, useState } from "react";

import dayjs from "dayjs";

import budgetService from "../services/budgetService";

import { buildBudgetPeriods } from "../utils/budgetPeriodUtils";

export function useBudgetPeriods() {

    const [periods, setPeriods] = useState([]);

    const [selectedPeriod, setSelectedPeriod] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {

        async function load() {

            try {

                const firstMonth =
                    await budgetService.getFirstMonth();

                if (!firstMonth) {

                    setPeriods([]);
                    setSelectedPeriod(null);

                    return;

                }

                const builtPeriods =
                    buildBudgetPeriods(firstMonth);

                setPeriods(builtPeriods);

                const currentMonth =
                    dayjs().startOf("month");

                const selected =
                    builtPeriods.find(period =>

                        dayjs(period.from).isSame(currentMonth)

                    );

                setSelectedPeriod(

                    selected ??

                    builtPeriods[0] ??

                    null

                );

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