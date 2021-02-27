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
        firstStepSuccess: false,
        location:'',
        lat:'',
        lon:''
    },
    restaurant:{}
};

export default function authReducer(state = initialState, action) {
    switch(action.type){
        case ACTIONS.LOADING_STATUS_AUTH:
            return{
                ...state,
                loadingStatus: action.payload
            };
        case ACTIONS.SIGN_UP_SECOND_STEP:
            return{
                ...state,
                restaurantSignUpInfo: {...action.payload, 
                    firstStepSuccess: true, 
                    location:state.restaurantSignUpInfo.location, 
                    lat:state.restaurantSignUpInfo.lat, 
                    lon:state.restaurantSignUpInfo.lon},
                loadingStatus: false,
                signUpMessage:''
            };
        case ACTIONS.SIGN_UP_RETURN_FROM_SECOND_STEP:
            return{
                ...state,
                restaurantSignUpInfo: {
                    ...state.restaurantSignUpInfo,
                    location: action.payload.location,
                    lat: action.payload.position.lat,
                    lon: action.payload.position.lon
                }
            };
        case ACTIONS.SIGN_UP_THIRD_STEP:
            return{
                ...state,
                restaurantSignUpInfo: {
                    ...state.restaurantSignUpInfo, 
                    location: action.payload.location,
                    lat: action.payload.position.lat,
                    lon: action.payload.position.lon
                }
            };
        case ACTIONS.SIGN_UP_COMPLETE:
            return initialState;

        case ACTIONS.CHANGE_DELIVERY_CHECKBOX:
            return{
                ...state,
                restaurantSignUpInfo:{
                    ...state.restaurantSignUpInfo,
                    delivery: action.payload
                }
            };
        case ACTIONS.GET_PROFILE_DATA:
            return{
                ...state,
                loadingStatus: false,
                restaurant: action.payload
            };
        case ACTIONS.UPDATE_PROFILE:
            return{
                ...state,
                loadingStatus: false,
                restaurant: {
                    ...state.restaurant,
                    name: action.payload.name,
                    location: action.payload.location,
                    lat: action.payload.lat,
                    lon: action.payload.lon,
                    delivery: action.payload.delivery,
                    deliveryRange: action.payload.deliveryRange,
                    deliveryMinimum: action.payload.deliveryMinimum,
                    phone: action.payload.phone,
                    logo: action.payload.logo
                }
            };
        case ACTIONS.CHANGE_WORKING_HOURS:
            return{
                ...state,
                loadingStatus: false,
                restaurant: {
                    ...state.restaurant,
                    workingHours: action.payload
                }
            };
        case ACTIONS.DISABLE_DELIVERY:
            return{
                ...state,
                loadingStatus: false,
                restaurant: {
                    ...state.restaurant,
                    delivery: action.payload.delivery,
                    deliveryRange: action.payload.deliveryRange,
                    deliveryMinimum: action.payload.deliveryMinimum
                }
            };
        case ACTIONS.LOGOUT:
            return initialState;
        default:
            return state;
    }
};