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

        <div className="budget-toolbar">

            <div className="budget-toolbar__period">

                <AppSelect
                    value={period?.from?.toISOString() ?? ""}
                    options={options}
                    onChange={handleChange}
                />

            </div>

            <div className="budget-toolbar__actions">

                <AppButton
                    variant="primary"
                    onClick={onSave}
                >
                    Salva
                </AppButton>

            </div>

        </div>

    );

}