import LoaderGif from '../../images/loader.gif';

export default function Loader(props) {
    return(
        <div>
            <img src={LoaderGif} alt="Loading..." className={props.small ? "loader-small" : "loader"}/>
        </div>
    );
}