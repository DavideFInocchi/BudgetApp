export default function AppButton({

    children,
    variant = "primary",
    type = "button",
    onClick,
    className = "",
    disabled = false

}) {

    return (

        <button
            type={type}
            className={`btn btn-${variant} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >

            {children}

        </button>

    );

}
