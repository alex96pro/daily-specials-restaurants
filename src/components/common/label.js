
export default function Label(props) {
    return(
        <div className="label-accent-color-2">{props.name}
            <label className="label-accent-color">{props.value}</label>
        </div>
    );
};