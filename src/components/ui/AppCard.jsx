export default function AppCard({

    title,
    children,
    className = ""

}) {

    return (

        <div className={`card shadow-sm border-0 ${className}`}>

            {title && (

                <div className="card-header bg-white">

                    <h5 className="mb-0">

                        {title}

                    </h5>

                </div>

            )}

            <div className="card-body">

                {children}

            </div>

        </div>

    );

}
