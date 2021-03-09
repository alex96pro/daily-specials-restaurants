import * as ACTIONS from '../actions/meal.actions';
import { LOGOUT } from '../actions/auth.actions';

const initialState = {
    loadingStatus: false,
    mealModifiers: []
};

export default function mealReducer(state = initialState, action) {
    switch(action.type){
        case ACTIONS.LOADING_MEAL_MODIFIERS:
            return {
                ...state,
                loadingStatus: action.payload
            };
        case ACTIONS.GET_MEAL_MODIFIERS:
            return {
                ...state,
                loadingStatus: false,
                mealModifiers: action.payload
            };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
};