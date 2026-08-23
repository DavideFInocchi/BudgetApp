export default function BudgetCalibrationPeriodSlider({

    periods = [],
    from,
    to,
    onChange

}) {

    if (!periods.length)
        return null;

    const currentIndex =
        Math.max(
            periods.indexOf(from),
            0
        );

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

    const handleChange = (event) => {

        const index =
            Number(event.target.value);

        const selectedPeriod =
            periods[index];

        onChange?.(
            selectedPeriod
        );

    };

    return (

        <div className="mb-4">

            <div className="d-flex justify-content-between align-items-center mb-2">

                <div>

                    <div className="small text-muted">
                        Periodo analizzato
                    </div>

                    <div className="fw-semibold">

                        {formatPeriod(from)}
                        {" → "}
                        {formatPeriod(to)}

                    </div>

                </div>

            </div>

            <input
                type="range"
                className="form-range"
                min={0}
                max={periods.length - 1}
                value={currentIndex}
                onChange={handleChange}
            />

            <div className="d-flex justify-content-between small text-muted">

                <span>
                    {formatPeriod(periods[0])}
                </span>

                <span>
                    {formatPeriod(to)}
                </span>

            </div>

        </div>

    );

}