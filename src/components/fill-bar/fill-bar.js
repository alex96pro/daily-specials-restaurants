import './fill-bar.scss';

export default function FillBar(props) {

    return (
        
        <div className="fill-bar">

            <div className="fill-bar-amount" style={{width:props.percentage.toFixed(2) * 100 + '%'}}></div>
            <div className="fill-bar-label">{props.label}</div>
        </div>
    );
};