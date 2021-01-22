
import axios from 'axios';
import { BACKEND_API } from '../../util/consts';
import { loadingStatus, logInSuccess, logInFailed, forgottenPasswordSuccess, forgottenPasswordFailed, newPasswordSuccess, signUpNextStep } from '../actions/auth.actions';

export function logInAPI(data, loginSuccess) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.get(`${BACKEND_API}/auth-restaurant/login?email=${data.email}&password=${data.password}`);
            if(response.status === 200){
                localStorage.setItem("ACCESS_TOKEN_RESTAURANT", response.data.accessToken);
                localStorage.setItem("RESTAURANT_ID", response.data.restaurantId);
                dispatch(logInSuccess());
                loginSuccess();
            }
        }catch(err){
            switch(err.response.status){
                case 403:
                    dispatch(logInFailed('Please verify your account'));
                    break;
                case 401:
                    dispatch(logInFailed('Incorrect username or password'));
                    break;
                default:
                    dispatch(logInFailed('Server error'));
            }
            console.log(err);
        }
    };
};
export function signUpFirstStepAPI(data) {
    return async (dispatch) => {
        try{
            dispatch(signUpNextStep(data));
        }catch(err){
            
        }
    };
};
export function forgottenPasswordAPI(data) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.post(`${BACKEND_API}/auth-restaurant/forgotten-password`, data);
            if(response.status === 200){
                dispatch(forgottenPasswordSuccess('Please check your email and create new password with new link we sent you'));
            }
        }catch(err){
            switch(err.response.status){
                case 401:
                    dispatch(forgottenPasswordFailed("Email doesn't exist"));
                    break;
                case 400:
                    dispatch(forgottenPasswordFailed("Already sent you a link on your email"));
                    break;
                default:
                    dispatch(forgottenPasswordFailed('Server error'));
            }
            console.log(err);
        }
    };
};
export function newPasswordAPI(data, hashedId) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.post(`${BACKEND_API}/auth-restaurant/new-password`, {newPassword: data.newPassword, hashedId: hashedId});
            if(response.status === 200){
                dispatch(newPasswordSuccess('Successfully set your new password'))
            }
        }catch(err){
            if(err.response.status === 401){
                alert('UNAUTHORIZED');
            }
            console.log(err);
        }
    };
};
export function verifyAccountAPI(data) {
    return async (dispatch) => {
        try{

        }catch(err){

        }
    };
;}