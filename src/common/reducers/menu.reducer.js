import * as ACTIONS from '../actions/menu.actions';

const initialState = {
    loadingStatus: false,
    meals: [],
    categories: [],
    message: ''
};

export default function menuReducer(state = initialState, action) {
    switch(action.type){
        case ACTIONS.LOADING_STATUS_MENU:
            return {
                ...state,
                loadingStatus: action.payload
            };
        case ACTIONS.GET_MENU:
            return {
                ...state,
                loadingStatus: false,
                meals: action.payload.meals,
                categories: action.payload.categories
            };
        case ACTIONS.NO_MEALS_IN_MENU:
            return {
                ...state,
                loadingStatus: false,
                message: action.payload
            };
        case ACTIONS.EDIT_MEAL:
            let newMeals = [];
            for(let i = 0; i < state.meals.length; i++){
                if(state.meals[i].mealId === action.payload.mealId){
                    newMeals.push(action.payload);
                }else{
                    newMeals.push(state.meals[i]);
                }
            }
            return {
                ...state,
                loadingStatus: false,
                meals: newMeals
            }
        case ACTIONS.DELETE_MEAL:
            return {
                ...state,
                loadingStatus: false,
                meals: state.meals.filter(meal => meal.mealId !== action.payload)
            };
        default:
            return state;
    }
};