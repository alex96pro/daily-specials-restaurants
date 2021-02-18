import axios from 'axios';
import { BACKEND_API } from '../../util/consts';
import { successToast } from '../../util/toasts/toasts';
import { compressPhoto } from '../../util/functions';
import { loadingStatus, loadingMenuPage, getMenu, addNewMeal, editMeal, deleteMeal, addCategory, deleteCategory } from '../actions/menu.actions';

export function getMenuAPI(message) {
    return async (dispatch) => {
        try{
            dispatch(loadingMenuPage(true));
            let response = await axios.get(`${BACKEND_API}/restaurant-menu/menu/${localStorage.getItem('RESTAURANT_ID')}`);
            if(response.data.categories.length === 0){
                message('Your restaurant has no categories');
            }
            dispatch(getMenu(response.data));
        }catch(err){
            dispatch(loadingMenuPage(false));
            console.log(err);
        }
    };
};
export function addNewMealAPI(data, closeModal) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            // console.log(performance.now());
            data.photo = await compressPhoto(data.photo);
            // console.log(performance.now());
            if(data.photo){ //successfully compressed
                data.restaurantId = localStorage.getItem('RESTAURANT_ID');
                let response = await axios.post(`${BACKEND_API}/restaurant-menu/add-new-meal`,data,
                {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
                dispatch(addNewMeal(response.data));
                closeModal();
                successToast('Successfully added!');
            }else{
                dispatch(loadingStatus(false));
                console.log("COMPRESSION FAILED");
            }
        }catch(err){
            console.log(err);
        }
    };
};
export function editMenuMealAPI(data, closeModal) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            if(data.newPhoto){
                data.newPhoto = await compressPhoto(data.newPhoto);
                if(!data.newPhoto){
                    console.log("COMPRESSION FAILED");
                    dispatch(loadingStatus(false));
                    return;
                }
            }
            let response = await axios.post(`${BACKEND_API}/restaurant-menu/edit-menu-meal`, data,
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(editMeal(response.data));
            closeModal();
            successToast('Successfully edited!');
        }catch(err){
            dispatch(loadingStatus(false));
            console.log(err);
        }
    }
};
export function deleteMenuMealAPI(mealId, closeModal) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.delete(`${BACKEND_API}/restaurant-menu/delete-menu-meal/${mealId}`,
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(deleteMeal(response.data));
            closeModal();
            successToast('Successfully deleted!');
        }catch(err){
            dispatch(loadingStatus(false));
            console.log(err);
        }
    }
};
export function addCategoryAPI(category) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.post(`${BACKEND_API}/restaurant-menu/add-category`,{category:category},
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(addCategory(response.data));
            successToast('Successfully added!');
        }catch(err){
            dispatch(loadingStatus(false));
            console.log(err);
        }
    }
};
export function deleteCategoryAPI(category) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.delete(`${BACKEND_API}/restaurant-menu/delete-category/${category}`,
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(deleteCategory(response.data));
            successToast('Successfully deleted!');
        }catch(err){
            dispatch(loadingStatus(false));
            console.log(err);
        }
    }
};
