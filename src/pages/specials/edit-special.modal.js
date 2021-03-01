import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { CURRENCY } from '../../util/consts';
import { editSpecialAPI } from '../../common/api/specials.api';
import { checkTag } from '../../util/functions';
import { infoToast } from '../../util/toasts/toasts';
import SubmitButton from '../../components/submit-button';
import InputError from '../../components/input-error';
import AddPhoto from '../../components/add-photo/add-photo';

export default function EditSpecialModal(props) {
   
    const dispatch = useDispatch();
    const [modalOpacity, setModalOpacity] = useState(0);
    const {loadingStatus} = useSelector(state => state.specials);
    const [tags, setTags] = useState([...props.data.special.tags]);
    const [newTag, setNewTag] = useState('');
    const [tagMessage, setTagMessage] = useState('');
    const [photoData, setPhotoData] = useState({photo:'', photoCropped: true, changePhoto: false, message:''});
    const {register, handleSubmit, errors} = useForm({defaultValues:{
        name:props.data.special.name, description:props.data.special.description, price:props.data.special.price, time:props.data.special.time
    }});

    const changeNewTag = (event) => {
        if(event.target.value.length > 25){
            setTagMessage('Tag can contain maximum 25 characters');
            return;
        }
        setTagMessage('');
        setNewTag(event.target.value);
    };

    const addNewTag = () => {
        checkTag(newTag, setNewTag, tags, setTags, setTagMessage);  
    };

    const removeTag = (tag) => {
        setTags(tags.filter(tagItem => tagItem !== tag));
    };

    const editSpecial = (data) => {
        data.name = data.name.trim();
        data.tags = tags;
        data.specialId = props.data.special.specialId;
        if(props.data.today){ //input time is disabled, so we need to set data.time for form in order to check if something changed on meal edit
            data.time = props.data.special.time;
        }
        // check if there is need to call api for changing this special
        let editedMeal = false;
        let special = props.data.special;
        if(!photoData.photoCropped){
            setPhotoData({...photoData, message:'Please press button done to crop photo'});
            return;
        }
        if(photoData.photo){
            data.newPhoto = photoData.photo;
        }
        if(special.name === data.name && special.description === data.description && special.price === +data.price && special.tags.length === data.tags.length && special.time === data.time && !data.newPhoto){
            for(let i = 0; i < data.tags.length; i++) {
                if(data.tags[i] !== props.data.special.tags[i]){
                    editedMeal = true;
                    break;
                }
            }
        }else{
            editedMeal = true;
        }
        if(editedMeal){
            data.timestamp = props.data.date.dbFormat + ' ' + data.time;
            data.photo = props.data.special.photo; //old photo
            dispatch(editSpecialAPI(data, props.closeModal));
        }else{
            infoToast('No changes');
            props.closeModal();
        }
    };

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    return (
        <div className="modal">
            <div className="modal-underlay" onClick={props.closeModal}></div>
            <div className={props.data.today ? "modal-container" : "modal-container-double"} style={{opacity:modalOpacity}}>
                <div className="modal-header">
                    <i className="fas fa-times fa-2x" onClick={() => props.closeModal()}></i>
                </div>
                {!props.data.today && <div className="modal-body">
                {props.data.special.photo && !photoData.changePhoto ?
                    <div className="edit-special-photo-container">
                        <img src={photoData.photo || props.data.special.photo} alt="Loading..." className="edit-special-photo"/>
                        <button onClick={() => setPhotoData({...photoData, changePhoto: true})} className="button-normal">Change photo</button>
                    </div>
                    :
                    <AddPhoto photoData={photoData} setPhotoData={setPhotoData}/>
                    }
                </div>}
                <div className="modal-body">
                    <form onSubmit={handleSubmit(editSpecial)}>
                        <label className="label">Name</label>
                        <input type="text" name="name" ref={register({required: true, maxLength:50})}/>
                        {errors.name && errors.name.type === "required" && <InputError text="Name is required"/>}
                        {errors.name && errors.name.type === "maxLength" && <InputError text="Name is limited to 50 characters"/>}
                        <label className="label">Description</label>
                        <textarea name="description" ref={register({required: true, minLength: 10, maxLength: 200})}/>
                        {errors.description && errors.description.type === "required" && <InputError text="Description is required"/>}
                        {errors.description && errors.description.type === "minLength" &&<InputError text="Description minimum is 10 characters"/>}
                        {errors.description && errors.description.type === "maxLength" &&<InputError text="Description maximum is 200 characters"/>}
                        <div className="flex-space-between">
                            <div>
                                <div className="label">Price ({CURRENCY})</div>
                                <input type="number" name="price" step="0.01" ref={register({required: true, min: 0.01})}/>
                                {errors.price && <InputError text="Price is required"/>}
                            </div>
                            <div>
                                <div className="label">Date</div>
                                {props.data.today ? <div className="label">Today</div>
                                :
                                <div className="label">{props.data.date.value}</div>
                                }
                            </div>
                            <div>
                                <div className="label">Time</div>
                                <input type="time" name="time" ref={register()} className="special-input-time" disabled={props.data.today}/>
                            </div>
                        </div>
                        <div className="label">Tags</div>
                        <div className="tags">
                            {tags.map((tag, index) => <div className="tag-rounded" key={index}>
                                #{tag}<button type="button" onClick={() => removeTag(tag)} className="tag-button-x">x</button>
                            </div>)}
                        </div>
                        <input type="text" style={{width:'16rem'}} placeholder="Add new tag" value={newTag} onChange={changeNewTag}/>
                        <button onClick={addNewTag} type="button" className="button-small">Add</button>
                        {tagMessage && <InputError text={tagMessage}/>}
                        <SubmitButton loadingStatus={loadingStatus} text='Save changes'/>
                    </form>
                </div>
            </div>
        </div>
    );
};