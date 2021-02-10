import './meals-menu.component.scss';
import {CURRENCY} from '../../util/consts';
import { useState } from 'react';
import Label from '../../components/common/label';
import ConfirmDeleteModal from './confirm-delete.modal';
import EditMealModal from './edit-meal.modal';
import AddMealModal from './add-meal.modal';

export default function MealsMenu(props) {

    const [editMealModal, setEditMealModal] = useState({show: false, meal:{}});
    const [confirmDeleteModal, setConfirmDeleteModal] = useState({show: false, meal: {}});
    const [addMealModal, setAddMealModal] = useState(false);

    const filteredMeals = props.selectedCategories.length > 0 ? 
        props.meals.filter(meal => props.selectedCategories.includes(meal.category)) 
        : props.meals;

    return(
        <div className="meals-menu">
            <div className="meals-menu-header">Menu</div>
            <button onClick={() => setAddMealModal(true)} className={props.categories.length === 0 ? "button-long-disabled":"button-long"}>Add new meal</button>
            {filteredMeals.map(meal =>
                <div className="meals-menu-meal" key={meal.mealId}>
                    <div className="meals-menu-container-1">
                        <Label name='Name: ' value={meal.name}/>
                        <Label name='Description: ' value={meal.description}/>
                        <Label name='Category: ' value={meal.category ? meal.category : 'No category'}/>
                        <Label name='Price: ' value={`${meal.price}${CURRENCY}`}/>
                        <div className="tags">
                        <label className="label-accent-color-2">Tags:</label>
                        {meal.tags.length > 0 ?
                            meal.tags.map((tag, index) => 
                                <div className="tag" key={index}>#{tag}</div>
                            )
                        :<label className="label-accent-color">No tags</label>}
                        </div>
                        <div className="meals-menu-buttons">
                            <button type="button" onClick={() => setEditMealModal({show: true, meal: meal})} 
                            className={props.categories.length === 0 ? "button-normal-disabled" : "button-normal"}>Edit</button>
                            <button type="button" onClick={() => setConfirmDeleteModal({show: true, meal: meal})} className="button-normal">Delete</button>
                        </div>
                    </div>
                    <div className="meals-menu-container-2">
                        <img src={meal.photo} className="meals-menu-photo" alt="Loading..."/>
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