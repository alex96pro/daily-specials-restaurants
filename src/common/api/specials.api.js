import axios from 'axios';
import { BACKEND_API } from '../../util/consts';
import { successToast } from '../../util/toasts/toasts';
import { getClientDate, compressPhoto } from '../../util/functions';
import { loadingStatus, loadingSpecialsPage, getSpecials, addNewSpecial, deleteSpecial, editSpecial } from '../actions/specials.actions';

export function getSpecialsAPI() {
    return async (dispatch) => {
        try{
            dispatch(loadingSpecialsPage(true));
            let clientDate = getClientDate();
            let response = await axios.get(`${BACKEND_API}/restaurant-specials/specials/${localStorage.getItem('RESTAURANT_ID')}?date=${clientDate}`);
            dispatch(getSpecials(response.data));
        }catch(err){
            dispatch(loadingSpecialsPage(false));
            console.log(err);
        }
    };
};
export function addNewSpecialAPI(data, closeModal) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            data.photo = await compressPhoto(data.photo);
            if(data.photo){ //successfully compressed
                data.date = getClientDate(); //set date to client date
                let response = await axios.post(`${BACKEND_API}/restaurant-specials/add-new-special/${localStorage.getItem('RESTAURANT_ID')}`,data,
                {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
                dispatch(addNewSpecial(response.data));
                closeModal();
                successToast('Successfully added!');
            }else{
                dispatch(loadingStatus(false));
                console.log("COMPRESSION FAILED");
            }
        }catch(err){
            dispatch(loadingStatus(false));
            console.log(err);
        }
    };
};
export function editSpecialAPI(data, closeModal) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.post(`${BACKEND_API}/restaurant-specials/edit-special`,data,
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(editSpecial(response.data));
            closeModal();
            successToast('Successfully edited!');
        }catch(err){
            dispatch(loadingStatus(false));
            console.log(err);
        }
    };
};
export function deleteSpecialAPI(data, closeModal) {
    return async (dispatch) => {
        try{
            dispatch(loadingStatus(true));
            let response = await axios.delete(`${BACKEND_API}/restaurant-specials/delete-special/${data}`,
            {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            dispatch(deleteSpecial(response.data));
            closeModal();
            successToast('Successfully deleted!');
        }catch(err){
            dispatch(loadingStatus(false));
            console.log(err);
        }
    }
}

