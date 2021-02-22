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
    const [dropDown, setDropDown] = useState(false);
    const logo = useSelector(state => state.authentication.restaurant.logo);

    const handleLogout = () => {
        dispatch(logOut());
        history.push('/');
    };

    useEffect(() => {
        setCurrentPage(history.location.pathname);
    },[history.location.pathname]);

    return(
        <nav>
            {props.loggedIn ?
            <div className="nav-container">
                <button className={currentPage==="/menu" ? "nav-card-active" : "nav-card"} onClick={() => history.push('/menu')}>Menu</button>
                <button className={currentPage==="/specials" ? "nav-card-active" : "nav-card"} onClick={() => history.push('/specials')}>Specials</button>
                <button className={currentPage==="/orders" ? "nav-card-active" : "nav-card"}>Orders</button>
                {logo ?
                <div className="nav-restaurant-logo-container">
                    <img src={logo} className="nav-restaurant-logo" alt="Loading..." onClick={() => setDropDown(!dropDown)}/>
                    <i className="fas fa-bars fa-2x bar-over-image" onClick={() => setDropDown(!dropDown)}></i>
                </div>
                :
                <i className="fas fa-bars fa-3x" onClick={() => setDropDown(!dropDown)}></i>
                }
                
                {dropDown &&
                <React.Fragment>
                <div className="drop-down-underlay" onClick={() => setDropDown(false)}> </div>
                <div className="drop-down">
                    <div className="drop-down-item" onClick={() => history.push('/profile')}>Profile</div>
                    <div className="drop-down-item" onClick={() => history.push('/working-hours')}>Working hours</div>
                    <div className="drop-down-item" onClick={() => history.push('/change-password')}>Change password</div>
                    <div className="drop-down-item" onClick={handleLogout}>Log out</div>
                </div>
                </React.Fragment>
                }
            </div>
            :
            <div className="nav-container">
                <button className="nav-link">How it works</button> 
                <button className="nav-link">About</button>
            </div>
            }
            <img src={Logo} alt="logo" className="logo"/>
        </nav>
    );
};