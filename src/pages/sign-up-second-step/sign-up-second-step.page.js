import './sign-up-second-step.page.scss';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signUpThirdStep } from '../../common/actions/auth.actions';
import GoogleMap from '../../components/google-map/google-map.component';
import InputError from '../../components/common/input-error';

export default function SignUpSecondStep() {

    const history = useHistory();
    const dispatch = useDispatch();
    const [message, setMesage] = useState('');
    const { restaurantSignUpInfo } = useSelector(state => state.authentication);

    const thirdStep = () => {
        if(localStorage.getItem('ADDRESS') === null){
            setMesage('Restaurant address is required');
        }else if(restaurantSignUpInfo.firstStepSuccess === false){
            setMesage('First step is not filled !');
        }else{
            const data = {
                location: localStorage.getItem('ADDRESS'),
                position: JSON.parse(localStorage.getItem('POSITION'))
            }
            dispatch(signUpThirdStep(data));
            history.push('/sign-up-third-step');
        }
    };

    return(
        <div className="map" id="map">
            <GoogleMap/>
            <div className="google-maps-container">
                <input type="text" className="search-google-maps" id="search-google-maps" 
                placeholder={restaurantSignUpInfo.location ? restaurantSignUpInfo.location : 'Your restaurant address'}></input>
                {message && <InputError text={message}/>}
                <button onClick={() => history.push('/sign-up')} className="button-normal">Previous step</button>
                <button onClick={thirdStep} className="button-normal">
                    Next step
                </button> 
            </div>
        </div>
    );
};