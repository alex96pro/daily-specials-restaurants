import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import { LOGOUT } from '../actions/auth.actions';

const allReducers = combineReducers(
    {
        authentication: authReducer
    }
);

const rootReducer = (state, action) => {
    if (action.type === LOGOUT) {
        state = undefined;
        localStorage.clear();
    }
    return allReducers(state, action);
};

export default rootReducer;