import * as ACTIONS from '../actions/menu.actions';

const initialState = {
    loadingStatus: false,
    loadingMenuPage: false,
    meals: [],
    categories: [],
    message: ''
};

export default function menuReducer(state = initialState, action) {
    let newMeals = [];
    switch(action.type){
        case ACTIONS.LOADING_STATUS_MENU:
            return {
                ...state,
                loadingStatus: action.payload
            };
        case ACTIONS.LOADING_MENU_PAGE:
            return {
                ...state,
                loadingMenuPage: action.payload
            };
        case ACTIONS.GET_MENU:
            return {
                ...state,
                loadingMenuPage: false,
                meals: action.payload.meals,
                categories: action.payload.categories
            };
        case ACTIONS.ADD_NEW_MEAL:
            return {
                ...state,
                loadingStatus: false,
                meals: [...state.meals, action.payload]
            };
        case ACTIONS.EDIT_MEAL:
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
            };
        case ACTIONS.DELETE_MEAL:
            return {
                ...state,
                loadingStatus: false,
                meals: state.meals.filter(meal => meal.mealId !== action.payload)
            };
        case ACTIONS.ADD_CATEGORY:
            return {
                ...state,
                loadingStatus: false,
                categories: action.payload
            };
        case ACTIONS.DELETE_CATEGORY:
            if(action.payload.mealIds.length > 0){
                for(let i = 0; i < state.meals.length; i++){
                    if(action.payload.mealIds.includes(state.meals[i].mealId)){
                        newMeals.push({...state.meals[i], category: null});
                    }else{
                        newMeals.push(state.meals[i]);
                    }
                }
            }
            return {
                ...state,
                loadingStatus: false,
                categories: action.payload.categories,
                meals: action.payload.mealIds.length > 0 ? newMeals : state.meals
            };
        default:
            return state;
    }
};