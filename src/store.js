import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './common/reducers/allReducers';

// CURRENTLY ONLY KEEP SIGN UP INFO (authentication reducer) FOR RESTAURANT IN LOCAL STORAGE
const loadState = () => {
    const store = JSON.parse(localStorage.getItem("store-restaurant"));
    let storeObject;
    if(store !== null){
        storeObject = {
            authentication: store.authentication,
        };
    }
    return storeObject;
};

const saveState = (state) => {
    localStorage.setItem("store-restaurant", JSON.stringify(state));
};

export default function configureStore() {
    const state = loadState();
    const store = createStore(rootReducer, state, composeWithDevTools(applyMiddleware(thunkMiddleware)));
    store.subscribe(() => {
        saveState(store.getState());
    });
    return store;
};