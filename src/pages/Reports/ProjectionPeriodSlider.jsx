export default function ProjectionPeriodSlider({

    periods = [],
    from,
    to,
    onChange

}) {

    const maxIndex =
        Math.max(periods.length - 1, 0);

    const fromIndex = Math.max(
        periods.findIndex(
            period => period === from
        ),
        0
    );

    const toIndex = Math.max(
        periods.findIndex(
            period => period === to
        ),
        fromIndex
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

    const fromPercentage =
        maxIndex > 0
            ? (fromIndex / maxIndex) * 100
            : 0;

    const toPercentage =
        maxIndex > 0
            ? (toIndex / maxIndex) * 100
            : 0;

    const handleChange = (event) => {

        const index =
            Number(event.target.value);

        if (index >= toIndex)
            return;

        const newFrom =
            periods[index];

        if (!newFrom)
            return;

        onChange?.({
            from: newFrom,
            to
        });

    };

    if (!periods.length)
        return null;

    return (

        <div
            className="report-period-slider"
            style={{
                width: "100%"
            }}
        >

            <div className="report-period-slider__label">
                Storico utilizzato
            </div>

            <div className="report-period-slider__values">

                <strong>
                    {formatPeriod(from)}
                    {" → "}
                    {formatPeriod(to)}
                </strong>

            </div>

            <div className="report-period-slider__track">

                <div className="report-period-slider__track-bg" />

                <div
                    className="report-period-slider__track-selected"
                    style={{
                        left: `${fromPercentage}%`,
                        right: `${100 - toPercentage}%`
                    }}
                />

                <input
                    type="range"
                    min={0}
                    max={Math.max(toIndex - 1, 0)}
                    value={fromIndex}
                    onChange={handleChange}
                    className="
                        report-period-slider__input
                        report-period-slider__input--projection
                    "
                    aria-label="Inizio storico utilizzato"
                />

            </div>

            <div className="report-period-slider__endpoints">

                <span>
                    {formatPeriod(from)}
                </span>

                <span>
                    {formatPeriod(to)}
                </span>

            </div>

        </div>

    );

}