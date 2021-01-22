import './nav-bar.scss';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logOut } from '../../common/actions/auth.actions';
import Logo from '../../images/logo.png';

export default function NavBar(props) {

    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogout = () => {
        dispatch(logOut());
        localStorage.clear();
        history.push('/');
    };

    return(
        <nav>
            {props.loggedIn ?
            <div className="nav-container">
                <button onClick={() => history.push('/profile')} className="nav-link">Profile</button> 
                <button onClick={handleLogout} className="nav-link">Logout</button>
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