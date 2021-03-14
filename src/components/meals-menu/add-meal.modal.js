import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNewMealAPI } from '../../common/api/menu.api';
import { CURRENCY } from '../../util/consts';
import { checkTag } from '../../util/functions';
import AddPhoto from '../add-photo/add-photo';
import InputError from '../../components/input-error';
import SubmitButton from '../../components/submit-button';
import Select from 'react-select';

export default function AddMealModal(props) {

    const dispatch = useDispatch();
    const {register, handleSubmit, errors} = useForm();
    const [modalOpacity, setModalOpacity] = useState(0);
    const {meals, categories, loadingStatus} = useSelector(state => state.menu);
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [tagMessage, setTagMessage] = useState('');
    const [nameMessage, setNameMessage] = useState('');
    const [modifiersMessage, setModifiersMessage] = useState('');
    const [photoData, setPhotoData] = useState({photo:'', photoCropped: true, changePhoto: false, message:''});
    const [startingPrice, setStartingPrice] = useState('');
    const { modifiers } = useSelector(state => state.modifiers);
    const allModifiers = modifiers.map(modifier => ({label:modifier.modifier.name, value:modifier}));
    const [selectedModifiers, setSelectedModifiers] = useState([]);

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    const changeNewTag = (event) => {
        if(event.target.value.length > 25){
            setTagMessage('Tag can contain maximum 25 characters');
            return;
        }
        setTagMessage('');
        setNewTag(event.target.value);
    };

    const addNewMeal = async (data) => {
        data.name = data.name.trim();
        for(let i = 0; i < meals.length; i++){
            if(meals[i].name === data.name){
                setNameMessage('Meal name already exists');
                return;
            }
        }
        if(modifiersMessage){
            return;
        }
        if(!photoData.photoCropped){
            setPhotoData({...photoData, message:'Please press button done to crop photo'});
            return;
        }
        if(!photoData.photo){
            setPhotoData({...photoData, message:'Photo is required'});
            return;
        }
        data.price = startingPrice ? startingPrice.modifier.options[startingPrice.modifier.defaultOption] : data.price;
        data.photo = photoData.photo;
        data.modifiers = selectedModifiers.map(modifier => modifier.value.modifierId);
        data.tags = tags;
        dispatch(addNewMealAPI(data, props.closeModal));
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
        <div className="modal-underlay"></div>
        <div className="modal" style={{opacity:modalOpacity}}>
            <div className="modal-header">
                <i className="fas fa-times fa-2x" onClick={() => props.closeModal()}></i>
            </div>
            <div className="modal-body-horizontal">
                {photoData.photo && !photoData.changePhoto ? 
                    <div className="add-meal-photo-container">
                        <img src={photoData.photo} alt="Loading..." className="add-meal-photo"></img>
                        <div><button onClick={() => setPhotoData({...photoData, changePhoto: true})} className="button-normal">Change photo</button></div>
                    </div>
                    :
                    <AddPhoto photoData={photoData} setPhotoData={setPhotoData}/>
                }
                <div className="flex-1 p-15">
                    <form onSubmit={handleSubmit(addNewMeal)}>
                        <div className="label">Name</div>
                        <input type="text" name="name" ref={register({required:true, maxLength:50})} className="app-input"/>
                        {errors.name && errors.name.type === "required" && <InputError text='Name is required'/>}
                        {errors.name && errors.name.type === "maxLength" && <InputError text='Name is limited to 50 characters'/>}
                        {nameMessage && <InputError text={nameMessage}/>}

                        <div className="label">Description</div>
                        <textarea name="description" ref={register({required:true, minLength:10, maxLength:200})} className="app-textarea"/>
                        {errors.description && errors.description.type === "required" && <InputError text='Description is required'/>}
                        {errors.description && errors.description.type === "minLength" && <InputError text='Description should have minimum 10 characters'/>}
                        {errors.description && errors.description.type === "maxLength" && <InputError text='Description can have maximum 200 characters'/>}

                        <div className="label">Category</div>
                        <select name="category" ref={register()} className="app-select">
                            {categories.map((category,index) => 
                                <option key={index} className="app-option">
                                    {category}
                                </option>
                            )}
                        </select>
                        <div className="label">Modifiers</div>
                        <Select
                            options={allModifiers}
                            onChange={(selected) => handleSetSelectedModifiers(selected)}
                            backspaceRemovesValue={false} 
                            isMulti={true}
                            isSearchable={true}
                            placeholder="Select modifier"
                            className='react-select-container'
                            classNamePrefix="react-select"
                        />
                        {modifiersMessage && <InputError text={modifiersMessage}/>}
                        <div className="label">Price {startingPrice && " is determined by modifier"}</div>
                        <div className="flex-row">
                            <input type="number" step="0.01" name="price" ref={register({required:true, min:0.01})} className="app-input-number input-with-icon" disabled={startingPrice}/>
                            {errors.price && <InputError text='Price is required'/>}
                            <span className="input-icon">{CURRENCY}</span>
                        </div>
                        <div className="label">Tags</div>
                        <div className="tags">
                            {tags.map((tag,index) => 
                                <div className="tag-rounded flex-row" key={index}>#{tag}
                                <i onClick={() => setTags(tags.filter(tagItem => tagItem !== tag))} className="fas fa-times remove-tag-icon"></i>
                            </div>
                            )}
                        </div>
                        <div className="flex-row">
                            <input type="text" name="tag" value={newTag} onChange={changeNewTag} placeholder='Add new tag' className="app-input input-with-icon"/>
                            <button type="button" onClick={() => checkTag(newTag, setNewTag, tags, setTags, setTagMessage)} className="button-for-input">Add</button>
                        </div>
                        {tagMessage && <InputError text={tagMessage}/>}
                        <div className="finish-adding-button">
                            <SubmitButton loadingStatus={loadingStatus} text='Finish adding meal' className="button-long"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </React.Fragment>
    );
};