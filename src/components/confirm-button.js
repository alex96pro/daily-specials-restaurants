import Loader from '../images/loader.gif';

export default function ConfirmButton(props) {

    return (
        <button 
        type="button" 
        className={props.loadingStatus ? props.className+"-disabled" : props.className} 
        onClick={props.onClick}>

            {props.loadingStatus ? 
            <img src={Loader} className="loader-small" alt="Loading..."/> 
            : 
            props.text
            }

        </button>
    );
};