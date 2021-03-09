import { useEffect } from 'react';

export default function GoogleAutocomplete(props) {
    const initMap = window.initMap;
    useEffect(() => {
        const googleMapsScript = document.getElementById('google-maps-script');
        if(!googleMapsScript){ //scripts not loaded
            const script1 = document.createElement('script');
            script1.src = "./initMap.js";
            document.body.appendChild(script1);
            script1.onload = () => {
                const script2 = document.createElement('script');
                script2.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&callback=initMap&libraries=places&v=weekly`;
                script2.id = 'google-maps-script';
                document.body.appendChild(script2);
            }
        }else{
            // if google maps scripts are loaded that means that user redirected to page where autocomplete is needed
            // in that case for some reason initMap function needs to be called again.
            // initMap always puts one div with className pac-container so we need to remove it because we only need 1 in order for autocomplete to work properly
            initMap();
            setTimeout(() => {
                let SecondPacContainer = document.getElementsByClassName('pac-container')[1];
                if(SecondPacContainer){
                    SecondPacContainer.remove();
                }
            },1500); //wait till 2nd pac container is added and then remove it (1.5s is long enough but just for every case)
        }
        return (() => {
            // on unmount we need to remove pac container (only one) because new one will be added on mount
            let pacContainer = document.getElementsByClassName('pac-container')[0];
            if(pacContainer){
                pacContainer.remove();
            }
        });
        //eslint-disable-next-line
    }, []);

    return(
        <input type="text" id="search-google-maps" placeholder={props.placeholder ? props.placeholder : ''} className="app-input"/>
    );
};