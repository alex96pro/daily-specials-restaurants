import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CURRENCY } from '../../util/consts';
import { editMenuMealAPI } from '../../common/api/menu.api';
import { checkTag } from '../../util/functions';
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
    const [changePhotoModal, setChangePhotoModal] = useState(false);
    const [photo, setPhoto] = useState('');
    const {register, handleSubmit, errors} = useForm({defaultValues:{
        name:props.meal.name, description:props.meal.description, category:props.meal.category, price:props.meal.price
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

    const addTag = () => {
        checkTag(newTag, tags, setTags, setTagMessage);  
    };

    const removeTag = (tag) => {
        setTags(tags.filter(tagItem => tagItem !== tag));
    };

    const editMeal = (data) => {
        data.name = data.name.trim();
        for(let i = 0; i < meals.length; i++){
            if(meals[i].name === data.name && meals[i].mealId !== props.meal.mealId){
                setNameMessage('Meal name already exists');
                return;
            }
        }
        if(photo){
            data.newPhoto = photo;
        }
        data.tags = tags;
        data.photo = props.meal.photo;
        data.mealId = props.meal.mealId;
        // check if there is need to call api for changing this meal
        let editedMeal = false;
        if(props.meal.name === data.name && props.meal.description === data.description && props.meal.price === +data.price && props.meal.category === data.category && props.meal.tags.length === data.tags.length && !photo){
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
    };

    return (
        <div className="modal">
            <div className="modal-underlay" onClick={props.closeModal}></div>
            <div className="modal-container-double" style={{opacity:modalOpacity}}>
                <div className="modal-header">
                    <button onClick={props.closeModal} className="modal-x">x</button>
                </div>
                <div className="modal-body">
                    {props.meal.photo && !changePhotoModal?
                    <div className="edit-meal-photo-container">
                        <img src={photo || props.meal.photo} alt="Loading..." className="edit-meal-photo"/>
                        <button onClick={() => setChangePhotoModal(true)} className="button-normal">Change photo</button>
                    </div>
                    :
                    <AddPhoto setPhoto={(photo) => {setPhoto(photo); setChangePhotoModal(false)}} showCancel={true} 
                    cancel={() => setChangePhotoModal(false)}/>
                    }
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit(editMeal)}>
                        <div className="label-accent-color">Name</div>
                        <input type="text" name="name" ref={register({required:true, maxLength:50})}/>
                        {errors.name && errors.name.type === "required" && <InputError text='Name is required'/>}
                        {errors.name && errors.name.type === "maxLength" && <InputError text='Name is limited to 50 characters'/>}
                        {nameMessage && <InputError text={nameMessage}/>}

                        <div className="label-accent-color">Description</div>
                        <textarea name="description" ref={register({required:true, minLength:10, maxLength:200})}/>
                        {errors.description && errors.description.type === "required" && <InputError text='Description is required'/>}
                        {errors.description && errors.description.type === "minLength" && <InputError text='Description should have minimum 10 characters'/>}
                        {errors.description && errors.description.type === "maxLength" && <InputError text='Description can have maximum 200 characters'/>}

                        <div className="label-accent-color">Category</div>
                        <select name="category" ref={register()}>
                            {categories.map((category,index) => 
                                <option key={index}>
                                    {category}
                                </option>
                            )}
                        </select>

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
                        <input type="text" name="tag" value={newTag} onChange={changeNewTag} placeholder='Add new tag' style={{width:'16rem'}}/>
                        <button type="button" onClick={addTag} className="button-small">Add</button>
                        {tagMessage && <InputError text={tagMessage}/>}
                        <SubmitButton loadingStatus={loadingStatus} text='Save changes'/>
                    </form>
                </div>
            </div>   
    </div>
    );
};