import { createPeriod, PeriodType } from "../models/Period";

export function createMonthPeriod(year, month) {

    const from = new Date(year, month - 1, 1);

    const to = new Date(year, month, 0);

    return createPeriod({

        type: PeriodType.MONTH,

        from,

        to,

        key: `${year}-${String(month).padStart(2, "0")}`,

        label: from.toLocaleDateString("it-IT", {

            month: "long",

            year: "numeric",

        }),

    });

}

export function createYearPeriod(year) {

    return createPeriod({

        type: PeriodType.YEAR,

        from: new Date(year, 0, 1),

        to: new Date(year, 11, 31),

        key: `${year}`,

        label: `${year}`,

    });

}

export function getCurrentMonth() {

    const today = new Date();

    return createMonthPeriod(

        today.getFullYear(),

        today.getMonth() + 1

    );

}

export function getCurrentYear() {

    return createYearPeriod(

        new Date().getFullYear()

    );

}

export function getAvailablePeriods() {

    return [

        createMonthPeriod(2025, 3),

        createMonthPeriod(2025, 4),

        createMonthPeriod(2025, 5),

        createMonthPeriod(2025, 6),

        createMonthPeriod(2025, 7),

        createMonthPeriod(2025, 8),

        createMonthPeriod(2025, 9),

        createMonthPeriod(2025, 10),

        createMonthPeriod(2025, 11),

        createMonthPeriod(2025, 12),

        createYearPeriod(2025),

    ];

}