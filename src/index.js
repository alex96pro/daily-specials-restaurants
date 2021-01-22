import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import configureStore from './store';

const myStore = configureStore(); 

// const MyStore = createStore(rootReducer, applyMiddleware(thunkMiddleware)); //PRODUCTION

ReactDOM.render(
    <Provider store={myStore}>
        <App />
    </Provider>,
    document.getElementById('root')
);
