import './sign-up-second-step.page.scss';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signUpThirdStep, signUpReturnFromSecondStep } from '../../common/actions/auth.actions';
import GoogleMap from '../../components/google-map';
import InputError from '../../components/input-error';

export default function SignUpSecondStep() {

    const history = useHistory();
    const dispatch = useDispatch();
    const [message, setMesage] = useState('');
    const { restaurantSignUpInfo } = useSelector(state => state.authentication);

    const firstStep = () => {
        if(localStorage.getItem('ADDRESS')){ //user picked address so we need to persist address from local storage in store
            const data = {
                location: localStorage.getItem('ADDRESS'),
                position: JSON.parse(localStorage.getItem('POSITION'))
            }
            dispatch(signUpReturnFromSecondStep(data));
        }
        history.push('/sign-up');
    }
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

    useEffect(() => {
        if(localStorage.getItem('ACCESS_TOKEN_RESTAURANT')){
            history.push('/orders');
        }
    }, [history]);

    return(
        <div className="map" id="map">
            <GoogleMap/>
            <div className="google-maps-container">
                <input type="text" className="search-google-maps" id="search-google-maps" 
                placeholder={restaurantSignUpInfo.location || 'Your restaurant address'}/>
                {message && <InputError text={message}/>}
                <button onClick={firstStep} className="button-normal">Previous step</button>
                <button onClick={thirdStep} className="button-normal">
                    Next step
                </button> 
            </div>
        </div>
    );
};