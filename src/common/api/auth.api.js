import { post } from './api';
import { successToast } from '../../util/toasts/toasts';
import { compressPhoto } from '../../util/functions';
import { loadingStatus, signUpSecondStep, getProfileData, updateProfile, signUpComplete, disableDelivery, changeWorkingHours } from '../actions/auth.actions';

export function logInAPI(data, loginSuccess, message) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        let response = await post(`/restaurant/auth/login`, data, false, {400:'Incorrect username or password',403:'Please verify your account'});
        if(response.status === 200){
            localStorage.setItem("ACCESS_TOKEN_RESTAURANT", response.data.accessToken);
            localStorage.setItem("RESTAURANT_ID", response.data.restaurantId);
            dispatch(getProfileData(response.data.restaurant));
            loginSuccess();
        }else{
            dispatch(loadingStatus(false));
            message(response);
        }
    };
};

export function signUpFirstStepAPI(data, passedFirstStep, message) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        data.restaurantName = data.restaurantName.trim(); //restaurant name has to be COMPLETLY unique
        let response = await post(`/restaurant/auth/sign-up-first-step`, data, false, {400:'Email already in use',403:'Restaurant name is taken'});
        if(response.status === 200){
            dispatch(signUpSecondStep(data));
            passedFirstStep();
        }else{
            dispatch(loadingStatus(false));
            message(response);
        }
    };
};

export function signUpCompleteAPI(data, successfullSignUp) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        let response = await post(`/restaurant/auth/sign-up-complete`, data, false);
        if(response.status === 200){
            dispatch(signUpComplete());
            localStorage.clear();
            successfullSignUp();
            successToast(`Successfully registered on Foozard, please check your email ${data.email} to verify your account`, false);
        }else{
            dispatch(loadingStatus(false));
        }
    };
};

export function verifyAccountAPI(hashedRestaurantId) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        let response = await post(`/restaurant/auth/verify-account`,{hashedRestaurantId:hashedRestaurantId}, false, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(loadingStatus(false));
        }else{
            dispatch(loadingStatus(false));
            alert(response);
        }
    };
};

export function forgottenPasswordAPI(data, message) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        let response = await post(`/restaurant/auth/forgotten-password`, data, false, {400:'We already sent you a link on your email',403:"Email doesn't exist"});
        if(response.status === 200){
            dispatch(loadingStatus(false));
            message('Please check your email and create new password with new link we sent you', true);
        }else{
            dispatch(loadingStatus(false));
            message(response);
        }
    };
};

export function newPasswordAPI(data, hashedId, message) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        let response = await post(`/restaurant/auth/new-password`, {newPassword: data.newPassword, hashedId: hashedId}, false, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(loadingStatus(false));
            message('Successfully set your new password', true);
        }else{
            dispatch(loadingStatus(false));
            alert(response);
        }
    };
};

export function changePasswordAPI(data, message) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        let response = await post(`/restaurant/auth/change-password`, {oldPassword: data.oldPassword, newPassword: data.newPassword}, true, {400:'Incorrect old password',401:'Unauthorized'});
        if(response.status === 200){
            dispatch(loadingStatus(false));
            message("Sucessfully changed your password", true);
        }else{
            dispatch(loadingStatus(false));
            message(response);
        }
    };
};

export function updateProfileAPI(data, message) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        data.name = data.name.trim() // restaurant name has to be COMPLETLY unique
        data.location = localStorage.getItem('ADDRESS');
        let position = JSON.parse(localStorage.getItem('POSITION'));
        if(position){
            data.lat = position.lat;
            data.lon = position.lon;
        }else{
            data.lat = null;
            data.lon = null;
        }
        if(data.newLogo){
            data.newLogo = await compressPhoto(data.newLogo);
            if(!data.newLogo){
                console.log("COMPRESSION FAILED");
                dispatch(loadingStatus(false));
                return;
            }
        }
        let response = await post(`/restaurant/auth/update-profile`, data, true, {400:'Restaurant name is taken'});
        if(response.status === 200){
            dispatch(updateProfile(response.data));
            successToast('Updated profile!');
            message('', true);
            localStorage.removeItem('ADDRESS');
            localStorage.removeItem('POSITION');
        }else{
            dispatch(loadingStatus(false));
            message(response);
        }
    }
};

export function disableDeliveryAPI(data, message) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        let response = await post(`/restaurant/auth/disable-delivery`, data, true, {400:'Incorrect password',401:'Unauthorized'});
        if(response.status === 200){
            dispatch(disableDelivery(response.data));
            message('', true);
            successToast('Disabled delivery!');
        }else{
            dispatch(loadingStatus(false));
            message(response);
        }
    }
};

export function changeWorkingHoursAPI(data) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        data.restaurantId = localStorage.getItem('RESTAURANT_ID');
        let response = await post(`/restaurant/auth/change-working-hours`, data, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(changeWorkingHours(response.data));
            successToast('Successfully changed!');
        }else{
            dispatch(loadingStatus(false));
            alert(response);
        }
    }
};
