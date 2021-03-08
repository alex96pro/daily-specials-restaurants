import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CURRENCY } from '../../util/consts';
import { editMenuMealAPI, convertMealToSpecialAPI } from '../../common/api/menu.api';
import { checkTag, getClientDateAndTime } from '../../util/functions';
import { infoToast } from '../../util/toasts/toasts';
import AddPhoto from '../add-photo/add-photo';
import InputError from '../../components/input-error';
import SubmitButton from '../../components/submit-button';

export default function EditMealModal(props) {

    const dispatch = useDispatch();
    const [modalOpacity, setModalOpacity] = useState(0);
    const {meals, categories, loadingStatus} = useSelector(state => state.menu);
    const [tags, setTags] = useState([...props.meal.tags]);
    const [newTag, setNewTag] = useState('');
    const [tagMessage, setTagMessage] = useState('');
    const [nameMessage, setNameMessage] = useState('');
    const [photoData, setPhotoData] = useState({photo:'', photoCropped: true, changePhoto: false, message:''});
    const [messageSpecialsDate, setMessageSpecialsDate] = useState('');
    const {register, handleSubmit, errors} = useForm({defaultValues:{
        name:props.meal.name, description:props.meal.description, category:props.meal.category, price:props.meal.price, time:"00:00"
    }});

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    const messageSpecialsLimitFull = (message) => {
        setMessageSpecialsDate(message);
    };

    const changeNewTag = (event) => {
        if(event.target.value.length > 25){
            setTagMessage('Tag can contain maximum 25 characters');
            return;
        }
        setTagMessage('');
        setNewTag(event.target.value);
    };

    const addTag = () => {
        checkTag(newTag, setNewTag, tags, setTags, setTagMessage);  
    };

    const removeTag = (tag) => {
        setTags(tags.filter(tagItem => tagItem !== tag));
    };

    const editMeal = (data) => {
        if(props.convertMealToSpecial){
            delete data.category;
            data.tags = tags;
            if(!photoData.photoCropped){
                setPhotoData({...photoData, message:'Please press button done to crop photo'});
                return;
            }
            if(photoData.photo){
                data.newPhoto = photoData.photo;
            }else{
                data.photo = props.meal.photo;
            }
            dispatch(convertMealToSpecialAPI(data, messageSpecialsLimitFull, props.closeModal));
        }else{
            data.name = data.name.trim();
            for(let i = 0; i < meals.length; i++){
                if(meals[i].name === data.name && meals[i].mealId !== props.meal.mealId){
                    setNameMessage('Meal name already exists');
                    return;
                }
            }
            if(!photoData.photoCropped){
                setPhotoData({...photoData, message:'Please press button done to crop photo'});
                return;
            }
            if(photoData.photo){
                data.newPhoto = photoData.photo;
            }
            data.tags = tags;
            data.photo = props.meal.photo;
            data.mealId = props.meal.mealId;
            // check if there is need to call api for changing this meal
            let editedMeal = false;
            if(props.meal.name === data.name && props.meal.description === data.description && props.meal.price === +data.price && props.meal.category === data.category && props.meal.tags.length === data.tags.length && !photoData.photo){
                for(let i = 0; i < data.tags.length; i++) {
                    if(data.tags[i] !== props.meal.tags[i]){
                        editedMeal = true;
                        break;
                    }
                }
            }else{
                editedMeal = true;
            }
            if(editedMeal){
                dispatch(editMenuMealAPI(data, props.closeModal));
            }else{
                infoToast('No changes');
                props.closeModal();
            }
        }
    };

    return (
        <React.Fragment>
        <div className="modal-underlay" onClick={props.closeModal}></div>
        <div className="modal" style={{opacity:modalOpacity}}>
            <div className="modal-header">
                <i className="fas fa-times fa-2x" onClick={() => props.closeModal()}></i>
            </div>
            <div className="modal-body-horizontal" >
                {props.meal.photo && !photoData.changePhoto ?
                <div className="edit-meal-photo-container">
                    <img src={photoData.photo || props.meal.photo} alt="Loading..." className="edit-meal-photo"/>
                    <div><button onClick={() => setPhotoData({...photoData, changePhoto: true})} className="button-normal">Change photo</button></div>
                </div>
                :
                <AddPhoto photoData={photoData} setPhotoData={setPhotoData}/>
                }
                <div className="flex-1">
                    <form onSubmit={handleSubmit(editMeal)}>
                        <div className="label">Name</div>
                        <input type="text" name="name" ref={register({required:true, maxLength:50})}/>
                        {errors.name && errors.name.type === "required" && <InputError text='Name is required'/>}
                        {errors.name && errors.name.type === "maxLength" && <InputError text='Name is limited to 50 characters'/>}
                        {nameMessage && <InputError text={nameMessage}/>}

                        <div className="label">Description</div>
                        <textarea name="description" ref={register({required:true, minLength:10, maxLength:200})}/>
                        {errors.description && errors.description.type === "required" && <InputError text='Description is required'/>}
                        {errors.description && errors.description.type === "minLength" && <InputError text='Description should have minimum 10 characters'/>}
                        {errors.description && errors.description.type === "maxLength" && <InputError text='Description can have maximum 200 characters'/>}

                        {props.convertMealToSpecial ? 
                        <div className="flex-space-between">
                            <div>
                                <label className="label">Date</label>
                                <input type="date" name="date" ref={register()} defaultValue={getClientDateAndTime(true, false)}/>
                                {messageSpecialsDate && <InputError text={messageSpecialsDate}/>}
                            </div>
                            <div>
                                <label className="label">Time</label>
                                <input type="time" name="time" ref={register()}/>
                            </div>
                        </div>:
                        <React.Fragment>
                            <div className="label">Category</div>
                            <select name="category" ref={register()}>
                                {categories.map((category,index) => 
                                    <option key={index}>
                                        {category}
                                    </option>
                                )}
                            </select>
                        </React.Fragment>
                        }
                        <div className="label">Price ({CURRENCY})</div>
                        <input type="number" step="0.01" name="price" ref={register({required:true, min:0.01})}/>
                        {errors.price && <InputError text='Price is required'/>}

                        <div className="label">Tags</div>
                        <div className="tags">
                            {tags.map((tag,index) => 
                                <div className="tag-rounded" key={index}>#{tag}
                                <button type="button" onClick={() => removeTag(tag)} className="tag-button-x">x</button>
                            </div>
                            )}
                        </div>
                        <input type="text" name="tag" value={newTag} onChange={changeNewTag} placeholder='Add new tag' style={{width:'16rem'}}/>
                        <button type="button" onClick={addTag} className="button-small">Add</button>
                        {tagMessage && <InputError text={tagMessage}/>}
                        <div className="label">Modifiers</div>
                        <div className="menu-meal-modifier">Burger size<i className="fas fa-times fa-1x modifier-x"></i></div>
                        <div className="menu-meal-modifier">Burger Extras<i className="fas fa-times fa-1x modifier-x"></i></div>
                        <div className="flex-row"><select>
                            <option>Modifier 1</option>
                            <option>Modifier 2</option>
                            <option>Modifier 3</option>
                        </select>
                        <button className="button-small">Add</button></div>
                        <SubmitButton loadingStatus={loadingStatus} text={props.convertMealToSpecial ? 'Post new special' : 'Save changes'}/>
                    </form>
                </div>
            </div>   
    </div>
    </React.Fragment>
    );
};