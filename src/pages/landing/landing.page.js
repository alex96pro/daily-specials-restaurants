import './landing.page.scss';
import NavBar from '../../components/nav-bar/nav-bar';
import { useHistory } from 'react-router-dom';

export default function Landing() {

    const history = useHistory();
    
    return (
    <div className="landing">
        <NavBar loggedIn={false}/>
        <button onClick={() => history.push('/login')} className="landing-button">Log In</button>
        <button onClick={() => history.push('/sign-up')} className="landing-button">Sign Up</button>
    </div>
    );
    
}