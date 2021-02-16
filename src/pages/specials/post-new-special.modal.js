import './specials.page.scss';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNewSpecialAPI } from '../../common/api/specials.api';
import AddPhoto from '../../components/add-photo/add-photo'
import InputError from '../../components/common/input-error';
import SubmitButton from '../../components/common/submit-button';

export default function PostNewSpecialModal(props) {
    
    const {register, handleSubmit, errors} = useForm();
    const [modalOpacity, setModalOpacity] = useState(0);
    const dispatch = useDispatch();
    const {specials, loadingStatus} = useSelector(state => state.specials);
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [tagMessage, setTagMessage] = useState('');
    const [nameMessage, setNameMessage] = useState('');
    const [addPhotoModal, setAddPhotoModal] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [photo, setPhoto] = useState('');
    
    const changeNewTag = (event) => {
        if(event.target.value.length > 25){
            setTagMessage('Tag can contain maximum 25 characters');
            return;
        }
        setTagMessage('');
        setNewTag(event.target.value);
    };

    const addTag = () => {
        if(tags.length === 10){
            setTagMessage('Maximal number of tags is 10');
            return;
        }
        let newTagTrimmed = newTag.trim().replace(/ /g,'');
        if(tags.includes(newTagTrimmed) || newTagTrimmed.length === 0){
            if(newTagTrimmed.length === 0){
                setTagMessage('Please enter valid tag name');
            }else{
                setTagMessage('Tag already exists');
            }
        }else if(newTagTrimmed.includes(',')){
            setTagMessage("Tags can't contain sign ','");
        }
        else{
            setTags([...tags, newTagTrimmed]);
            setTagMessage('');
        }  
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
        data.photo = photo;
        data.tags = tags;
        dispatch(addNewSpecialAPI(data, props.closeModal));
    };

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    return (
        <div className="modal">
            <div className="modal-underlay"></div>
            <div className="modal-container" style={{opacity:modalOpacity}}>
                <div className="modal-header">
                    <button onClick={props.closeModal} className="modal-x">x</button>
                </div>
             
                <div className="modal-body" style={{display: (!addPhotoModal && !showPhotoModal) ? 'block' : 'none'}}>
                    <form onSubmit={handleSubmit(addNewSpecial)}>
                        <div className="label-accent-color">Name</div>
                        <input type="text" name="name" ref={register({required:true, maxLength:50})}/>
                        {errors.name && errors.name.type === "required" && <InputError text='Name is required'/>}
                        {errors.name && errors.name.type === "maxLength" && <InputError text="Name is limited to 50 characters"/>}
                        {nameMessage && <InputError text={nameMessage}/>}

                        <div className="label-accent-color">Description</div>
                        <textarea name="description" ref={register({required:true, minLength:20, maxLength:200})}/>
                        {errors.description && errors.description.type === "required" && <InputError text='Description is required'/>}
                        {errors.description && errors.description.type === "minLength" && <InputError text='Description should have minimum 20 characters'/>}
                        {errors.description && errors.description.type === "maxLength" && <InputError text='Description can have maximum 200 characters'/>}

                        <div className="label-accent-color">Price</div>
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
                        
                        {photo ? 
                        <div>
                            <div className="label-accent-color">
                                Photo<button type="button" onClick={() => setShowPhotoModal(true)} className="button-small">See added photo</button>
                            </div>
                            <SubmitButton loadingStatus={loadingStatus} text='Post daily special'/>
                        </div>
                        :
                        <button type="button" onClick={() => setAddPhotoModal(true)} className="button-long">Add photo</button>   
                        }
                    </form>
                </div>

                {addPhotoModal &&
                <div className="modal-body">
                    <button type="button" onClick={() => setAddPhotoModal(false)} className="button-normal">Back</button>
                    <AddPhoto setPhoto={(photo) => setPhoto(photo)} closeModal={() => setAddPhotoModal(false)} />
                </div>
                }
                {showPhotoModal &&
                <div className="modal-body">
                    <div><img src={photo} className="special-show-photo" alt="meal"/></div>
                    <button type="button" onClick={() => setShowPhotoModal(false)} className="button-normal">Back</button>
                    <button type="button" onClick={() => {setShowPhotoModal(false); setAddPhotoModal(true);}} className="button-normal">Change</button>
                </div>
                }
            </div>
        </div>
    );
};