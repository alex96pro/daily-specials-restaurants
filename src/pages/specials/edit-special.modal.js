import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { CURRENCY } from '../../util/consts';
import { editSpecialAPI } from '../../common/api/specials.api';
import { checkTag } from '../../util/functions';
import { infoToast } from '../../util/toasts/toasts';
import SubmitButton from '../../components/common/submit-button';
import InputError from '../../components/common/input-error';

export default function EditSpecialModal(props) {
   
    const dispatch = useDispatch();
    const [modalOpacity, setModalOpacity] = useState(0);
    const {specials, loadingStatus} = useSelector(state => state.specials);
    const [tags, setTags] = useState([...props.special.tags]);
    const [newTag, setNewTag] = useState('');
    const [tagMessage, setTagMessage] = useState('');
    const [nameMessage, setNameMessage] = useState('');
    const {register, handleSubmit, errors} = useForm({defaultValues:{
        name:props.special.name, description:props.special.description, price:props.special.price
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
        checkTag(newTag, tags, setTags, setTagMessage);  
    };

    const removeTag = (tag) => {
        setTags(tags.filter(tagItem => tagItem !== tag));
    };

    const editSpecial = (data) => {
        data.name = data.name.trim();
        for(let i = 0; i < specials.length; i++){
            if(specials[i].name === data.name && specials[i].specialId !== props.special.specialId){
                setNameMessage('Name already exists');
                return;
            }
        }
        data.tags = tags;
        data.specialId = props.special.specialId;
        // check if there is need to call api for changing this special
        let editedMeal = false;
        if(props.special.name === data.name && props.special.description === data.description && props.special.price === +data.price && props.special.tags.length === data.tags.length){
            for(let i = 0; i < data.tags.length; i++) {
                if(data.tags[i] !== props.special.tags[i]){
                    editedMeal = true;
                    break;
                }
            }
        }else{
            editedMeal = true;
        }
        if(editedMeal){
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
            <div className="modal-container" style={{opacity:modalOpacity}}>
                <div className="modal-header">
                    <button onClick={props.closeModal} className="modal-x">x</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit(editSpecial)}>
                        <label className="label-accent-color">Name</label>
                        <input type="text" name="name" ref={register({required: true, maxLength:50})}/>
                        {errors.name && errors.name.type === "required" && <InputError text="Name is required"/>}
                        {errors.name && errors.name.type === "maxLength" && <InputError text="Name is limited to 50 characters"/>}
                        {nameMessage && <InputError text={nameMessage}/>}
                        <label className="label-accent-color">Description</label>
                        <textarea name="description" ref={register({required: true, minLength: 10, maxLength: 200})}/>
                        {errors.description && errors.description.type === "required" && <InputError text="Description is required"/>}
                        {errors.description && errors.description.type === "minLength" &&<InputError text="Description minimum is 10 characters"/>}
                        {errors.description && errors.description.type === "maxLength" &&<InputError text="Description maximum is 200 characters"/>}
                        <div className="label-accent-color">Price ({CURRENCY})</div>
                        <input type="number" name="price" step="0.01" ref={register({required: true, min: 0.01})}/>
                        {errors.price && <InputError text="Price is required"/>}

                        <div className="label-accent-color">Tags</div>
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