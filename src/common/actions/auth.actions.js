export const LOADING_STATUS_AUTH = "LOADING_STATUS_AUTH";
export const SIGN_UP_NEXT_STEP = "SIGN_UP_NEXT_STEP";
export const CHANGE_DELIVERY_CHECKBOX = "CHANGE_DELIVERY_CHECKBOX";
export const GET_PROFILE_DATA = "GET_PROFILE_DATA";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const LOGOUT = "LOGOUT";

export function loadingStatus(payload) {
    return {
        type: LOADING_STATUS_AUTH,
        payload
    };
};
export function signUpNextStep(payload) {
    return {
        type: SIGN_UP_NEXT_STEP,
        payload
    };
};
export function changeDeliveryCheckbox(payload) {
    return {
        type: CHANGE_DELIVERY_CHECKBOX,
        payload
    }
}
export function logOut(payload) {
    return {
        type: LOGOUT,
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