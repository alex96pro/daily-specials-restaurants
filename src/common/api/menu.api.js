import axios from 'axios';
import { BACKEND_API } from '../../util/consts';
import { loadingStatus, getMenu, addNewMeal, editMeal, deleteMeal, addCategory, deleteCategory } from '../actions/menu.actions';

export function getMenuAPI(message) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.get(`${BACKEND_API}/restaurant/menu/${localStorage.getItem('RESTAURANT_ID')}`);
            if(response.data.categories.length === 0){
                message('Your restaurant has no categories');
            }
            dispatch(getMenu(response.data));
        }catch(err){
            dispatch(loadingStatus(false));
            console.log(err);
        }
    };
};

export function addNewMealAPI(data, closeModal) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            data.restaurantId = localStorage.getItem('RESTAURANT_ID');
            let response = await axios.post(`${BACKEND_API}/restaurant/add-new-meal`,data,
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(addNewMeal(response.data));
            closeModal();
        }catch(err){
            console.log(err);
        }
    };
};
export function editMenuMealAPI(data, successfullEdit) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.post(`${BACKEND_API}/restaurant/edit-menu-meal`, data,
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(editMeal(response.data));
            successfullEdit();
        }catch(err){
            dispatch(loadingStatus(false));
            console.log(err);
        }
    }
};

export function deleteMenuMealAPI(mealId, successfullDelete) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.delete(`${BACKEND_API}/restaurant/delete-menu-meal/${mealId}`,
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(deleteMeal(response.data));
            successfullDelete();
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
            let response = await axios.post(`${BACKEND_API}/restaurant/add-category`,{category:category},
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(addCategory(response.data));
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
            let response = await axios.delete(`${BACKEND_API}/restaurant/delete-category/${category}`,
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(deleteCategory(response.data));
        }catch(err){
            dispatch(loadingStatus(false));
            console.log(err);
        }
    }
};
