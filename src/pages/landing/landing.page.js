import './landing.page.scss';
import { useHistory } from 'react-router-dom';
import NavBar from '../../components/nav-bar/nav-bar';

export default function Landing() {

    const history = useHistory();

    return (
    <div className="landing">
        <NavBar loggedIn={false}/>
        <div>
            <div className="landing-punchline">Make your restaurant alive.</div>
            <div className="landing-buttons">
                <button onClick={() => history.push('/login')} className="landing-button">Log In</button>
                <button onClick={() => history.push('/sign-up')} className="landing-button">Sign Up</button>
                {history.location.message && <div className="message-success">{history.location.message}</div>}
            </div>
        </div>
    </div>
    );
    
}