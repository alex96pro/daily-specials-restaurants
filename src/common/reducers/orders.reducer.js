import * as ACTIONS from '../actions/orders.actions';
import { LOGOUT } from '../actions/auth.actions';

const initialState = {
    orders:[],
    newOrdersCount:0
};

export default function ordersReducer(state = initialState, action) {
    let newOrders = [];
    switch(action.type){
        case ACTIONS.ADD_NEW_ORDER:
            return {
                ...state,
                orders: [action.payload, ...state.orders],
                newOrdersCount: state.newOrdersCount + 1
            };
        case ACTIONS.ACCEPT_ORDER:
            for(let i = 0; i < state.orders.length; i++){
                if(state.orders[i].userId === action.payload.userId && state.orders[i].time === action.payload.time){
                    newOrders.push({...state.orders[i], status: 'accepted'});
                }else{
                    newOrders.push(state.orders[i]);
                }
            }
            return {
                ...state,
                orders: newOrders,
                newOrdersCount: state.newOrdersCount - 1
            };
        case ACTIONS.REJECT_ORDER:
            return {
                ...state,
                orders: state.orders.filter(order => order.userId !== action.payload.userId || order.time !== action.payload.time),
                newOrdersCount: state.newOrdersCount - 1
            };
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
};