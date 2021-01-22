import LoaderGif from '../../images/loader.gif';

export default function Loader() {
    return(
        <div>
            <img src={LoaderGif} alt="Loading..." className="loader"/>
        </div>
    );
}