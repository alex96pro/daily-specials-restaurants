import './menu.page.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getMenuAPI } from '../../common/api/menu.api';
import NavBar from '../../components/nav-bar/nav-bar';
import MealsMenu from '../../components/meals-menu/meals-menu';
import MessageDanger from '../../components/message-danger';
import EditCategoriesModal from './edit-categories.modal';
import Loader from '../../components/loader';

export default function Menu() {

    const dispatch = useDispatch();
    const history = useHistory();
    const {meals, categories, message, loadingMenuPage} = useSelector(state => state.menu);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [modal, setModal] = useState(false);
    const [messageNoCategories, setMessageNoCategories] = useState({show: false, text:''});
    const [showMobileFooter, setShowMobileFooter] = useState(false);

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

    const showOrHideMobileFooter = () => {
        let categories = document.getElementsByClassName('menu-side-bar')[0];
        if(categories){
            if(showMobileFooter){
                categories.style.visibility = "hidden";
                categories.style.top = '100vh';
            }else{
                categories.style.visibility = "visible";
                categories.style.top = '0';
            }
        }
        setShowMobileFooter(!showMobileFooter);
    };

    useEffect(() => {
        if(!localStorage.getItem('ACCESS_TOKEN_RESTAURANT')){
            history.push('/login');
            return;
        }
        dispatch(getMenuAPI(setMessages));
    },[dispatch, history]);

    return (
        <div className="menu">
            <NavBar loggedIn={true}/>
            {loadingMenuPage ? <Loader className="loader-center"/>
            :
            <div className="menu-container">
                <div className="menu-side-bar">
                    <div className="menu-side-bar-header">Menu categories</div>
                    <div className="menu-categories">
                    <i className="fas fa-edit fa-3x" onClick={() => setModal(true)}></i>
                    {messageNoCategories.show && categories.length === 0 && <MessageDanger text={messageNoCategories.text}/>}
                        {categories.map((category, index) => <div key={index}>
                            <label className="menu-category" htmlFor={`category${index}`}>
                                <input type="checkbox" value={category} onChange={addCategory} id={`category${index}`}/>
                                {category}
                            </label>
                        </div>)}
                            
                    </div>
                </div>
                <MealsMenu meals={meals} categories={categories} selectedCategories={selectedCategories}/>
                {message && <div className="header-accent-color">{message}</div>}      
            </div>
            }
            <button onClick={showOrHideMobileFooter} className="menu-footer-mobile">
                {showMobileFooter ? 'Back to menu' : 'Categories'}
            </button>
            {modal && <EditCategoriesModal closeModal={() => setModal(false)}/>}
        </div>
    );
};