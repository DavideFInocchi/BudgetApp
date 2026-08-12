import dayjs from "dayjs";

export function formatSqlDate(date) {

    return dayjs(date).format("YYYY-MM-DD");

}