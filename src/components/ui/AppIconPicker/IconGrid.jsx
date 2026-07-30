export default function IconGrid({

    icons,
    selected,
    onSelect

}) {

    if (icons.length === 0) {

        return (

            <div className="text-center text-muted py-4">

                Nessuna icona trovata

            </div>

        );

    }

    return (

        <div className="row g-2">

            {icons.map(icon => {

                const isSelected = icon.value === selected;

                return (

                    <div
                        key={icon.value}
                        className="col-3 col-md-2"
                    >

                        <button
                            type="button"
                            title={icon.label}
                            onClick={() => onSelect(icon)}
                            className={`btn w-100 d-flex flex-column align-items-center gap-2 py-3 ${
                                isSelected
                                    ? "btn-primary"
                                    : "btn-outline-secondary"
                            }`}
                        >

                            <i
                                className={`bi bi-${icon.value}`}
                                style={{ fontSize: "1.5rem" }}
                            />

                            <small
                                className="text-truncate w-100"
                                style={{ fontSize: ".75rem" }}
                            >

                                {icon.label}

                            </small>

                        </button>

                    </div>

                );

            })}

        </div>

    );

}