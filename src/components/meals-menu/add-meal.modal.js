import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddPhoto from '../add-photo/add-photo';
import InputError from '../../components/common/input-error';
import SubmitButton from '../../components/common/submit-button';
import { addNewMealAPI } from '../../common/api/menu.api';

export default function AddMealModal(props) {
    
    const {register, handleSubmit, errors} = useForm();
    const [modalOpacity, setModalOpacity] = useState(0);
    const dispatch = useDispatch();
    const {meals, categories, loadingStatus} = useSelector(state => state.menu);
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [tagMessage, setTagMessage] = useState('');
    const [nameMessage, setNameMessage] = useState('');
    const [addPhotoModal, setAddPhotoModal] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [photo, setPhoto] = useState('');
    
    const newTagChange = (event) => {
        setNewTag(event.target.value);
    };

    const addTag = () => {
        let newTagTrimmed = newTag.trim().replace(/ /g,'');
        if(tags.includes(newTagTrimmed) || newTagTrimmed.length === 0){
            if(newTagTrimmed.length === 0){
                setTagMessage('Please enter valid tag name');
            }else{
                setTagMessage('Tag already exists');
            }
        }else{
            setTags([...tags, newTagTrimmed]);
            setTagMessage('');
        }  
    };

    const removeTag = (tag) => {
        setTags(tags.filter(tagItem => tagItem !== tag));
    };

    const addNewMeal = (data) => {
        data.name = data.name.trim();
        for(let i = 0; i < meals.length; i++){
            if(meals[i].name === data.name){
                setNameMessage('Meal name already exists');
                return;
            }
        }
        setNameMessage('');
        data.photo = photo;
        data.tags = tags;
        dispatch(addNewMealAPI(data, props.closeModal));
    };

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    return (
        <div className="modal">
            <div className="modal-overlay"></div>
            <div className="modal-container" style={{opacity:modalOpacity}}>
                <div className="modal-header">
                    <button onClick={props.closeModal} className="modal-x">x</button>
                </div>
             
                <div className="modal-body" style={{display: (!addPhotoModal && !showPhotoModal) ? 'block' : 'none'}}>
                    <form onSubmit={handleSubmit(addNewMeal)}>
                        <div className="label-accent-color">Name</div>
                        <input type="text" name="name" ref={register({required:true})}/>
                        {errors.name && <InputError text='Name is required'/>}
                        {nameMessage && <InputError text={nameMessage}/>}

                        <div className="label-accent-color">Description</div>
                        <textarea name="description" ref={register({required:true, minLength:20, maxLength:200})}/>
                        {errors.description && errors.description.type === "required" && <InputError text='Description is required'/>}
                        {errors.description && errors.description.type === "minLength" && <InputError text='Description should have minimum 20 characters'/>}
                        {errors.description && errors.description.type === "maxLength" && <InputError text='Description can have maximum 200 characters'/>}

                        <div className="label-accent-color">Category</div>
                        <select name="category" ref={register()}>
                            {categories.map((category,index) => 
                                <option key={index}>
                                    {category}
                                </option>
                            )}
                        </select>

                        <div className="label-accent-color">Price</div>
                        <input type="number" step="0.01" name="price" ref={register({required:true, min:0.01})}/>
                        {errors.price && <InputError text='Price is required'/>}

                        <div className="label-accent-color">Tags</div>
                        <div className="meals-menu-tags">
                            {tags.map((tag,index) => 
                                <div className="meals-menu-edit-tag" key={index}>#{tag}
                                <button type="button" onClick={() => removeTag(tag)} className="meals-menu-edit-tag-x">x</button>
                            </div>
                            )}
                        </div>
                        <input type="text" name="tag" onChange={newTagChange} style={{width:'50%'}} placeholder='Add new tag'/>
                        <button type="button" onClick={addTag} className="button-small">Add</button>
                        {tagMessage && <InputError text={tagMessage}/>}
                        
                        {photo ? 
                        <div>
                            <div className="label-accent-color">
                                Photo<button type="button" onClick={() => setShowPhotoModal(true)} className="button-small">See added photo</button>
                            </div>
                            <SubmitButton loadingStatus={loadingStatus} text='Add meal to menu'/>
                        </div>
                        :
                        <button type="button" onClick={() => setAddPhotoModal(true)} className="button-long">Add photo</button>   
                        }
                    </form>
                </div>

                {addPhotoModal &&
                <div className="modal-body">
                    <button type="button" onClick={() => setAddPhotoModal(false)} className="button-long">Back</button>
                    <AddPhoto setPhoto={(photo) => setPhoto(photo)} closeModal={() => setAddPhotoModal(false)} />
                </div>
                }
                {showPhotoModal &&
                <div className="modal-body">
                    <div><img src={photo} className="meals-menu-show-photo" alt="meal"/></div>
                    <button type="button" onClick={() => setShowPhotoModal(false)} className="button-normal">Back</button>
                    <button type="button" onClick={() => {setShowPhotoModal(false); setAddPhotoModal(true);}} className="button-normal">Change</button>
                </div>
                }
            </div>
        </div>
    );
};