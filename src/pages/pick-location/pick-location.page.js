import './pick-location.page.scss';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { finishSignUpAPI } from '../../common/api/auth.api';
import GoogleMap from '../../components/google-map/google-map.component';
import MessageDanger from '../../components/common/message-danger';
import Loader from '../../images/loader.gif';

export default function Map() {

    const history = useHistory();
    const dispatch = useDispatch();
    const {restaurantSignUpInfo, loadingStatus} = useSelector(state => state.authentication);
    const [message, setMesage] = useState('');

    const passedSecondStep = (message) => {
        history.push({pathname: '/', message: message});
    };
    
    const finishSignUp = () => {
        if(localStorage.getItem('ADDRESS') === null){
            setMesage('Restaurant address is required');
        }else if(restaurantSignUpInfo.firstStepSuccess === false){
            setMesage('First step is not filled !');
        }else{
            const data = {
                email: restaurantSignUpInfo.email,
                address: localStorage.getItem('ADDRESS'),
                position: JSON.parse(localStorage.getItem('POSITION'))
            }
            dispatch(finishSignUpAPI(data, passedSecondStep));
        }
    };

    return(
        <div className="map" id="map">
            <GoogleMap/>
            <div className="google-maps-container">
                <input type="text" className="search-google-maps" id="search-google-maps" placeholder="Your restaurant address"></input>
                <button onClick={() => history.push('/sign-up')} className="button-maps">Previous step</button>
                <button onClick={finishSignUp} className="button-maps">
                    {loadingStatus? <img src={Loader} alt="Loading..." className="loader-small"/>
                    :'Finish sign up'}
                </button>
                {message && <MessageDanger text={message}/>}
            </div>
        </div>
    );
};