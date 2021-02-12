import axios from 'axios';
import { BACKEND_API } from '../../util/consts';
import { successToast } from '../../util/toasts/toasts';
import { loadingStatus, signUpSecondStep, getProfileData, updateProfile, signUpComplete, disableDelivery, changeWorkingHours } from '../actions/auth.actions';

export function logInAPI(data, loginSuccess, message) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.get(`${BACKEND_API}/restaurant-auth/login?email=${data.email}&password=${data.password}`);
            if(response.status === 200){
                localStorage.setItem("ACCESS_TOKEN_RESTAURANT", response.data.accessToken);
                localStorage.setItem("RESTAURANT_ID", response.data.restaurantId);
                dispatch(getProfileData(response.data.restaurant));
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
            data.restaurantName = data.restaurantName.trim(); //restaurant name has to be COMPLETLY unique
            let response = await axios.post(`${BACKEND_API}/restaurant-auth/sign-up-first-step`, data);
            if(response.status === 200){
                dispatch(signUpSecondStep(data));
                passedFirstStep();
            }
        }catch(err){
            dispatch(loadingStatus(false));
            switch(err.response.status){
                case 400:
                    message('Email is already in use', "email");
                    break;
                case 401:
                    message('Restaurant with that name already exists', "name");
                    break;
                default:
                    message('Server error');
            }
        }
    };
};
export function signUpCompleteAPI(data, successfullSignUp) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.post(`${BACKEND_API}/restaurant-auth/sign-up-complete`, data);
            if(response.status === 200){
                dispatch(signUpComplete());
                localStorage.clear();
                successfullSignUp();
                successToast(`Successfully registered on Daily specials, please check your email ${data.email} to verify your account`, false);
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
            let response = await axios.post(`${BACKEND_API}/restaurant-auth/verify-account`,{hashedRestaurantId:hashedRestaurantId});
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
            let response = await axios.post(`${BACKEND_API}/restaurant-auth/forgotten-password`, data);
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
            let response = await axios.post(`${BACKEND_API}/restaurant-auth/new-password`, {newPassword: data.newPassword, hashedId: hashedId});
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
export function changePasswordAPI(data, message) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            await axios.post(`${BACKEND_API}/restaurant-auth/change-password`, {oldPassword: data.oldPassword, newPassword: data.newPassword}, 
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(loadingStatus(false));
            message("Sucessfully changed your password", true);
        }catch(err){
            dispatch(loadingStatus(false));
            switch(err.response.status){
                case 400:
                    message("Incorrect old password");
                    break;
                case 401:
                    message("Unauthorized");
                    break;
                default:
                    message("Server error");
            }
        }
    };
}
export function updateProfileAPI(data, message) {
    return async (dispatch) => {
        try{
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
            dispatch(loadingStatus(true));
            let response = await axios.post(`${BACKEND_API}/restaurant-auth/update-profile`, data,
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(updateProfile(response.data));
            successToast('Updated profile!');
            message('', true);
            localStorage.removeItem('ADDRESS');
            localStorage.removeItem('POSITION');
        }catch(err){
            dispatch(loadingStatus(false));
            if(err.response.status === 400){
                message('Restaurant name is taken', false);
            }else{
                message('Server error', false);
            }
        }
    }
};
export function disableDeliveryAPI(data, message) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.post(`${BACKEND_API}/restaurant-auth/disable-delivery`, data,
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(disableDelivery(response.data));
            message('', true);
            successToast('Disabled delivery!');
        }catch(err){
            dispatch(loadingStatus(false));
            switch(err.response.status){
                case 400:
                    message("Wrong password");
                    break;
                case 401:
                    message("Unauthorized");
                    break;
                default:
                    message("Server error");
            }
        }
    }
};
export function changeWorkingHoursAPI(data) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.post(`${BACKEND_API}/restaurant-auth/change-working-hours/${localStorage.getItem('RESTAURANT_ID')}`, data,
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(changeWorkingHours(response.data));
            successToast('Successfully changed!');
        }catch(err){
            dispatch(loadingStatus(false));
            console.log(err);
        }
    }
};
