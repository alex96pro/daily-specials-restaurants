import Loader from '../images/loader.gif';

export default function ConfirmButton(props) {

    return (
        <button 
        type="button" 
        className={props.small ? props.loadingStatus ? "button-normal-disabled" : "button-normal" 
        : props.loadingStatus ? "button-long-disabled" : "button-long"} 
        onClick={props.onClick}>

            {props.loadingStatus ? 
            <img src={Loader} className="loader-small" alt="Loading..."/> 
            : 
            props.text
            }

        </button>
    );
};