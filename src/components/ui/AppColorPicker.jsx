import {
    forwardRef,
    useEffect,
    useId,
    useState
} from "react";

const AppColorPicker = forwardRef(function AppColorPicker({

    id,
    label,
    error,
    value,
    onChange,
    onInput,
    className = "",
    ...props

}, ref) {

    const generatedId = useId();
    const inputId = id ?? props.name ?? generatedId;
    const [currentColor, setCurrentColor] = useState(value ?? "#000000");

    useEffect(() => {

        setCurrentColor(value ?? "#000000");

    }, [value]);

    const handleColorChange = (event) => {

        setCurrentColor(event.target.value);
        onChange?.(event);

    };

    const handleColorInput = (event) => {

        setCurrentColor(event.target.value);
        onInput?.(event);

    };

    return (

        <div className="mb-3">

            {label && (

                <label
                    className="form-label"
                    htmlFor={inputId}
                >

                    {label}

                </label>

            )}

            <div className="input-group">

                <input
                    ref={ref}
                    id={inputId}
                    type="color"
                    {...props}
                    value={currentColor}
                    className={`form-control form-control-color ${error ? "is-invalid" : ""} ${className}`}
                    aria-label={label ?? "Seleziona colore"}
                    onChange={handleColorChange}
                    onInput={handleColorInput}
                />

                <span className="input-group-text font-monospace">

                    {currentColor.toUpperCase()}

                </span>

            </div>

            {error && (

                <div className="invalid-feedback d-block">

                    {error}

                </div>

            )}

        </div>

    );

});

export default AppColorPicker;
