import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCategoryAPI, deleteCategoryAPI} from '../../common/api/menu.api';
import InputError from '../../components/common/input-error';
import ConfirmButton from '../../components/common/confirm-button';
import SubmitButton from '../../components/common/submit-button';

export default function EditCategoriesModal(props) {
    
    const {register, handleSubmit} = useForm();
    const dispatch = useDispatch();
    const [modalOpacity, setModalOpacity] = useState(0);
    const [newCategory, setNewCategory] = useState('');
    const {categories, meals, loadingStatus} = useSelector(state => state.menu);
    const [message, setMessage] = useState('');
    const [deleteWarning, setDeleteWarning] = useState(false);

    const changeCategory = (event) => {
        setNewCategory(event.target.value);
    };

    const addCategory = () => {
        if(categories.length === 20){
            setMessage('Maximal number of categories is 20');
            return;
        }
        let newCategoryTrimmed = newCategory.trim();
        if(categories.includes(newCategoryTrimmed)){
            setMessage('You already have that category');
        }else if(newCategoryTrimmed.length === 0){
            setMessage('Enter category name');
        }else if(newCategoryTrimmed.length > 50){
            setMessage('Categories are limited to 50 characters');
        }
        else{
            dispatch(addCategoryAPI(newCategoryTrimmed, props.closeModal));
            setMessage('');
        }
    };
    
    const checkDeleteCategory = (data) => {
        if(!deleteWarning){
            for(let i = 0; i < meals.length; i++) {
                if(meals[i].category === data.category){
                    setDeleteWarning(true);
                    return;
                }
            }
        }
        dispatch(deleteCategoryAPI(data.category));
        setDeleteWarning(false);
    };

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    return (
        <div className="modal">
            <div className="modal-overlay" onClick={props.closeModal}></div>
            <div className="modal-container" style={{opacity:modalOpacity}}>
                <div className="modal-header">
                    <button onClick={props.closeModal} className="modal-x">x</button>
                </div>
                <div className="modal-body">
                    <div className="wrapper-container">
                        <div className="label-accent-color">Add new category</div>
                        <input name="category" value={newCategory} onChange={changeCategory} type="text" style={{width:'50%'}}/>
                        <ConfirmButton small={true} onClick={addCategory} loadingStatus={loadingStatus} text='Add'/>
                        {message && <InputError text={message}/>}
                    </div>
                    <div className="wrapper-container">
                        <div className="label-accent-color">Delete category</div>
                        <form onSubmit={handleSubmit(checkDeleteCategory)}>
                            <select name="category" ref={register()} style={{width:'50%'}} onChange={() => setDeleteWarning(false)}>
                                {categories.map((category, index) => <option value={category} key={index}>
                                    {category}
                                </option>)}
                            </select>
                            <SubmitButton small={true} loadingStatus={loadingStatus} text='Delete'/>
                            {deleteWarning &&
                            <div className="message-danger">
                                You have meals in this category. Deleting category will result in affected meals having no category
                                <div>
                                    <SubmitButton small={true} loadingStatus={loadingStatus} text='Delete'/>
                                    <button onClick={() => setDeleteWarning(false)} className="button-normal">Cancel</button>
                                </div>
                            </div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};