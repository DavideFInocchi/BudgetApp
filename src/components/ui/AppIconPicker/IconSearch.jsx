import AppInput from "../AppInput";

export default function IconSearch({

    value,
    onChange

}) {

    return (

        <AppInput
            type="text"
            placeholder="Cerca icona..."
            className="mb-3"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />

    );

}