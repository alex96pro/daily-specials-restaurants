import './dashboard.page.scss';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NavBar from '../../components/nav-bar/nav-bar';

export default function DashBoard() {

    const [showWelcome, setShowWelcome] = useState(false);
    const { logo, name } = useSelector(state => state.authentication.restaurant);

    useEffect(() => {
        let handle = setTimeout(() => setShowWelcome(true), 1000);
        return () => {
            clearTimeout(handle);
        }
    }, []);

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