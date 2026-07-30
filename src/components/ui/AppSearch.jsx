export default function AppSearch({

    value,
    onChange,
    placeholder = "Cerca..."

}) {

    return (

        <div className="mb-3">

            <div className="input-group">

                <span className="input-group-text">

                    <i className="bi bi-search"></i>

                </span>

                <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />

            </div>

        </div>

    );

}
