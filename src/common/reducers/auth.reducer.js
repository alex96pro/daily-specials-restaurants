import * as ACTIONS from '../actions/auth.actions';

const initialState = {
    loadingStatus: false,
    loginMessage:'',
    forgottenPasswordMessage: '',
    forgottenPasswordSuccess: false,
    newPasswordRestaurantMessage: '',
    restaurantSignUpInfo:{
        restaurantName: '',
        email: '',
        phone: '',
        delivery: false,
        deliveryRange: '',
        deliveryMinimum: '',
        password: '',
        retypePassword: ''

    }
};

export default function restaurantAuthReducer(state = initialState, action) {
    switch(action.type){
        case ACTIONS.LOADING_STATUS_RESTAURANT_AUTH:
            return{
                ...state,
                loadingStatus: action.payload
            };
        case ACTIONS.LOGIN_RESTAURANT_SUCCESS:
            return{
                ...state,
                loadingStatus: false,
                loginMessage:'',
            };
        case ACTIONS.LOG_IN_FAILED:
            return{
                ...state,
                loadingStatus: false,
                loginMessage: action.payload
            };
        case ACTIONS.SIGN_UP_NEXT_STEP:
            return{
                ...state,
                restaurantSignUpInfo: action.payload
            }
        case ACTIONS.FORGOTTEN_PASSWORD_SUCCESS:
            return{
                ...state,
                loadingStatus: false,
                forgottenPasswordMessage: action.payload,
                forgottenPasswordSuccess: true
            };
        case ACTIONS.FORGOTTEN_PASSWORD_FAILED:
            return{
                ...state,
                loadingStatus: false,
                forgottenPasswordMessage: action.payload,
                forgottenPasswordSuccess: false
            };
        case ACTIONS.NEW_PASSWORD_SUCCESS:
            return{
                ...state,
                loadingStatus: false,
                newPasswordRestaurantMessage: action.payload
            }
        default:
            return state;
    }
};