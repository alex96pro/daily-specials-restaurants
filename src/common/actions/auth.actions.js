
export const LOADING_STATUS_RESTAURANT_AUTH = "LOADING_STATUS_RESTAURANT_AUTH";
export const LOGIN_RESTAURANT_SUCCESS = "LOGIN_RESTAURANT_SUCCESS";
export const LOG_IN_FAILED = "LOG_IN_FAILED";
export const FORGOTTEN_PASSWORD_SUCCESS = "FORGOTTEN_PASSWORD_SUCCESS";
export const FORGOTTEN_PASSWORD_FAILED = "FORGOTTEN_PASSWORD_FAILED";
export const NEW_PASSWORD_SUCCESS = "NEW_PASSWORD_SUCCESS";
export const SIGN_UP_NEXT_STEP = "SIGN_UP_NEXT_STEP";
export const LOGOUT = "LOGOUT";

export function loadingStatus(payload) {
    return {
        type: LOADING_STATUS_RESTAURANT_AUTH,
        payload
    };
};
export function logInSuccess(payload) {
    return {
        type: LOGIN_RESTAURANT_SUCCESS,
        payload
    };
};
export function logInFailed(payload) {
    return {
        type: LOG_IN_FAILED,
        payload
    };
};
export function signUpNextStep(payload) {
    return {
        type: SIGN_UP_NEXT_STEP,
        payload
    };
};
export function forgottenPasswordSuccess(payload) {
    return {
        type: FORGOTTEN_PASSWORD_SUCCESS,
        payload
    };
};
export function forgottenPasswordFailed(payload) {
    return {
        type: FORGOTTEN_PASSWORD_FAILED,
        payload
    };
};
export function newPasswordSuccess(payload) {
    return {
        type: NEW_PASSWORD_SUCCESS,
        payload
    };
};
export function logOut(payload) {
    return {
        type: LOGOUT,
        payload
    };
};