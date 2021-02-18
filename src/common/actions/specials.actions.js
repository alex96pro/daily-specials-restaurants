export const LOADING_STATUS_SPECIALS = "LOADING_STATUS_SPECIALS";
export const LOADING_SPECIALS_PAGE = "LOADING_SPECIALS_PAGE";
export const GET_SPECIALS = "GET_SPECIALS";
export const ADD_NEW_SPECIAL = "ADD_NEW_SPECIAL";
export const EDIT_SPECIAL = "EDIT_SPECIAL";
export const DELETE_SPECIAL = "DELETE_SPECIAL";

export function loadingStatus(payload) {
    return {
        type: LOADING_STATUS_SPECIALS,
        payload
    };
};
export function loadingSpecialsPage(payload) {
    return {
        type: LOADING_SPECIALS_PAGE,
        payload
    };
};
export function getSpecials(payload) {
    return {
        type: GET_SPECIALS,
        payload
    };
};
export function addNewSpecial(payload) {
    return {
        type: ADD_NEW_SPECIAL,
        payload
    };
};
export function editSpecial(payload) {
    return {
        type: EDIT_SPECIAL,
        payload
    };
};
export function deleteSpecial(payload) {
    return {
        type: DELETE_SPECIAL,
        payload
    };
};