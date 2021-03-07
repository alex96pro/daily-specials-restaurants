export const LOADING_STATUS_MODIFIERS = "LOADING_STATUS_MODIFIERS";
export const LOADING_STATUS_MODIFIERS_PAGE = "LOADING_STATUS_MODIFIERS_PAGE";
export const GET_MODIFIERS = "GET_MODIFIERS";
export const ADD_NEW_MODIFIER = "ADD_NEW_MODIFIER";
export const DELETE_MODIFIER = "DELETE_MODIFIER";
export const EDIT_MODIFIER = "EDIT_MODIFIER";

export function loadingStatus(payload) {
    return {
        type: LOADING_STATUS_MODIFIERS,
        payload
    };
};
export function loadingModifiersPage(payload) {
    return {
        type: LOADING_STATUS_MODIFIERS_PAGE,
        payload
    };
};
export function getModifiers(payload) {
    return {
        type: GET_MODIFIERS,
        payload
    };
};
export function addNewModifier(payload) {
    return {
        type: ADD_NEW_MODIFIER,
        payload
    };
};
export function editModifier(payload) {
    return {
        type: EDIT_MODIFIER,
        payload
    };
};
export function deleteModifier(payload) {
    return {
        type: DELETE_MODIFIER,
        payload
    };
};
