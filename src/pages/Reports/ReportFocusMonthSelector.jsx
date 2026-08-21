export default function ReportFocusMonthSelector({

    periods = [],
    value,
    onChange

}) {

    const formatPeriod = (period) => {

        if (!period)
            return "";

        const date =
            new Date(`${period}T00:00:00`);

        return date.toLocaleDateString(
            "it-IT",
            {
                month: "short",
                year: "numeric"
            }
        );

    };


    if (!periods.length)
        return null;

    return (

        <div className="d-flex flex-column align-items-end gap-1">

            <span className="small text-muted">
                Mese analizzato
            </span>

            <select
                className="form-select form-select-sm"
                value={value ?? ""}
                onChange={event =>
                    onChange?.(event.target.value)
                }
                style={{
                    width: "150px"
                }}
            >

                {periods.map(period => {

                    const normalizedPeriod =
                        period.slice(0, 7);

                    return (

                        <option
                            key={period}
                            value={normalizedPeriod}
                        >
                            {formatPeriod(period)}
                        </option>

                    );

                })}

            </select>

        </div>

    );

}