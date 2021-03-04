import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import menuReducer from './menu.reducer';
import specialsReducer from './specials.reducer';
import modifiersReducer from './modifiers.reducer';
import ordersReducer from './orders.reducer';

const allReducers = combineReducers(
    {
        authentication: authReducer,
        menu: menuReducer,
        specials: specialsReducer,
        modifiers: modifiersReducer,
        orders: ordersReducer
    }
);

export default allReducers;