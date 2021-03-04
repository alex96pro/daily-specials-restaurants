import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNewMealAPI } from '../../common/api/menu.api';
import { CURRENCY } from '../../util/consts';
import { checkTag } from '../../util/functions';
import AddPhoto from '../add-photo/add-photo';
import InputError from '../../components/input-error';
import SubmitButton from '../../components/submit-button';

export default function AddMealModal(props) {

    const dispatch = useDispatch();
    const {register, handleSubmit, errors} = useForm();
    const [modalOpacity, setModalOpacity] = useState(0);
    const {meals, categories, loadingStatus} = useSelector(state => state.menu);
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [tagMessage, setTagMessage] = useState('');
    const [nameMessage, setNameMessage] = useState('');
    const [photoData, setPhotoData] = useState({photo:'', photoCropped: true, changePhoto: false, message:''});
    
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

    const addNewMeal = async (data) => {
        data.name = data.name.trim();
        for(let i = 0; i < meals.length; i++){
            if(meals[i].name === data.name){
                setNameMessage('Meal name already exists');
                return;
            }
        }
        if(!photoData.photoCropped){
            setPhotoData({...photoData, message:'Please press button done to crop photo'});
            return;
        }
        if(!photoData.photo){
            setPhotoData({...photoData, message:'Photo is required'});
            return;
        }
        data.photo = photoData.photo;
        data.tags = tags;
        dispatch(addNewMealAPI(data, props.closeModal));
    };

    useEffect(() => {
        setModalOpacity(1);
    }, []);

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
                        <button onClick={() => setPhotoData({...photoData, changePhoto: true})} className="button-normal">Change photo</button>
                    </div>
                    :
                    <AddPhoto photoData={photoData} setPhotoData={setPhotoData}/>
                }
                <div className="flex-1">
                    <form onSubmit={handleSubmit(addNewMeal)}>
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

                        <div className="label">Category</div>
                        <select name="category" ref={register()}>
                            {categories.map((category,index) => 
                                <option key={index}>
                                    {category}
                                </option>
                            )}
                        </select>

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
                        <div className="finish-adding-button">
                            <SubmitButton loadingStatus={loadingStatus} text='Finish adding meal'/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </React.Fragment>
    );
};