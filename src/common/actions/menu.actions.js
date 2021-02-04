export const LOADING_STATUS_MENU = "LOADING_STATUS_MENU";
export const GET_MENU = "GET_MENU";
export const NO_MEALS_IN_MENU = "NO_MEALS_IN_MENU";
export const EDIT_MEAL = "EDIT_MEAL";
export const DELETE_MEAL = "DELETE_MEAL";

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
export function noMealsInMenu(payload) {
    return {
        type: NO_MEALS_IN_MENU,
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