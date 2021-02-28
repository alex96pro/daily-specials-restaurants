import './meals-menu.scss';
import {CURRENCY} from '../../util/consts';
import { useState } from 'react';
import ConfirmDeleteModal from './confirm-delete.modal';
import EditMealModal from './edit-meal.modal';
import AddMealModal from './add-meal.modal';

export default function MealsMenu(props) {

    const [editMealModal, setEditMealModal] = useState({show: false, meal: {}});
    const [confirmDeleteModal, setConfirmDeleteModal] = useState({show: false, meal: {}});
    const [addMealModal, setAddMealModal] = useState(false);

    const filteredMeals = props.selectedCategories.length > 0 ? 
        props.meals.filter(meal => props.selectedCategories.includes(meal.category)) 
        : props.meals;

    const showHiddenDiv = (index) => {
        document.getElementsByClassName('menu-meal-hidden-description')[index].style.opacity = 1;
    };
    const hideHiddenDiv = (index) => {
        document.getElementsByClassName('menu-meal-hidden-description')[index].style.opacity = 0;
    };

    return(
        <div className="meals-menu">
            <div className="meals-menu-add-meal">
                <button onClick={() => setAddMealModal(true)} className={props.categories.length === 0 ? "button-long-disabled":"button-long"}>Add new meal</button>
            </div>
            {filteredMeals.map((meal,index) =>
            <div className="menu-meal" key={meal.mealId}>
                <div className="menu-meal-header">
                    <div className="menu-meal-name">{meal.name}</div>
                    <div className="menu-meal-price">{meal.price}{CURRENCY}</div>
                </div>
                <div className="menu-meal-header-icons">
                    <i className="fas fa-bullhorn fa-2x"></i>
                    <i className="fas fa-edit fa-2x" onClick={() => setEditMealModal({show: true, meal: meal})}></i>
                    <i className="fas fa-trash fa-2x" onClick={() => setConfirmDeleteModal({show: true, meal: meal})}></i>
                </div>
                <div className="menu-meal-photo-container">
                    <img src={meal.photo} className="menu-meal-photo" alt="Loading..."/>
                    <div className="menu-meal-hidden-description" onClick={() => setEditMealModal({show: true, meal: meal})}
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
            <EditMealModal meal={editMealModal.meal} closeModal={() => setEditMealModal(false)}/>}
            {addMealModal && <AddMealModal closeModal={() => setAddMealModal(false)}/>}
        </div>
    )
};