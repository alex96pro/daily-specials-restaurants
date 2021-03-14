import './specials.page.scss';
import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNewSpecialAPI } from '../../common/api/specials.api';
import { checkTag, getClientDateAndTime } from '../../util/functions';
import { CURRENCY } from '../../util/consts';
import AddPhoto from '../../components/add-photo/add-photo'
import InputError from '../../components/input-error';
import SubmitButton from '../../components/submit-button';
import Select from 'react-select';

export default function PostNewSpecialModal(props) {
    
    const {register, handleSubmit, errors} = useForm();
    const [modalOpacity, setModalOpacity] = useState(0);
    const dispatch = useDispatch();
    const {specials, loadingStatus} = useSelector(state => state.specials);
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

    const addNewSpecial = (data) => {
        data.name = data.name.trim();
        data.price = startingPrice ? startingPrice.modifier.options[startingPrice.modifier.defaultOption] : data.price;
        for(let i = 0; i < specials.length; i++){
            if(specials[i].name === data.name){
                setNameMessage('Special with that name already exists');
                return;
            }
        }
        setNameMessage('');
        if(!photoData.photoCropped){
            setPhotoData({...photoData, message:'Please press button done to crop photo'});
            return;
        }
        if(!photoData.photo){
            setPhotoData({...photoData, message:'Photo is required'});
            return;
        }
        if(data.time){ //not today's date
            data.dateAndTime = props.date.dbFormat + ' ' + data.time + ':00';
        }else{ //today's date
            data.dateAndTime = getClientDateAndTime();
        }
        data.photo = photoData.photo;
        data.modifiers = selectedModifiers.map(modifier => modifier.value.modifierId);
        data.tags = tags;
        dispatch(addNewSpecialAPI(data, props.closeModal));
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
                    <div className="add-special-photo-container">
                        <img src={photoData.photo} alt="Loading..." className="add-special-photo"></img>
                        <div><button onClick={() => setPhotoData({...photoData, changePhoto: true})} className="button-normal">Change photo</button></div>
                    </div>
                    :
                    <AddPhoto photoData={photoData} setPhotoData={setPhotoData}/>
                }
                <div className="flex-1 p-15">
                    <form onSubmit={handleSubmit(addNewSpecial)}>
                        <div className="label">Name</div>
                        <input type="text" name="name" ref={register({required:true, maxLength:50})} className="app-input"/>
                        {errors.name && errors.name.type === "required" && <InputError text='Name is required'/>}
                        {errors.name && errors.name.type === "maxLength" && <InputError text="Name is limited to 50 characters"/>}
                        {nameMessage && <InputError text={nameMessage}/>}

                        <div className="label">Description</div>
                        <textarea name="description" ref={register({required:true, minLength:10, maxLength:200})} className="app-textarea"/>
                        {errors.description && errors.description.type === "required" && <InputError text='Description is required'/>}
                        {errors.description && errors.description.type === "minLength" && <InputError text='Description should have minimum 10 characters'/>}
                        {errors.description && errors.description.type === "maxLength" && <InputError text='Description can have maximum 200 characters'/>}
                        <div className="flex-space-between">
                            <div>
                                <div className="label">Price {startingPrice && " is determined by modifier"}</div>
                                <div className="flex-row">
                                    <input type="number" step="0.01" name="price" ref={register({required:true, min:0.01})} className="app-input-number input-with-icon" disabled={startingPrice}/>
                                    <span className="input-icon">{CURRENCY}</span>
                                </div>
                                {errors.price && <InputError text='Price is required'/>}
                            </div>
                            <div>
                                <div className="label">Date</div>
                                {props.today ?
                                    <div className="label special-date-margined">Today</div>
                                    :
                                    <div className="label special-date-margined">{props.date.value}</div>
                                }
                            </div>
                            {!props.today &&
                            <div>
                                <div className="label">Time</div>
                                <input type="time" defaultValue="00:00" name="time" ref={register()} className="app-input-time m-0"/>
                            </div>
                            }
                        </div>
                        <div className="label">Modifiers</div>
                        <Select
                            options={allModifiers}
                            onChange={(selected) => handleSetSelectedModifiers(selected)} 
                            isMulti={true}
                            isSearchable={true}
                            backspaceRemovesValue={false}
                            placeholder="Select modifier"
                            className='react-select-container'
                            classNamePrefix="react-select"
                        />
                        {modifiersMessage && <InputError text={modifiersMessage}/>}
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
                        <div className="finish-posting-button">
                            <SubmitButton loadingStatus={loadingStatus} text='Post daily special' className="button-long"/>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};