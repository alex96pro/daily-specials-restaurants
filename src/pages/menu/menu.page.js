import './menu.page.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { getMenuAPI } from '../../common/api/menu.api';
import { Tooltip } from 'antd';
import { Checkbox } from 'antd';
import NavBar from '../../components/nav-bar/nav-bar';
import MealsMenu from '../../components/meals-menu/meals-menu';
import MessageDanger from '../../components/message-danger';
import EditCategoriesModal from './edit-categories.modal';
import Loader from '../../components/loader';

export default function Menu() {

    const dispatch = useDispatch();
    const {meals, categories, message, loadingMenuPage} = useSelector(state => state.menu);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [modal, setModal] = useState(false);
    const [messageNoCategories, setMessageNoCategories] = useState({show: false, text:''});
    const [showMobileFooter, setShowMobileFooter] = useState(false);

    const addCategory = (event, category) => {
        if(event.target.checked){
            setSelectedCategories([...selectedCategories, category]);
        }else{
            setSelectedCategories(selectedCategories.filter(categoryItem => categoryItem !== category));
        }
    };

    const setMessages = (message) => {
        setMessageNoCategories({show: true, text: message});
    };

    const showOrHideMobileFooter = () => {
        let categories = document.getElementsByClassName('menu-categories')[0];
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
        dispatch(getMenuAPI(setMessages));
    },[dispatch]);

    return (
        <div className="menu">
            <NavBar loggedIn={true}/>
            {loadingMenuPage ? <Loader className="loader-center"/>
            :
            <div className="menu-container">
                <div className="menu-categories">
                    <div className="flex-row">
                        <div className="header-small">Menu categories</div>
                        <Tooltip title="Edit categories">
                            <i className="fas fa-edit fa-3x" onClick={() => setModal(true)}></i>
                        </Tooltip>
                    </div>
                    {messageNoCategories.show && categories.length === 0 && <MessageDanger text={messageNoCategories.text}/>}
                    {categories.map((category, index) => <div key={index}>
                        <label className="menu-category" htmlFor={`category${index}`}>
                            <Checkbox onChange={(event) => addCategory(event,category)} id={`category${index}`}/>
                            {category}
                        </label>
                    </div>)}
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