export const LOADING_STATUS_AUTH = "LOADING_STATUS_AUTH";
export const SIGN_UP_SECOND_STEP = "SIGN_UP_SECOND_STEP";
export const SIGN_UP_RETURN_FROM_SECOND_STEP = "SIGN_UP_RETURN_FROM_SECOND_STEP";
export const SIGN_UP_THIRD_STEP = "SIGN_UP_THIRD_STEP";
export const SIGN_UP_COMPLETE = "SIGN_UP_COMPLETE";
export const CHANGE_DELIVERY_CHECKBOX = "CHANGE_DELIVERY_CHECKBOX";
export const GET_PROFILE_DATA = "GET_PROFILE_DATA";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const CHANGE_WORKING_HOURS = "CHANGE_WORKING_HOURS";
export const DISABLE_DELIVERY = "DISABLE_DELIVERY";
export const LOGOUT = "LOGOUT";

export function loadingStatus(payload) {
    return {
        type: LOADING_STATUS_AUTH,
        payload
    };
};
export function signUpSecondStep(payload) {
    return {
        type: SIGN_UP_SECOND_STEP,
        payload
    };
};
export function signUpReturnFromSecondStep(payload) {
    return {
        type: SIGN_UP_RETURN_FROM_SECOND_STEP,
        payload
    };
};
export function signUpThirdStep(payload) {
    return {
        type: SIGN_UP_THIRD_STEP,
        payload
    };
};
export function signUpComplete(payload) {
    return {
        type: SIGN_UP_COMPLETE,
        payload
    };
};
export function changeDeliveryCheckbox(payload) {
    return {
        type: CHANGE_DELIVERY_CHECKBOX,
        payload
    };
};
export function getProfileData(payload) {
    return {
        type: GET_PROFILE_DATA,
        payload
    };
};
export function updateProfile(payload) {
    return {
        type: UPDATE_PROFILE,
        payload
    };
};
export function changeWorkingHours(payload) {
    return {
        type: CHANGE_WORKING_HOURS,
        payload
    };
};
export function disableDelivery(payload) {
    return {
        type: DISABLE_DELIVERY,
        payload
    };
};
export function logOut(payload) {
    return {
        type: LOGOUT,
        payload
    };
};