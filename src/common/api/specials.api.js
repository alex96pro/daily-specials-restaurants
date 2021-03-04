import { get, post, deleteRequest } from './api';
import { successToast } from '../../util/toasts/toasts';
import { getClientDateAndTime, compressPhoto } from '../../util/functions';
import { loadingStatus, loadingSpecialsPage, getSpecials, addNewSpecial, deleteSpecial, deleteSpecialFromToday, editSpecial } from '../actions/specials.actions';

export function getSpecialsAPI() {
    return async (dispatch) => {
        dispatch(loadingSpecialsPage(true));
        let clientDateAndTime = getClientDateAndTime(false, true);
        let response = await get(`/restaurant-specials/specials/${localStorage.getItem('RESTAURANT_ID')}?dateAndTime=${clientDateAndTime}`, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(getSpecials(response.data));
        }else{
            alert(response);
        }
    };
};

export function addNewSpecialAPI(data, closeModal) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        data.photo = await compressPhoto(data.photo);
        if(!data.photo){
            dispatch(loadingStatus(false));
            console.log("COMPRESSION FAILED");
            return;
        }
        let response = await post(`/restaurant-specials/add-new-special/${localStorage.getItem('RESTAURANT_ID')}`, data, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(addNewSpecial(response.data));
            closeModal();
            successToast('Successfully added!');
        }else{
            dispatch(loadingStatus(true));
            alert(response);
        }
    };
};

export function editSpecialAPI(data, closeModal) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        if(data.newPhoto){
            data.newPhoto = await compressPhoto(data.newPhoto);
            if(!data.newPhoto){
                console.log("COMPRESSION FAILED");
                dispatch(loadingStatus(false));
                return;
            }
        }
        let response = await post(`/restaurant-specials/edit-special`, data, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(editSpecial(response.data));
            closeModal();
            successToast('Successfully edited!');
        }else{
            dispatch(loadingStatus(false))
            alert(response);
        }
    };
};

export function deleteSpecialFromTodayAPI(data, closeModal) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        let response = await deleteRequest(`/restaurant-specials/delete-special-from-today/${data}`, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(deleteSpecialFromToday(response.data));
            closeModal();
            successToast('Successfully deleted!');
        }else{
            dispatch(loadingStatus(false));
            alert(response);
        }
    };
};

export function deleteSpecialAPI(data, closeModal) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        let response = await deleteRequest(`/restaurant-specials/delete-special/${data}`, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(deleteSpecial(response.data));
            closeModal();
            successToast('Successfully deleted!');
        }else{
            dispatch(loadingStatus(false));
            alert(response);
        }
    };
};