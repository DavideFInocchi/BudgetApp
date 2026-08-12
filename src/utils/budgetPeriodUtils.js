import dayjs from "dayjs";
import "dayjs/locale/it";

dayjs.locale("it");

export function buildBudgetPeriods(firstMonth) {

    if (!firstMonth)
        return [];

    const periods = [];

    let current = dayjs(firstMonth).startOf("month");

    const last = dayjs().startOf("month");

    while (

        current.isBefore(last) ||

        current.isSame(last)

    ) {

        periods.unshift({

            type: "month",

            label: current.format("MMMM YYYY"),

            from: current.toDate(),

            to: current.endOf("month").toDate()

        });

        current = current.add(1, "month");

    }

    return periods;

}