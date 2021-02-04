import { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import NavBar from '../../components/nav-bar/nav-bar';
import {getMenuAPI} from '../../common/api/menu.api';
import './menu.page.scss';
import MealsMenu from '../../components/meals-menu/meals-menu.component';
import EditCategoriesModal from './edit-categories.modal';

export default function Menu() {

    const dispatch = useDispatch();
    const {meals, categories, message} = useSelector(state => state.menu);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [modals, setModals] = useState({editCategories: false, addNewMeal: false, editMeal: false, deleteMeal: false});

    const addCategory = (event) => {
        if(event.target.checked){
            setSelectedCategories([...selectedCategories, event.target.value]);
        }else{
            setSelectedCategories(selectedCategories.filter(category => category !== event.target.value));
        }
    }
    useEffect(() => {
        dispatch(getMenuAPI());
    },[dispatch]);

    return (
        <div className="menu">
            <NavBar loggedIn={true}/>
            <div className="menu-container">
                <div className="menu-side-bar">
                    <div className="menu-side-bar-header">Meal categories</div>
                    <button onClick={() => setModals({...modals, editCategories: true})} type="button" className="button-long">Edit categories</button>
                    <div className="menu-categories">
                        {categories.map((category, index) => <div className="menu-category" key={index}>
                            <input type="checkbox" value={category} onChange={addCategory}/>{category}
                        </div>)}
                    </div>
                </div>
                <MealsMenu meals={meals} categories={categories} selectedCategories={selectedCategories}/>
                {message && <div className="header-accent-color">{message}</div>}      
            </div>
            {modals.editCategories && <EditCategoriesModal closeModal={() => setModals({...modals, editCategories: false})}/>}
        </div>
    );
}