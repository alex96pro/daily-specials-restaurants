import './meals-menu.scss';
import {CURRENCY} from '../../util/consts';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getModifiersAPI } from '../../common/api/modifiers.api';
import { getMealModifiersAPI } from '../../common/api/meal.api';
import { Tooltip } from 'antd';
import ConfirmDeleteModal from './confirm-delete.modal';
import EditMealModal from './edit-meal.modal';
import AddMealModal from './add-meal.modal';
import Loader from '../loader';

export default function MealsMenu(props) {

    const [editMealModal, setEditMealModal] = useState({show: false, meal: {}, convertMealToSpecial: false});
    const [confirmDeleteModal, setConfirmDeleteModal] = useState({show: false, meal: {}});
    const [addMealModal, setAddMealModal] = useState(false);
    const loadingAllModifiers = useSelector(state => state.modifiers.loadingModifiersPage);
    const loadingMealModifiers = useSelector(state => state.meal.loadingStatus);
    const dispatch = useDispatch();

    const filteredMeals = props.selectedCategories.length > 0 ? 
        props.meals.filter(meal => props.selectedCategories.includes(meal.category)) 
        : props.meals;

    const showHiddenDiv = (index) => {
        document.getElementsByClassName('menu-meal-hidden-description')[index].style.opacity = 1;
    };
    
    const hideHiddenDiv = (index) => {
        document.getElementsByClassName('menu-meal-hidden-description')[index].style.opacity = 0;
    };

    const showEditModal = (meal, convertMealToSpecial) => {
        // API has to be in this order so that react-select can work (doesn't update its default values like it should from react redux store)
        dispatch(getModifiersAPI());
        dispatch(getMealModifiersAPI(meal.mealId, () => setEditMealModal({show: true, meal: meal, convertMealToSpecial: convertMealToSpecial})));
    };

    const showAddMealModal = () => {
        dispatch(getModifiersAPI(() => setAddMealModal(true)));
    };

    return(
        <div className="meals-menu">
            {(loadingAllModifiers || loadingMealModifiers) && <Loader className="loader-center"/>}
            <div className="meals-menu-header">Your Menu</div>
            <div className="meals-menu-add-meal">
                <button onClick={showAddMealModal} className={props.categories.length === 0 ? "button-long-disabled m-0":"button-long m-0"}>Add new meal</button>
            </div>
            {filteredMeals.map((meal,index) =>
            <div className="menu-meal" key={meal.mealId}>
                <div className="menu-meal-header">
                    <div className="menu-meal-name">{meal.name}</div>
                    <div className="menu-meal-price">{meal.price}{CURRENCY}</div>
                </div>
                <div className="menu-meal-header-icons">
                    <Tooltip title="See from user's perspective">
                        <i className="fas fa-eye fa-2x"></i>
                    </Tooltip>
                    <Tooltip title="Post as special">
                        <i className="fas fa-bullhorn fa-2x" onClick={() => showEditModal(meal, true)}></i>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <i className="fas fa-edit fa-2x" onClick={() => showEditModal(meal, false)}></i>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <i className="fas fa-trash fa-2x" onClick={() => setConfirmDeleteModal({show: true, meal: meal})}></i>
                    </Tooltip>
                </div>
                <div className="menu-meal-photo-container">
                    <img src={meal.photo} className="menu-meal-photo" alt="Loading..."/>
                    <div className="menu-meal-hidden-description" onClick={() => showEditModal(meal, false)}
                        onMouseEnter={() => showHiddenDiv(index)}
                        onMouseLeave={() => hideHiddenDiv(index)}>
                        <div className="menu-meal-description">{meal.description}</div>
                    </div>
                </div>
                
            </div>
            )}
            {confirmDeleteModal.show && 
            <ConfirmDeleteModal meal={confirmDeleteModal.meal} closeModal={() => setConfirmDeleteModal(false)}/>}
            {editMealModal.show && 
            <EditMealModal meal={editMealModal.meal} convertMealToSpecial={editMealModal.convertMealToSpecial} closeModal={() => setEditMealModal({...editMealModal, show: false, meal:{}})}/>}
            {addMealModal && <AddMealModal closeModal={() => setAddMealModal(false)}/>}
        </div>
    )
};