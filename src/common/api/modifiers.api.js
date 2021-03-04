import { addNewModifier, getModifiers, loadingModifiersPage, loadingStatus } from '../actions/modifiers.actions';
import { get, post } from './api';
import { successToast } from '../../util/toasts/toasts';

export function getModifiersAPI() {
    return async (dispatch) => {
        dispatch(loadingModifiersPage(true));
        let response = await get(`/restaurant-modifiers/modifiers/${localStorage.getItem('RESTAURANT_ID')}`, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(getModifiers(response.data));
        }else{
            dispatch(loadingModifiersPage(false));
            alert(response);
        }
    };
};

export function addNewModifierAPI(data, closeModal) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        data.restaurantId = localStorage.getItem('RESTAURANT_ID');
        let response = await post(`/restaurant-modifiers/add-new-modifier`, data, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(addNewModifier(response.data));
            closeModal();
            successToast('Successfully added!');
        }else{
            dispatch(loadingStatus(false));
            alert(response);
        }
    };
};
