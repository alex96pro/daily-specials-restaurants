import './specials.page.scss';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNewSpecialAPI } from '../../common/api/specials.api';
import { checkTag } from '../../util/functions';
import AddPhoto from '../../components/add-photo/add-photo'
import InputError from '../../components/input-error';
import SubmitButton from '../../components/submit-button';
import { CURRENCY } from '../../util/consts';

export default function PostNewSpecialModal(props) {
    
    const {register, handleSubmit, errors} = useForm();
    const [modalOpacity, setModalOpacity] = useState(0);
    const dispatch = useDispatch();
    const {specials, loadingStatus} = useSelector(state => state.specials);
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

    const addNewSpecial = (data) => {
        data.name = data.name.trim();
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
        data.photo = photoData.photo;
        data.tags = tags;
        dispatch(addNewSpecialAPI(data, props.closeModal));
    };

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    return (
        <div className="modal">
            <div className="modal-underlay"></div>
            <div className="modal-container-double" style={{opacity:modalOpacity}}>
                <div className="modal-header">
                    <button onClick={props.closeModal} className="modal-x">x</button>
                </div>
                <div className="modal-body">
                    {photoData.photo && !photoData.changePhoto ? 
                        <div className="add-special-photo-container">
                            <img src={photoData.photo} alt="Loading..." className="add-special-photo"></img>
                            <button onClick={() => setPhotoData({...photoData, changePhoto: true})} className="button-normal">Change photo</button>
                        </div>
                        :
                        <AddPhoto photoData={photoData} setPhotoData={setPhotoData}/>
                    }
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit(addNewSpecial)}>
                        <div className="label-accent-color">Name</div>
                        <input type="text" name="name" ref={register({required:true, maxLength:50})}/>
                        {errors.name && errors.name.type === "required" && <InputError text='Name is required'/>}
                        {errors.name && errors.name.type === "maxLength" && <InputError text="Name is limited to 50 characters"/>}
                        {nameMessage && <InputError text={nameMessage}/>}

                        <div className="label-accent-color">Description</div>
                        <textarea name="description" ref={register({required:true, minLength:10, maxLength:200})}/>
                        {errors.description && errors.description.type === "required" && <InputError text='Description is required'/>}
                        {errors.description && errors.description.type === "minLength" && <InputError text='Description should have minimum 10 characters'/>}
                        {errors.description && errors.description.type === "maxLength" && <InputError text='Description can have maximum 200 characters'/>}

                        <div className="label-accent-color">Price ({CURRENCY})</div>
                        <input type="number" step="0.01" name="price" ref={register({required:true, min:0.01})}/>
                        {errors.price && <InputError text='Price is required'/>}

                        <div className="label-accent-color">Tags</div>
                        <div className="tags">
                            {tags.map((tag,index) => 
                                <div className="tag-rounded" key={index}>#{tag}
                                <button type="button" onClick={() => removeTag(tag)} className="tag-button-x">x</button>
                            </div>
                            )}
                        </div>
                        <input type="text" name="tag" value={newTag} onChange={changeNewTag} style={{width:'16rem'}} placeholder='Add new tag'/>
                        <button type="button" onClick={addTag} className="button-small">Add</button>
                        {tagMessage && <InputError text={tagMessage}/>}
                        <div className="finish-posting-button">
                            <SubmitButton loadingStatus={loadingStatus} text='Post daily special'/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};