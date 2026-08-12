import AppSelect from "../../components/ui/AppSelect";
import AppButton from "../../components/ui/AppButton";

export default function BudgetToolbar({

    period,
    periods = [],
    onPeriodChange,
    onSave,

}) {

    const options = periods.map(item => ({

        value: item.from.toISOString(),

        label: item.label,

    }));

    const handleChange = (event) => {

        const selected = periods.find(item =>

            item.from.toISOString() === event.target.value

        );

        onPeriodChange?.(selected);

    };

    return (

        <div className="d-flex align-items-center gap-2">

            <AppButton

                variant="primary"

                onClick={onSave}

            >
                Salva
            </AppButton>

            <div style={{ width: 240 }}>

                <AppSelect

                    value={period?.from?.toISOString() ?? ""}

                    options={options}

                    onChange={handleChange}

                />

            </div>

        </div>

    );

}