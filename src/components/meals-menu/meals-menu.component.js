import './meals-menu.component.scss';
import Label from '../../components/common/label';
import {CURRENCY} from '../../util/consts';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { editMenuMealAPI } from '../../common/api/menu.api';
import MessageDanger from '../../components/common/message-danger';
import ConfirmDeleteModal from './confirm-delete.modal';
import Loader from '../../components/common/loader';

export default function MealsMenu(props) {

    const {register, handleSubmit} = useForm();
    const {meals, loadingStatus} = useSelector(state => state.menu);
    const [mealForEdit, setMealForEdit] = useState({
        mealId: -1, name:'', price:'', description:'', category:'', photo:'', tags:[]
    });
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [confirmDeleteModal, setConfirmDeleteModal] = useState({show: false, meal: {}});

    const filteredMeals = props.selectedCategories.length > 0 ? 
        props.meals.filter(meal => 
            props.selectedCategories.includes(meal.category)
        ) 
        : props.meals;

    const editMealField = (event) => {
        setMealForEdit({...mealForEdit, [event.target.name] : event.target.value});
    };

    const removeTag = (tagToRemove) => {
        setMealForEdit({...mealForEdit, tags: mealForEdit.tags.filter(tag => tag !== tagToRemove)});
    };

    const addTag = (data) => {
        data.newTag = data.newTag.trim();
        if(mealForEdit.tags.includes(data.newTag)){
            setMessage('You already have that tag');
        }else{
            setMessage('');
            setMealForEdit({...mealForEdit, tags: [...mealForEdit.tags, data.newTag]});
        }
    }

    const successfullEdit = () => {
        setMealForEdit({...mealForEdit, mealId: -1});
    };

    const saveChanges = () => {
        mealForEdit.name = mealForEdit.name.trim();
        for(let i = 0; i < meals.length; i++){
            if(meals[i].name === mealForEdit.name && meals[i].mealId !== mealForEdit.mealId){
                setMessage(`Meal with that name already exists`);
                return;
            }
        }
        if(mealForEdit.description.length > 200){
            setMessage(`Descriptions are limited to 200 characters, you have ${mealForEdit.description.length} characters`);
            return;
        }
        if(mealForEdit.price <= 0){
            setMessage('Meal price must be higher than 0');
            return;
        }
        setMessage('');
        dispatch(editMenuMealAPI(mealForEdit, successfullEdit));
    };

    return(
        <div className="meals-menu">
            <div className="meals-menu-header">Menu</div>
            <button className="button-long">Add new meal</button>
            {filteredMeals.map(meal =>
            meal.mealId !== mealForEdit.mealId ?
                <div className="meals-menu-meal" key={meal.mealId}>
                    <div className="meals-menu-container-1">
                        <Label name='Name: ' value={meal.name}/>
                        <Label name='Description: ' value={meal.description}/>
                        <Label name='Category: ' value={meal.category}/>
                        <Label name='Price: ' value={`${meal.price}${CURRENCY}`}/>
                        <div className="meals-menu-tags">
                        <label className="label-accent-color-2">Tags:</label>
                        {meal.tags.length > 0 ?
                            meal.tags.map((tag, index) => 
                                <div className="meals-menu-tag" key={index}>#{tag}</div>
                            )
                        :<label className="label-accent-color">No tags</label>}
                        </div>
                        <div className="meals-menu-buttons">
                            <button type="button" onClick={() => setMealForEdit(meal)} className="button-normal">Edit</button>
                            <button type="button" onClick={() => setConfirmDeleteModal({show: true, meal: meal})} className="button-normal">Delete</button>
                        </div>
                    </div>
                    <div className="meals-menu-container-2">
                        <img src={meal.photo} className="meals-menu-photo" alt="meal"/>
                    </div>
                </div>
                :
                <div className="meals-menu-meal" key={mealForEdit.mealId}>
                    <div className="meals-menu-container-1">
                        <label className="label-accent-color-2">Name:</label>
                        <input type="text" name="name" value={mealForEdit.name} onChange={editMealField}/>
                        <label className="label-accent-color-2">Description:</label>
                        <textarea name="description" value={mealForEdit.description} onChange={editMealField}/>
                        <label className="label-accent-color-2">Category:</label>
                        <select defaultValue={mealForEdit.category} name="category" onChange={editMealField}>
                            {props.categories.map((category, index) =>
                                <option value={category} key={index}>
                                    {category}
                                </option>
                            )}
                        </select>
                        <div className="label-accent-color-2">Price: ({CURRENCY})</div>
                        <input type="number" name="price" value={mealForEdit.price} onChange={editMealField} step="0.01"/>
                        <div className="label-accent-color-2">Tags:</div>
                        <div className="meals-menu-tags">
                            {mealForEdit.tags.map((tag, index) => 
                                <div className="meals-menu-edit-tag" key={index}>#{tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="meals-menu-edit-tag-x">x</button>
                                </div>
                            )}
                        </div>
                        <form onSubmit={handleSubmit(addTag)}>
                            <input type="text" name="newTag" ref={register({required:true})} placeholder="Add new tag" style={{width:'30%'}}/>
                            <button type="submit" className="button-small">Add</button>
                        </form>
                        <div className="meals-menu-buttons">
                            <button type="button" onClick={saveChanges} className="button-normal">
                                {loadingStatus ? <Loader small={true}/> : 'Save changes'}
                            </button>
                            <button type="button" onClick={() => setMealForEdit({...mealForEdit, mealId: -1})} className="button-normal">Cancel</button>
                        </div>
                        {message && <MessageDanger text={message}/>}
                    </div>
                    <div className="meals-menu-container-2">
                        <img src={meal.photo} className="meals-menu-photo" alt="meal"/>
                        <button className="button-normal">Change photo</button>
                    </div>
                </div>
            )}
            {confirmDeleteModal.show && 
            <ConfirmDeleteModal meal={confirmDeleteModal.meal} closeModal={() => setConfirmDeleteModal(false)}/>}
        </div>
    )
}