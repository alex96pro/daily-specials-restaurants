import * as ACTIONS from '../actions/auth.actions';

const initialState = {
    loadingStatus: false,
    restaurantSignUpInfo:{
        restaurantName: '',
        email: '',
        phone: '',
        delivery: false,
        deliveryRange: '',
        deliveryMinimum: '',
        password: '',
        retypePassword: '',
        firstStepSuccess: false
    }
};

export default function authReducer(state = initialState, action) {
    switch(action.type){
        case ACTIONS.LOADING_STATUS_AUTH:
            return{
                ...state,
                loadingStatus: action.payload
            };
        case ACTIONS.SIGN_UP_NEXT_STEP:
            return{
                ...state,
                restaurantSignUpInfo: {...action.payload, firstStepSuccess: true},
                loadingStatus: false,
                signUpMessage:''
            };
        case ACTIONS.CHANGE_DELIVERY_CHECKBOX:
            return{
                ...state,
                restaurantSignUpInfo:{
                    ...state.restaurantSignUpInfo,
                    delivery: action.payload
                }
            }
       
        default:
            return state;
    }
};