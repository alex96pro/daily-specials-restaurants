import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './common/reducers/allReducers';

const loadState = () => {
    const authenticationProperties = JSON.parse(localStorage.getItem("authentication"));
    let authentication;
    if(authenticationProperties !== null){
        authentication = {authentication: authenticationProperties};
    }
    return authentication;
};

const saveState = (authentication) => {
    localStorage.setItem("authentication", JSON.stringify(authentication));
};

export default function configureStore() {
    const state = loadState();
    const store = createStore(rootReducer, state, composeWithDevTools(applyMiddleware(thunkMiddleware)));
    store.subscribe(() => {
        saveState(store.getState().authentication);
    });
    return store;
}