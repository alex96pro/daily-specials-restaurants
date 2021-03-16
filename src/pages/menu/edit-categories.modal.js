import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCategoryAPI, deleteCategoryAPI} from '../../common/api/menu.api';
import { Select } from 'antd';
import InputError from '../../components/input-error';
import ConfirmButton from '../../components/confirm-button';

export default function EditCategoriesModal(props) {
    
    const dispatch = useDispatch();
    const [modalOpacity, setModalOpacity] = useState(0);
    const [newCategory, setNewCategory] = useState('');
    const {categories, meals, loadingStatus} = useSelector(state => state.menu);
    const [message, setMessage] = useState('');
    const [deleteWarning, setDeleteWarning] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);

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
        else if(newCategoryTrimmed.includes(',')){
            setMessage("Categories can't contain sign ','");
        }
        else{
            dispatch(addCategoryAPI(newCategoryTrimmed, props.closeModal));
            setMessage('');
            setNewCategory('');
        }
    };
    
    const checkDeleteCategory = () => {
        if(!deleteWarning){
            for(let i = 0; i < meals.length; i++) {
                if(meals[i].category === selectedCategory){
                    setDeleteWarning(true);
                    return;
                }
            }
        }
        if(selectedCategory === ""){
            return; // select with no options has empty string as option
        }
        dispatch(deleteCategoryAPI(selectedCategory, props.closeModal)); //close modal temporary because antd select shows delete value after deletion
        setDeleteWarning(false);
    };

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    return (
        <React.Fragment>
        <div className="modal-underlay" onClick={props.closeModal}></div>
        <div className="modal" style={{opacity:modalOpacity}}>
            <div className="modal-header">
                <i className="fas fa-times fa-2x" onClick={() => props.closeModal()}></i>
            </div>
                <div className="modal-body-vertical">
                    <div className="form-container m-b-15">
                        <div className="label">Add new category</div>
                        <div className="flex-row">
                            <input name="category" value={newCategory} onChange={changeCategory} type="text" className="app-input input-with-icon"/>
                            <ConfirmButton className="button-for-input" onClick={addCategory} loadingStatus={loadingStatus} text='Add'/>
                        </div>
                        {message && <InputError text={message}/>}
                    </div>
                    <div className="form-container m-b-15">
                        <div className="label">Delete category</div>
                            <div className="flex-row">
                                <Select onChange={(selected) => setSelectedCategory(selected)} defaultValue={categories[0]}>
                                    {categories.map((category, index) => 
                                    <Select.Option value={category} key={index}>
                                        {category}
                                    </Select.Option>)}
                                </Select>
                                <ConfirmButton onClick={checkDeleteCategory} loadingStatus={loadingStatus} text='Delete' className="button-for-input"/>
                            </div>
                            {deleteWarning &&
                            <div className="message-danger">
                                You have meals in this category. Deleting category will result in affected meals having no category
                                <div>
                                    <button onClick={() => setDeleteWarning(false)} className="button-normal">Cancel</button>
                                    <ConfirmButton onClick={checkDeleteCategory} loadingStatus={loadingStatus} text='Delete' className="button-normal"/>
                                </div>
                            </div>}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};