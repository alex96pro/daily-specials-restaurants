import './meals-menu.component.scss';
import Label from '../../components/common/label';
import {CURRENCY} from '../../util/consts';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { editMenuMealAPI } from '../../common/api/menu.api';
import { checkMealEdit } from '../../util/functions';
import InputError from '../../components/common/input-error';
import ConfirmDeleteModal from './confirm-delete.modal';
import Loader from '../../components/common/loader';
import ChangePhotoModal from './change-photo.modal';
import AddMealModal from './add-meal.modal';

export default function MealsMenu(props) {

    const {register, handleSubmit} = useForm();
    const {loadingStatus} = useSelector(state => state.menu);
    const [mealForEdit, setMealForEdit] = useState({
        mealId: -1, name:'', price:'', description:'', category:'', photo:'', tags:[]
    });
    const [photo, setPhoto] = useState('');
    const dispatch = useDispatch();
    const [messages, setMessages] = useState({name:'', description:'', tag:'', price:'', category:''});
    const [confirmDeleteModal, setConfirmDeleteModal] = useState({show: false, meal: {}});
    const [changePhotoModal, setChangePhotoModal] = useState(false);
    const [addMealModal, setAddMealModal] = useState(false);

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
        data.newTag = data.newTag.trim().replace(/ /g,'');
        if(mealForEdit.tags.includes(data.newTag) || data.newTag.length === 0){
            if(data.newTag.length === 0){
                setMessages({...messages, tag:'Please enter valid tag name'});
            }else{
                setMessages({...messages, tag:'Tag already exists'});
            }
        }else{
            setMessages({...messages, tag:''});
            setMealForEdit({...mealForEdit, tags: [...mealForEdit.tags, data.newTag]});
        }
    }

    const successfullEdit = () => {
        setMealForEdit({...mealForEdit, mealId: -1});
    };

    const makeMealEditable = (meal) => {
        setMealForEdit(meal);
        setMessages({name:'', description:'', tag:'', price:'', category:''});
        setPhoto('');
    };

    const cancelEdit = () => {
        setPhoto('');
        setMealForEdit({...mealForEdit, mealId: -1});
        setMessages({name:'', description:'', tag:'', price:'', category:''});
    };

    const saveChanges = () => {
        if(checkMealEdit(mealForEdit, props.meals, setMessages)){
            if(photo){
                mealForEdit.newPhoto = photo;
            }
            dispatch(editMenuMealAPI(mealForEdit, successfullEdit));
            if(!photo){
                setPhoto('');
            }
        }
    };

    return(
        <div className="meals-menu">
            <div className="meals-menu-header">Menu</div>
            <button onClick={() => setAddMealModal(true)} className={props.categories.length === 0 ? "button-long-disabled":"button-long"}>Add new meal</button>
            {filteredMeals.map(meal =>
            meal.mealId !== mealForEdit.mealId ?
                <div className="meals-menu-meal" key={meal.mealId}>
                    <div className="meals-menu-container-1">
                        <Label name='Name: ' value={meal.name}/>
                        <Label name='Description: ' value={meal.description}/>
                        <Label name='Category: ' value={meal.category ? meal.category : 'No category'}/>
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
                            <button type="button" onClick={() => makeMealEditable({...meal, category: meal.category ? meal.category : props.categories[0]})} 
                            className={props.categories.length === 0 ? "button-normal-disabled" : "button-normal"}>Edit</button>
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
                        <input type="text" name="name" value={mealForEdit.name} onChange={editMealField} required/>
                        {messages.name && <InputError text={messages.name}/>}
                        <label className="label-accent-color-2">Description:</label>
                        <textarea name="description" value={mealForEdit.description} onChange={editMealField}/>
                        {messages.description && <InputError text={messages.description}/>}
                        <label className="label-accent-color-2">Category:</label>
                        <select defaultValue={mealForEdit.category} name="category" onChange={editMealField}>
                        {props.categories.map((category, index) =>
                            <option value={category} key={index}>
                                {category}
                            </option>
                        )}
                        </select>
                        {messages.category && <InputError text={messages.category}/>}
                        <div className="label-accent-color-2">Price: ({CURRENCY})</div>
                        <input type="number" name="price" value={mealForEdit.price} onChange={editMealField} step="0.01"/>
                        {messages.price && <InputError text={messages.price}/>}
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
                        {messages.tag && <InputError text={messages.tag}/>}
                        <div className="meals-menu-buttons">
                            <button type="button" onClick={saveChanges} className="button-normal">
                                {loadingStatus ? <Loader small={true}/> : 'Save changes'}
                            </button>
                            <button type="button" onClick={cancelEdit} className="button-normal">Cancel</button>
                        </div>
                    </div>
                    <div className="meals-menu-container-2">
                        <img src={photo ? photo : meal.photo} className="meals-menu-photo" alt="meal"/>
                        <button className="button-long" onClick={() => setChangePhotoModal(true)}>Change photo</button>
                    </div>
                </div>
            )}
            {confirmDeleteModal.show && 
            <ConfirmDeleteModal meal={confirmDeleteModal.meal} closeModal={() => setConfirmDeleteModal(false)}/>}
            {changePhotoModal && <ChangePhotoModal setPhoto={(newPhoto) => setPhoto(newPhoto)} closeModal={() => setChangePhotoModal(false)}/>}
            {addMealModal && <AddMealModal closeModal={() => setAddMealModal(false)}/>}
        </div>
    )
}