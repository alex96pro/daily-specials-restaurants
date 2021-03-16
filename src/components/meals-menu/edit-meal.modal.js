import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CURRENCY } from '../../util/consts';
import { editMenuMealAPI, convertMealToSpecialAPI } from '../../common/api/menu.api';
import { checkTag, getClientDateAndTime } from '../../util/functions';
import { infoToast } from '../../util/toasts/toasts';
import { Select } from 'antd';
import AddPhoto from '../add-photo/add-photo';
import InputError from '../../components/input-error';
import SubmitButton from '../../components/submit-button';
import MultiSelect from 'react-select';

export default function EditMealModal(props) {

    const dispatch = useDispatch();
    const [modalOpacity, setModalOpacity] = useState(0);
    const {meals, categories, loadingStatus} = useSelector(state => state.menu);
    const [tags, setTags] = useState([...props.meal.tags]);
    const [newTag, setNewTag] = useState('');
    const [tagMessage, setTagMessage] = useState('');
    const [nameMessage, setNameMessage] = useState('');
    const [modifiersMessage, setModifiersMessage] = useState('');
    const [photoData, setPhotoData] = useState({photo:'', photoCropped: true, changePhoto: false, message:''});
    const [messageSpecialsDate, setMessageSpecialsDate] = useState('');
    const { modifiers } = useSelector(state => state.modifiers);
    const { mealModifiers } = useSelector(state => state.meal);
    const [startingPrice, setStartingPrice] = useState(mealModifiers.find(modifier => modifier.modifier.modifierType === "requiredBase"));
    const allModifiers = modifiers.map(modifier => ({label:modifier.modifier.name, value:modifier}));
    const [selectedModifiers, setSelectedModifiers] = useState(mealModifiers.map(modifier => ({label: modifier.modifier.name, value:modifier})));
    const [selectedCategory, setSelectedCategory] = useState(props.meal.category);
    const {register, handleSubmit, errors} = useForm({defaultValues:{
        name:props.meal.name, description:props.meal.description, time:"00:00"
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

    const editMeal = (data) => {
        data.mealId = props.meal.mealId;
        data.modifiers = selectedModifiers.map(modifier => modifier.value.modifierId);
        data.tags = tags;
        data.price = startingPrice ? startingPrice.modifier.options[startingPrice.modifier.defaultOption] : data.price;
        if(modifiersMessage){
            return;
        }
        if(props.convertMealToSpecial){
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
            data.photo = props.meal.photo;
            data.category = selectedCategory;
            // check if there is need to call api for changing this meal
            let editedMeal = false;
            let modifiersChanged = false;
            if(props.meal.name === data.name && props.meal.description === data.description && props.meal.price === (+data.price || startingPrice.modifier.options[startingPrice.modifier.defaultOption]) && props.meal.category === data.category && props.meal.tags.length === data.tags.length && !photoData.photo){
                for(let i = 0; i < data.tags.length; i++) {
                    if(data.tags[i] !== props.meal.tags[i]){
                        editedMeal = true;
                        break;
                    }
                }
            }else{
                editedMeal = true;
            }
            if(mealModifiers.length !== selectedModifiers.length){
                editedMeal = true;
                modifiersChanged = true;
            }else{
                for(let i = 0; i < mealModifiers.length; i++){
                    if(mealModifiers[i].modifierId !== selectedModifiers[i].value.modifierId){
                        editedMeal = true;
                        modifiersChanged = true;
                        break;
                    }
                }
            }                
            if(editedMeal){
                if(modifiersChanged){
                    data.modifiersChanged = true;
                }
                dispatch(editMenuMealAPI(data, props.closeModal));
            }else{
                infoToast('No changes');
                props.closeModal();
            }
        }
    };

    const handleSetSelectedModifiers = (selected) => {
        let requiredBaseModifierCount = 0;
        for(let i = 0; i < selected.length; i++) {
            if(selected[i].value.modifier.modifierType === "requiredBase"){
                requiredBaseModifierCount++;
                document.getElementsByName('price')[0].value = selected[i].value.modifier.options[selected[i].value.modifier.defaultOption];
                setStartingPrice(selected[i].value);
            }
        }
        if(requiredBaseModifierCount === 0){
            setStartingPrice('');
        }
        if(requiredBaseModifierCount > 1){
            setModifiersMessage(`You have ${requiredBaseModifierCount} modifiers with starting price`);
        }else{
            setModifiersMessage('');
        }
        setSelectedModifiers(selected);
    };

    return (
        <React.Fragment>
        <div className="modal-underlay" onClick={props.closeModal}></div>
        <div className="modal" style={{opacity:modalOpacity}}>
            <div className="modal-header">
                <i className="fas fa-times fa-2x" onClick={props.closeModal}></i>
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
                <div className="flex-1 p-15">
                    <form onSubmit={handleSubmit(editMeal)}>
                        <div className="label m-0">Name</div>
                        <input type="text" name="name" ref={register({required:true, maxLength:50})} className="app-input"/>
                        {errors.name && errors.name.type === "required" && <InputError text='Name is required'/>}
                        {errors.name && errors.name.type === "maxLength" && <InputError text='Name is limited to 50 characters'/>}
                        {nameMessage && <InputError text={nameMessage}/>}
                        <div className="label">Description</div>
                        <textarea name="description" ref={register({required:true, minLength:10, maxLength:200})} className="app-textarea"/>
                        {errors.description && errors.description.type === "required" && <InputError text='Description is required'/>}
                        {errors.description && errors.description.type === "minLength" && <InputError text='Description should have minimum 10 characters'/>}
                        {errors.description && errors.description.type === "maxLength" && <InputError text='Description can have maximum 200 characters'/>}
                        {props.convertMealToSpecial ? 
                        <div className="flex-space-between">
                            <div>
                                <div className="label">Date</div>
                                <input type="date" name="date" ref={register()} defaultValue={getClientDateAndTime(true, false)} className="app-input-date"/>
                                {messageSpecialsDate && <InputError text={messageSpecialsDate}/>}
                            </div>
                            <div>
                                <div className="label">Time</div>
                                <input type="time" name="time" ref={register()} className="app-input-time"/>
                            </div>
                        </div>:
                        <React.Fragment>
                            <div className="label">Category</div>
                            <Select onChange={(selected) => setSelectedCategory(selected)} defaultValue={props.meal.category}>
                                {categories.map((category,index) => 
                                    <Select.Option value={category} key={index}>
                                        {category}
                                    </Select.Option>
                                )}
                            </Select>
                        </React.Fragment>
                        }
                        <div className="label">Modifiers</div>
                        <MultiSelect
                            options={allModifiers}
                            defaultValue={selectedModifiers}
                            onChange={(selected) => handleSetSelectedModifiers(selected)} 
                            isMulti={true}
                            isSearchable={true}
                            backspaceRemovesValue={false}
                            placeholder="Select modifier"
                            className='react-select-container'
                            classNamePrefix="react-select"
                        />
                        {modifiersMessage && <InputError text={modifiersMessage}/>}
                        <div className="label">Price {startingPrice && " is determined by modifier"}</div>
                        <div className="flex-row">
                        <input type="number" step="0.01" name="price" ref={register({required:true, min:0.01})} className="app-input-number input-with-icon" defaultValue={startingPrice ? startingPrice.modifier.options[startingPrice.modifier.defaultOption] : props.meal.price} 
                        disabled={startingPrice}/>
                        <span className="input-icon">{CURRENCY}</span>
                        </div>
                        {errors.price && <InputError text='Price is required'/>}
                        <div className="label">Tags</div>
                        <div className="tags">
                            {tags.map((tag,index) => 
                                <div className="tag-rounded flex-row" key={index}>#{tag}&nbsp;
                                <i onClick={() => setTags(tags.filter(tagItem => tagItem !== tag))} className="fas fa-times remove-tag-icon"></i>
                            </div>
                            )}
                        </div>
                        <div className="flex-row"><input type="text" name="tag" value={newTag} onChange={changeNewTag} placeholder='Add new tag' className="app-input input-with-icon"/>
                        <button type="button" onClick={() => checkTag(newTag, setNewTag, tags, setTags, setTagMessage)} className="button-for-input">Add</button></div>
                        {tagMessage && <InputError text={tagMessage}/>}
                        <SubmitButton loadingStatus={loadingStatus} text={props.convertMealToSpecial ? 'Post new special' : 'Save changes'} className="button-long"/>
                    </form>
                </div>
            </div>   
    </div>
    </React.Fragment>
    );
};