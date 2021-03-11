import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { CURRENCY } from '../../util/consts';
import { editSpecialAPI } from '../../common/api/specials.api';
import { checkTag } from '../../util/functions';
import { infoToast } from '../../util/toasts/toasts';
import SubmitButton from '../../components/submit-button';
import InputError from '../../components/input-error';
import AddPhoto from '../../components/add-photo/add-photo';
import Select from 'react-select';

export default function EditSpecialModal(props) {
   
    const dispatch = useDispatch();
    const [modalOpacity, setModalOpacity] = useState(0);
    const {loadingStatus} = useSelector(state => state.specials);
    const [tags, setTags] = useState([...props.special.tags]);
    const [newTag, setNewTag] = useState('');
    const [tagMessage, setTagMessage] = useState('');
    const [modifiersMessage, setModifiersMessage] = useState('');
    const [photoData, setPhotoData] = useState({photo:'', photoCropped: true, changePhoto: false, message:''});
    const { modifiers } = useSelector(state => state.modifiers);
    const { mealModifiers } = useSelector(state => state.meal);
    const [startingPrice, setStartingPrice] = useState(mealModifiers.find(modifier => modifier.modifier.modifierType === "requiredBase"));
    const allModifiers = modifiers.map(modifier => ({label:modifier.modifier.name, value:modifier}));
    const [selectedModifiers, setSelectedModifiers] = useState(mealModifiers.map(modifier => ({label: modifier.modifier.name, value:modifier})));
    
    const {register, handleSubmit, errors} = useForm({defaultValues:{
        name:props.special.name, description:props.special.description, time:props.special.time
    }});

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

    const editSpecial = (data) => {
        data.specialId = props.special.specialId;
        data.tags = tags;
        data.modifiers = selectedModifiers.map(modifier => modifier.value.modifierId);
        data.price = startingPrice ? startingPrice.modifier.options[startingPrice.modifier.defaultOption] : data.price;
        if(props.today){ //input time is disabled, so we need to set data.time for form in order to check if something changed on meal edit
            data.time = props.special.time;
        }
        // check if there is need to call api for changing this special
        let editedMeal = false;
        let modifiersChanged = false;
        let special = props.special;
        if(modifiersMessage){
            return;
        }
        if(!photoData.photoCropped){
            setPhotoData({...photoData, message:'Please press button done to crop photo'});
            return;
        }
        if(photoData.photo){
            data.newPhoto = photoData.photo;
        }
        if(special.name === data.name && special.description === data.description && special.price === (+data.price || startingPrice.modifier.options[startingPrice.modifier.defaultOption]) && special.tags.length === data.tags.length && special.time === data.time && !data.newPhoto){
            for(let i = 0; i < data.tags.length; i++) {
                if(data.tags[i] !== props.special.tags[i]){
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
            data.timestamp = props.date.dbFormat + ' ' + data.time;
            data.photo = props.special.photo; //old photo
            dispatch(editSpecialAPI(data, props.closeModal));
        }else{
            infoToast('No changes');
            props.closeModal();
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
                <i className="fas fa-times fa-2x" onClick={() => props.closeModal()}></i>
            </div>
            <div className={props.today ? "modal-body-vertical" : "modal-body-horizontal"}>
                
                {!props.today && <div>
                {props.special.photo && !photoData.changePhoto ?
                    <div className="edit-special-photo-container">
                        <img src={photoData.photo || props.special.photo} alt="Loading..." className="edit-special-photo"/>
                        <div>
                            <button onClick={() => setPhotoData({...photoData, changePhoto: true})} className="button-normal">Change photo</button>
                        </div>
                    </div>
                    :
                    <AddPhoto photoData={photoData} setPhotoData={setPhotoData}/>
                    }
                </div>}
                <div className="flex-1 p-15">
                    <form onSubmit={handleSubmit(editSpecial)}>
                        <label className="label">Name</label>
                        <input type="text" name="name" ref={register({required: true, maxLength:50})} className="app-input"/>
                        {errors.name && errors.name.type === "required" && <InputError text="Name is required"/>}
                        {errors.name && errors.name.type === "maxLength" && <InputError text="Name is limited to 50 characters"/>}
                        <label className="label">Description</label>
                        <textarea name="description" ref={register({required: true, minLength: 10, maxLength: 200})} className="app-textarea"/>
                        {errors.description && errors.description.type === "required" && <InputError text="Description is required"/>}
                        {errors.description && errors.description.type === "minLength" &&<InputError text="Description minimum is 10 characters"/>}
                        {errors.description && errors.description.type === "maxLength" &&<InputError text="Description maximum is 200 characters"/>}
                        <div className="flex-space-between">
                            <div>
                                <div className="label">Price ({CURRENCY})</div>
                                <input type="number" name="price" step="0.01" ref={register({required: true, min: 0.01})} className="app-input-number"  defaultValue={startingPrice ? startingPrice.modifier.options[startingPrice.modifier.defaultOption] : props.special.price} disabled={startingPrice}/>
                                {errors.price && <InputError text="Price is required"/>}
                            </div>
                            <div>
                                <div className="label">Date</div>
                                {props.today ? <div className="label">Today</div>
                                :
                                <div className="label">{props.date.value}</div>
                                }
                            </div>
                            <div>
                                <div className="label">Time</div>
                                <input type="time" name="time" ref={register()} disabled={props.today} className="app-input-time"/>
                            </div>
                        </div>
                        <div className="label">Modifiers</div>
                        <Select
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
                        <div className="label">Tags</div>
                        <div className="tags">
                            {tags.map((tag, index) => <div className="tag-rounded flex-row" key={index}>
                                #{tag}<i onClick={() => setTags(tags.filter(tagItem => tagItem !== tag))} className="fas fa-times remove-tag-icon"></i>
                            </div>)}
                        </div>
                        <div className="flex-row">
                            <input type="text" placeholder="Add new tag" value={newTag} onChange={changeNewTag} className="app-input"/>
                            <button onClick={() => checkTag(newTag, setNewTag, tags, setTags, setTagMessage)} type="button" className="button-small">Add</button>
                        </div>
                        {tagMessage && <InputError text={tagMessage}/>}
                        <SubmitButton loadingStatus={loadingStatus} text='Save changes'/>
                    </form>
                </div>
            </div>
        </div>
        </React.Fragment>
    );
};