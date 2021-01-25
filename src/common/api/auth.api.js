import axios from 'axios';
import { BACKEND_API } from '../../util/consts';
import { loadingStatus, signUpNextStep } from '../actions/auth.actions';

export function logInAPI(data, loginSuccess, message) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.get(`${BACKEND_API}/auth-restaurant/login?email=${data.email}&password=${data.password}`);
            if(response.status === 200){
                localStorage.setItem("ACCESS_TOKEN_RESTAURANT", response.data.accessToken);
                localStorage.setItem("RESTAURANT_ID", response.data.restaurantId);
                dispatch(loadingStatus(false));
                loginSuccess();
            }
        }catch(err){
            dispatch(loadingStatus(false));
            switch(err.response.status){
                case 403:
                    message('Please verify your account');
                    break;
                case 401:
                    message('Incorrect username or password');
                    break;
                default:
                    message('Server error');
            }
            console.log(err);
        }
    };
};
export function signUpFirstStepAPI(data, passedFirstStep, message) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.post(`${BACKEND_API}/auth-restaurant/sign-up-first-step`, data);
            if(response.status === 200){
                dispatch(signUpNextStep(data));
                passedFirstStep();
            }
        }catch(err){
            dispatch(loadingStatus(false));
            switch(err.response.status){
                case 400:
                    message('Email is already in use');
                    break;
                case 401:
                    message('Restaurant with that name already exists');
                    break;
                default:
                    message('Server error');
            }
        }
    };
};
export function finishSignUpAPI(data, passedSecondStep) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.post(`${BACKEND_API}/auth-restaurant/sign-up-complete`, data);
            if(response.status === 200){
                dispatch(loadingStatus(false));
                localStorage.clear();
                passedSecondStep('Successfuly signed up for your restaurant. Please check your e-mail and verify your account');
            }
        }catch(err){
            dispatch(loadingStatus(false));
            alert('SERVER ERROR');
            console.log(err);
        }
    };
};
export function verifyAccountAPI(hashedRestaurantId) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.post(`${BACKEND_API}/auth-restaurant/verify-account`,{hashedRestaurantId:hashedRestaurantId});
            if(response.status === 200){
                dispatch(loadingStatus(false));
            }
        }catch(err){
            dispatch(loadingStatus(false));
            if(err.response.status === 401){
                alert("UNAUTHORIZED");
            }else{
                alert("SERVER ERROR");
            }
            console.log(err);
        }
    };
}
export function forgottenPasswordAPI(data, message) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.post(`${BACKEND_API}/auth-restaurant/forgotten-password`, data);
            if(response.status === 200){
                dispatch(loadingStatus(false));
                message('Please check your email and create new password with new link we sent you', true);
            }
        }catch(err){
            dispatch(loadingStatus(false));
            switch(err.response.status){
                case 401:
                    message("Email doesn't exist");
                    break;
                case 400:
                    message("Already sent you a link on your email");
                    break;
                default:
                    message('Server error');
            }
            console.log(err);
        }
    };
};
export function newPasswordAPI(data, hashedId, message) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.post(`${BACKEND_API}/auth-restaurant/new-password`, {newPassword: data.newPassword, hashedId: hashedId});
            if(response.status === 200){
                dispatch(loadingStatus(false));
                message('Successfully set your new password', true);
            }
        }catch(err){
            dispatch(loadingStatus(false));
            if(err.response.status === 401){
                alert('UNAUTHORIZED');
            }
            console.log(err);
        }
    };
};