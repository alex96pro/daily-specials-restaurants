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
    const {newOrdersCount} = useSelector(state => state.orders);

    const handleLogout = () => {
        dispatch(logOut());
        localStorage.removeItem('ACCESS_TOKEN_RESTAURANT');
        localStorage.removeItem('RESTAURANT_ID');
        history.push('/');
    };

    useEffect(() => {
        setCurrentPage(history.location.pathname);
    },[history.location.pathname]);

    return(
        <nav className={props.loggedIn ? '' : 'nav-horizontal'}>
            {props.loggedIn &&
            <div className={props.loggedIn ? "nav-container" : "nav-container-horizontal"}>
                <button className={currentPage==="/menu" ? "nav-card-active" : "nav-card"} onClick={() => history.push('/menu')}>Menu</button>
                <button className={currentPage==="/specials" ? "nav-card-active" : "nav-card"} onClick={() => history.push('/specials')}>Specials</button>
                <button className={currentPage==="/modifiers" ? "nav-card-active" : "nav-card"} onClick={() => history.push('/modifiers')}>Modifiers</button>
                <button className={currentPage==="/orders" ? "nav-card-active" : "nav-card"} onClick={() => history.push('/orders')}>
                    {newOrdersCount > 0 && <label className="new-orders-count" onClick={() => history.push('/orders')}>{newOrdersCount}</label>} Orders
                </button>
                <button className={currentPage==="/profile" ? "nav-card-active" : "nav-card"} onClick={() => history.push('/profile')}>Profile</button>
                <button className={currentPage==="/working-hours" ? "nav-card-active" : "nav-card"} onClick={() => history.push('/working-hours')}>Working hours</button>
                <button className={currentPage==="/change-password" ? "nav-card-active" : "nav-card"} onClick={() => history.push('/change-password')}>Change password</button>
                <button className="nav-card" onClick={handleLogout}>Log out</button>
            </div>
            }
            <img src={Logo} alt="logo" className="nav-logo"/>
        </nav>
    );
};