import './menu.page.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import {getMenuAPI} from '../../common/api/menu.api';
import NavBar from '../../components/nav-bar/nav-bar';
import MealsMenu from '../../components/meals-menu/meals-menu.component';
import MessageDanger from '../../components/common/message-danger';
import EditCategoriesModal from './edit-categories.modal';
import Loader from '../../components/common/loader';

export default function Menu() {

    const dispatch = useDispatch();
    const {meals, categories, message, loadingStatus} = useSelector(state => state.menu);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [modal, setModal] = useState(false);
    const [messageNoCategories, setMessageNoCategories] = useState({show: false, text:''});

    const addCategory = (event) => {
        if(event.target.checked){
            setSelectedCategories([...selectedCategories, event.target.value]);
        }else{
            setSelectedCategories(selectedCategories.filter(category => category !== event.target.value));
        }
    };

    const setMessages = (message) => {
        setMessageNoCategories({show: true, text: message});
    };

    useEffect(() => {
        dispatch(getMenuAPI(setMessages));
    },[dispatch]);

    return (
        <div className="menu">
            <NavBar loggedIn={true}/>
            {loadingStatus ? <Loader className="loader-center"/>
            :
            <div className="menu-container">
                <div className="menu-side-bar">
                    <div className="menu-side-bar-header">Meal categories</div>
                    <button onClick={() => setModal(true)} type="button" className="button-long">Edit categories</button>
                    <div className="menu-categories">
                    {messageNoCategories.show && categories.length === 0 && <MessageDanger text={messageNoCategories.text}/>}
                        {categories.map((category, index) => <div className="menu-category" key={index}>
                            <input type="checkbox" value={category} onChange={addCategory}/>{category}
                        </div>)}
                    </div>
                </div>
                <MealsMenu meals={meals} categories={categories} selectedCategories={selectedCategories}/>
                {message && <div className="header-accent-color">{message}</div>}      
            </div>
            }
            {modal && <EditCategoriesModal closeModal={() => setModal(false)}/>}
        </div>
    );
};