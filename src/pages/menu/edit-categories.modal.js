import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCategoryAPI, deleteCategoryAPI} from '../../common/api/menu.api';
import InputError from '../../components/common/input-error';
import Loader from '../../components/common/loader';

export default function EditCategoriesModal(props) {
    
    const {register, handleSubmit} = useForm();
    const [modalOpacity, setModalOpacity] = useState(0);
    const [newCategory, setNewCategory] = useState('');
    const {categories, meals, loadingStatus} = useSelector(state => state.menu);
    const [message, setMessage] = useState('');
    const [deleteWarning, setDeleteWarning] = useState(false);
    const dispatch = useDispatch();

    const changeCategory = (event) => {
        setNewCategory(event.target.value);
    };

    const addCategory = () => {
        let newCategoryTrimmed = newCategory.trim();
        if(categories.includes(newCategoryTrimmed)){
            setMessage('You already have that category');
        }else if(newCategoryTrimmed.length === 0){
            setMessage('Enter category name');
        }
        else{
            dispatch(addCategoryAPI(newCategoryTrimmed));
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
                        <button type="button" onClick={addCategory} className="button-small">
                            {loadingStatus ? <Loader small={true}/> : 'Add'}
                        </button>
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
                            <button type="submit" className="button-small">
                            {loadingStatus ? <Loader small={true}/> : 'Delete'}
                            </button>
                            {deleteWarning &&
                            <div className="label-accent-color">
                                You have meals in this category. Deleting category will result in affected meals having no category
                                <div>
                                    <button type="submit" className="button-small">
                                    {loadingStatus ? <Loader small={true}/> : 'Delete'}
                                    </button>
                                    <button onClick={() => setDeleteWarning(false)} className="button-small">Cancel</button>
                                </div>
                            </div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};