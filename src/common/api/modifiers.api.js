import { addNewModifier, getModifiers, loadingModifiersPage, loadingStatus, deleteModifier, editModifier } from '../actions/modifiers.actions';
import { get, post, deleteRequest } from './api';
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

export function addNewModifierAPI(modifier, closeModal) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        let data = {};
        data.modifier = modifier;
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

export function editModifierAPI(data, closeModal) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        let response = await post(`/restaurant-modifiers/edit-modifier`, data, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(editModifier(response.data));
            closeModal();
            successToast('Successfully edited!');
        }else{
            dispatch(loadingStatus(false));
            alert(response);
        }
    };
};

export function deleteModifierAPI(modifierId, closeModal) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        let response = await deleteRequest(`/restaurant-modifiers/delete-modifier/${modifierId}`, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(deleteModifier(response.data));
            closeModal();
            successToast('Successfully deleted!');
        }else{
            dispatch(loadingStatus(false));
            alert(response);
        }
    };
};
