import LoaderGif from '../images/loader.gif';

export default function Loader(props) {
    return(
        <div>
            {props.className === "loader-center" && <div className="loader-center-overlay"></div>}
            <img src={LoaderGif} alt="Loading..." className={props.className || "loader"}/>
        </div>
    );
}