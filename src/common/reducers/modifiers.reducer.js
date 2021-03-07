import * as ACTIONS from '../actions/modifiers.actions';
import { LOGOUT } from '../actions/auth.actions';

const initialState = {
    loadingStatus: false,
    loadingModifiersPage:false,
    modifiers: []
};

export default function modifiersReducer(state = initialState, action) {
    let newModifiers = [];
    switch(action.type){
        case ACTIONS.LOADING_STATUS_MODIFIERS:
            return {
                ...state,
                loadingStatus: action.payload
            };
        case ACTIONS.LOADING_STATUS_MODIFIERS_PAGE:
            return {
                ...state,
                loadingModifiersPage: action.payload
            };
        case ACTIONS.GET_MODIFIERS:
            return {
                ...state,
                loadingModifiersPage: false,
                modifiers: action.payload
            };
        case ACTIONS.ADD_NEW_MODIFIER:
            return {
                ...state,
                loadingStatus: false,
                modifiers: [...state.modifiers, action.payload]
            };
        case ACTIONS.EDIT_MODIFIER:
            for(let i = 0; i < state.modifiers.length; i++){
                if(state.modifiers[i].modifierId === action.payload.modifierId){
                    newModifiers.push(action.payload);
                }else{
                    newModifiers.push(state.modifiers[i]);
                }
            }
            return {
                ...state,
                loadingStatus: false,
                modifiers: newModifiers
            };   
        case ACTIONS.DELETE_MODIFIER:
            return {
                ...state,
                loadingStatus: false,
                modifiers: state.modifiers.filter(modifier => modifier.modifierId !== action.payload)
            }
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
};