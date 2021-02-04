import axios from 'axios';
import { BACKEND_API } from '../../util/consts';
import { loadingStatus, getMenu, noMealsInMenu, editMeal, deleteMeal } from '../actions/menu.actions';

export function getMenuAPI() {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.get(`${BACKEND_API}/restaurant/menu/${localStorage.getItem('RESTAURANT_ID')}`);
            if(response.data && response.data.length === 0) {
                dispatch(noMealsInMenu('Your restaurant has no meals in menu'));
            }else{
                dispatch(getMenu(response.data));
            }
        }catch(err){
            dispatch(loadingStatus(false));
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
