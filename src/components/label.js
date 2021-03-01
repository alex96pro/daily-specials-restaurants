export default function Label(props) {
    return(
        <div className="label-accent-color">{props.name}
            <label className="label">{props.value}</label>
        </div>
    );
};