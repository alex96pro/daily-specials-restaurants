import { get, post, deleteRequest } from './api';
import { successToast } from '../../util/toasts/toasts';
import { compressPhoto } from '../../util/functions';
import { loadingStatus, loadingMenuPage, getMenu, addNewMeal, editMeal, deleteMeal, addCategory, deleteCategory } from '../actions/menu.actions';
import { addNewSpecial } from '../actions/specials.actions';

export function getMenuAPI(message) {
    return async (dispatch) => {
        dispatch(loadingMenuPage(true));
        let response = await get(`/restaurant-menu/menu/${localStorage.getItem('RESTAURANT_ID')}`, false, {401:'Unauthorized'});
        if(response.status === 200){
            if(response.data.categories.length === 0){
                message('Your restaurant has no categories');
            }
            dispatch(getMenu(response.data));
        }else{
            dispatch(loadingMenuPage(false));
            alert(response);
        }
    };
};

export function addNewMealAPI(data, closeModal) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        data.photo = await compressPhoto(data.photo);
        if(!data.photo){
            dispatch(loadingStatus(false));
            console.log("COMPRESSION FAILED");
            return;
        }
        data.restaurantId = localStorage.getItem('RESTAURANT_ID');
        let response = await post(`/restaurant-menu/add-new-meal`, data, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(addNewMeal(response.data));
            closeModal();
            successToast('Successfully added!');
        }else{
            dispatch(loadingStatus(false));
            alert(response);
        }
    };
};

export function editMenuMealAPI(data, closeModal) {
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
        let response = await post(`/restaurant-menu/edit-menu-meal`, data, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(editMeal(response.data));
            closeModal();
            successToast('Successfully edited!');
        }else{
            dispatch(loadingStatus(false));
            alert(response)
        }
    };
};

export function deleteMenuMealAPI(mealId, closeModal) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        let response = await deleteRequest(`/restaurant-menu/delete-menu-meal/${mealId}`, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(deleteMeal(response.data));
            closeModal();
            successToast('Successfully deleted!');
        }else{
            dispatch(loadingStatus(false))
            alert(response);
        }
    };
};

export function convertMealToSpecialAPI(data, message, closeModal) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        data.restaurantId = localStorage.getItem('RESTAURANT_ID');
        if(data.newPhoto){
            data.newPhoto = await compressPhoto(data.newPhoto);
            if(!data.newPhoto){
                console.log("COMPRESSION FAILED");
                dispatch(loadingStatus(false));
                return;
            }
        }
        let response = await post(`/restaurant-menu/convert-meal-to-special`, data, true, {401:'Unauthorized', 403:'Your daily limit for this date is full'}); 
        if(response.status === 200){
            dispatch(addNewSpecial(response.data));
            dispatch(loadingStatus(false)); // because action addNewSpecial sets to false loadingStatus for specials reducer
            successToast('Successfully posted!');
            closeModal();
        }else{
            dispatch(loadingStatus(false));
            message(response);
        }
    };
};

export function addCategoryAPI(category) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        let response = await post(`/restaurant-menu/add-category`, {category:category}, true, {401:'Unauthorized'}); 
        if(response.status === 200){
            dispatch(addCategory(response.data));
            successToast('Successfully added!');
        }else{
            dispatch(loadingStatus(false));
            alert(response);
        }
    };
};

export function deleteCategoryAPI(category) {
    return async (dispatch) => {
        dispatch(loadingStatus(true));
        let response = await deleteRequest(`/restaurant-menu/delete-category/${category}`, true, {401:'Unauthorized'});
        if(response.status === 200){
            dispatch(deleteCategory(response.data));
            successToast('Successfully deleted!');
        }else{
            dispatch(loadingStatus(false));
            alert(response);
        }
    };
};
