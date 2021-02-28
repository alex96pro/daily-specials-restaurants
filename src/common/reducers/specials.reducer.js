import * as ACTIONS from '../actions/specials.actions';
import { LOGOUT } from '../actions/auth.actions';

const initialState = {
    loadingStatus: false,
    loadingSpecialsPage:false,
    specials: []
};

export default function specialsReducer(state = initialState, action) {
    let newSpecials = [];
    switch(action.type){
        case ACTIONS.LOADING_STATUS_SPECIALS:
            return {
                ...state,
                loadingStatus: action.payload
            };
        case ACTIONS.LOADING_SPECIALS_PAGE:
            return {
                ...state,
                loadingSpecialsPage: action.payload
            };
        case ACTIONS.GET_SPECIALS:
            return {
                ...state,
                loadingSpecialsPage: false,
                specials: action.payload
            };
        case ACTIONS.ADD_NEW_SPECIAL:
            return {
                ...state,
                loadingStatus: false,
                specials: [...state.specials, action.payload],
                usedSpecials: state.usedSpecials + 1
            };
        case ACTIONS.EDIT_SPECIAL:
            for(let i = 0; i < state.specials.length; i++){
                if(state.specials[i].specialId === action.payload.specialId){
                    newSpecials.push(action.payload);
                }else{
                    newSpecials.push(state.specials[i]);
                }
            }
            return {
                ...state,
                loadingStatus: false,
                specials: newSpecials
            };
        case ACTIONS.DELETE_SPECIAL:
            return {
                ...state,
                loadingStatus: false,
                specials: state.specials.filter(special => special.specialId !== action.payload)
            };
        case ACTIONS.DELETE_SPECIAL_FROM_TODAY:
            for(let i = 0; i < state.specials.length; i++){
                if(+state.specials[i].specialId === +action.payload){
                    newSpecials.push({...state.specials[i], deleted: true});
                }else{
                    newSpecials.push(state.specials[i]);
                }
            }
            return {
                ...state,
                loadingStatus: false,
                specials: newSpecials
            };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
};