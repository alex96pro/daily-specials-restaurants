import { loadingMealModifiers, getMealModifiers } from '../actions/meal.actions';
import { get } from './api';

export function getMealModifiersAPI(mealId, showModal) {
    return async (dispatch) => {
        dispatch(loadingMealModifiers(true));
        let response = await get(`/restaurant/menu/meal/modifiers/${mealId}`, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(getMealModifiers(response.data));
            showModal();
        }else{
            dispatch(loadingMealModifiers(false));
            alert(response);
        }
    };
};

export function getSpecialModifiersAPI(specialId, showModal) {
    return async (dispatch) => {
        dispatch(loadingMealModifiers(true));
        let response = await get(`/restaurant/specials/modifiers/${specialId}`, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(getMealModifiers(response.data));
            showModal();
        }else{
            dispatch(loadingMealModifiers(false));
            alert(response);
        }
    };
};
