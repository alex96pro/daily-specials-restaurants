export const LOADING_STATUS_MENU = "LOADING_STATUS_MENU";
export const GET_MENU = "GET_MENU";
export const ADD_NEW_MEAL = "ADD_NEW_MEAL";
export const EDIT_MEAL = "EDIT_MEAL";
export const DELETE_MEAL = "DELETE_MEAL";
export const ADD_CATEGORY = "ADD_CATEGORY";
export const DELETE_CATEGORY = "DELETE_CATEGORY";

export function loadingStatus(payload) {
    return {
        type: LOADING_STATUS_MENU,
        payload
    };
};
export function getMenu(payload) {
    return {
        type: GET_MENU,
        payload
    };
};

export function addNewMeal(payload) {
    return {
        type: ADD_NEW_MEAL,
        payload
    };
};

export function editMeal(payload) {
    return {
        type: EDIT_MEAL,
        payload
    };
};
export function deleteMeal(payload) {
    return {
        type: DELETE_MEAL,
        payload
    };
};
export function addCategory(payload) {
    return {
        type: ADD_CATEGORY,
        payload
    };
};
export function deleteCategory(payload) {
    return {
        type: DELETE_CATEGORY,
        payload
    };
};
