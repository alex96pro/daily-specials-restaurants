import './nav-bar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logOut } from '../../common/actions/auth.actions';
import React, { useState, useEffect } from 'react';
import Logo from '../../images/logo.png';

export default function NavBar(props) {

    const dispatch = useDispatch();
    const history = useHistory();
    const [currentPage, setCurrentPage] = useState('');
    const [mobileNavBar, setMobileNavBar] = useState(false);
    const {newOrdersCount} = useSelector(state => state.orders);

    const handleLogout = () => {
        dispatch(logOut());
        localStorage.removeItem('ACCESS_TOKEN_RESTAURANT');
        localStorage.removeItem('RESTAURANT_ID');
        history.push('/');
    };

    const handleRedirect = (path) => {
        history.push(path);
        if(mobileNavBar){
            setMobileNavBar(false);
        }
    };

    useEffect(() => {
        setCurrentPage(history.location.pathname);
    },[history.location.pathname]);

    return(
        <nav className={props.loggedIn ? mobileNavBar ? 'mobile-nav-bar' : 'nav' : 'nav-horizontal'} id="nav-bar">
            {props.loggedIn &&
            <div className={props.loggedIn ? "nav-container" : "nav-container-horizontal"}>
                <button className={currentPage==="/menu" ? "nav-card-active" : mobileNavBar ? "nav-card-mobile" : "nav-card"} onClick={() => handleRedirect('/menu')}>Menu</button>
                <button className={currentPage==="/specials" ? "nav-card-active" : mobileNavBar ? "nav-card-mobile" : "nav-card"} onClick={() => handleRedirect('/specials')}>Specials</button>
                <button className={currentPage==="/modifiers" ? "nav-card-active" : mobileNavBar ? "nav-card-mobile" : "nav-card"} onClick={() => handleRedirect('/modifiers')}>Modifiers</button>
                <button className={currentPage==="/orders" ? "nav-card-active" : mobileNavBar ? "nav-card-mobile" : "nav-card"} onClick={() => handleRedirect('/orders')}>
                    Orders{newOrdersCount > 0 && <label className="new-orders-count" onClick={() => handleRedirect('/orders')}>{newOrdersCount}</label>}
                </button>
                <button className={currentPage==="/profile" ? "nav-card-active" : mobileNavBar ? "nav-card-mobile" : "nav-card"} onClick={() => handleRedirect('/profile')}>Profile</button>
                <button className={currentPage==="/working-hours" ? "nav-card-active" : mobileNavBar ? "nav-card-mobile" : "nav-card"} onClick={() => handleRedirect('/working-hours')}>Working hours</button>
                <button className={currentPage==="/change-password" ? "nav-card-active" : mobileNavBar ? "nav-card-mobile" : "nav-card"} onClick={() => handleRedirect('/change-password')}>Change password</button>
                <button className={mobileNavBar ? "nav-card-mobile" : "nav-card"} onClick={handleLogout}>Log out</button>
            </div>
            }
            <img src={Logo} alt="logo" className="nav-logo"/>
            {props.loggedIn && 
            <div className="mobile-burger-menu">
                <i className="fas fa-bars fa-4x" onClick={() => setMobileNavBar(!mobileNavBar)}></i>
            </div>
            }
        </nav>
    );
};