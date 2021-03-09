export const LOADING_MEAL_MODIFIERS = "LOADING_MEAL_MODIFIERS";
export const GET_MEAL_MODIFIERS = "GET_MEAL_MODIFIERS";

export function loadingMealModifiers(payload) {
    return {
        type: LOADING_MEAL_MODIFIERS,
        payload
    };
};

export function getMealModifiers(payload) {
    return {
        type: GET_MEAL_MODIFIERS,
        payload
    };
};