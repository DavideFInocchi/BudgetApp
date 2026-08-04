export const PeriodType = {

    MONTH: "month",

    YEAR: "year",

    CUSTOM: "custom",

};

export function createPeriod({

    type,

    from,

    to,

    key,

    label,

}) {

    return {

        type,

        from,

        to,

        key,

        label,

    };

}