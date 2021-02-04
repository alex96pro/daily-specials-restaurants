import axios from 'axios';
import { BACKEND_API } from '../../util/consts';
import { loadingStatus, signUpNextStep, getProfileData, updateProfile } from '../actions/auth.actions';

export function logInAPI(data, loginSuccess, message) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.get(`${BACKEND_API}/auth-restaurant/login?email=${data.email}&password=${data.password}`);
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
export function changePasswordAPI(data, message) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            await axios.post(`${BACKEND_API}/auth-restaurant/change-password`, {oldPassword: data.oldPassword, newPassword: data.newPassword}, 
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
            //check if user changed anything in his profile
            if(!data.location && !data.name && !data.phone && !data.delivery && !data.deliveryRange && !data.deliveryMinimum){
                message('No changes to do', true);
                return;
            }
            let position = JSON.parse(localStorage.getItem('POSITION'));
            if(position){
                data.lat = position.lat;
                data.lon = position.lon;
            }else{
                data.lat = null;
                data.lon = null;
            }
            dispatch(loadingStatus(true));
            let response = await axios.post(`${BACKEND_API}/auth-restaurant/update-profile`, data,
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(updateProfile(response.data));
            message('Updated profile data', true);
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
            let response = await axios.post(`${BACKEND_API}/auth-restaurant/disable-delivery`, data,
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(updateProfile(response.data));
            message('Successfully disabled delivery', true);
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
}
