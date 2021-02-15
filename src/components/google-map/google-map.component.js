import {useEffect} from 'react';
import {useHistory} from 'react-router-dom';

export default function GoogleMap() {

    const history = useHistory();
    useEffect(() => {
        const googleMapsScript = document.getElementById('google-maps-script');
        if(googleMapsScript){
            //WHEN SCRIPT IS ALREADY LOADED MAP WON'T SHOW UNTIL REFRESH
            history.go(0);
        }
    // eslint-disable-next-line    
    }, []);
    return (
    <div style={{height:'100vh', width:'100vw'}} id="map-container">
    </div>);
};