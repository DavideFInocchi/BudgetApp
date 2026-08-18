import { useMemo } from "react";

export default function ReportPeriodSlider({

    periods = [],
    from,
    to,
    onChange

}) {

    const minIndex = 0;
    const maxIndex = Math.max(periods.length - 1, 0);

    const fromIndex = Math.max(
        periods.findIndex(period => period === from),
        minIndex
    );

    const toIndex = Math.max(
        periods.findIndex(period => period === to),
        fromIndex
    );

    const formatPeriod = (period) => {

        if (!period)
            return "";

        const date = new Date(`${period}T00:00:00`);

        return date.toLocaleDateString(
            "it-IT",
            {
                month: "short",
                year: "numeric"
            }
        );

    };

    const handleFromChange = (event) => {

        const index = Number(event.target.value);

        const newFrom = periods[index];

        if (!newFrom)
            return;

        if (index > toIndex)
            return;

        onChange?.({
            from: newFrom,
            to
        });

    };

    const handleToChange = (event) => {

        const index = Number(event.target.value);

        const newTo = periods[index];

        if (!newTo)
            return;

        if (index < fromIndex)
            return;

        onChange?.({
            from,
            to: newTo
        });

    };

    const labels = useMemo(() => {

        return periods.map(formatPeriod);

    }, [periods]);

    if (!periods.length)
        return null;

    return (

        <div className="report-period-slider">

            <div className="report-period-slider__header">

                <div>

                    <span className="report-period-slider__label">
                        Periodo
                    </span>

                    <strong>
                        {formatPeriod(from)}
                        {" → "}
                        {formatPeriod(to)}
                    </strong>

                </div>

            </div>

            <div className="report-period-slider__track">

                <div className="report-period-slider__range" />

                <input
                    type="range"
                    min={minIndex}
                    max={maxIndex}
                    value={fromIndex}
                    onChange={handleFromChange}
                    className="report-period-slider__input"
                />

                <input
                    type="range"
                    min={minIndex}
                    max={maxIndex}
                    value={toIndex}
                    onChange={handleToChange}
                    className="report-period-slider__input"
                />

            </div>

            <div className="report-period-slider__labels">

                {labels.map((label, index) => (

                    <span key={periods[index]}>
                        {label}
                    </span>

                ))}

            </div>

        </div>

    );

}