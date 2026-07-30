export default function AppToolbar({

    left,
    right,
    children,
    className = ""

}) {

    if (children) {

        return (

            <div className={`d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4 ${className}`}>

                {children}

            </div>

        );

    }

    return (

        <div className={`d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4 ${className}`}>

            <div className="d-flex flex-wrap gap-3">

                {left}

            </div>

            <div className="d-flex gap-2">

                {right}

            </div>

        </div>

    );

}