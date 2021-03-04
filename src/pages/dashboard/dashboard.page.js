import './dashboard.page.scss';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NavBar from '../../components/nav-bar/nav-bar';

export default function DashBoard() {

    const history = useHistory();
    const [showWelcome, setShowWelcome] = useState(false);
    const { logo, name } = useSelector(state => state.authentication.restaurant);

    useEffect(() => {
        if(!localStorage.getItem('ACCESS_TOKEN_RESTAURANT')){
            history.push('/');
        }
        setTimeout(() => setShowWelcome(true), 1000);
    }, [history]);

    return(
        <div className="dashboard">
            <NavBar loggedIn={true}/>
            <div className="dashboard-container">
                <div className={showWelcome ? "dashboard-header" : "dashboard-header-hidden"}>Welcome {name}</div>
                <img src={logo} alt="Loading..." className="dashboard-restaurant-logo"/>
            </div>
        </div>
    );
};