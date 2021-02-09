import './landing.page.scss';
import NavBar from '../../components/nav-bar/nav-bar';
import { useHistory } from 'react-router-dom';
import { PUNCHLINES } from '../../util/consts';
import { useState, useEffect, useRef } from 'react';


export default function Landing() {

    const history = useHistory();
    const [currentPunchline, setCurrentPunchline] = useState(0);
    const currentPunchlineRef = useRef(currentPunchline);
    const setCurrentPunchlineRef = data => {
        currentPunchlineRef.current = data;
        setCurrentPunchline(data);
    };

    const changePunchline = () => {
        if(currentPunchlineRef.current === PUNCHLINES.length - 1){
            setCurrentPunchlineRef(0);
        }else{
            setCurrentPunchlineRef(currentPunchlineRef.current + 1);
        }
        let element = document.getElementById('landing-punchline');
        if(element){
            element.style.opacity = 1;
            setTimeout(() => {
                let element = document.getElementById('landing-punchline');
                if(element){
                    element.style.opacity = 0;
                }
            }, 3000);
        }
    };

    useEffect(() => {
        changePunchline(); // show first (index 1) punchline so there is no empty punchline at the beggining for 3,5s
        let handle = setInterval(changePunchline, 3500);
        return () => {
            clearInterval(handle);
        }
        // eslint-disable-next-line
    }, []);

    return (
    <div className="landing">
        <NavBar loggedIn={false}/>
        <div className="landing-container">
            <div className="landing-punchlines">
                <div className="landing-punchline" id="landing-punchline">
                    {PUNCHLINES[currentPunchline]}
                </div>
            </div>
            <div className="landing-buttons">
                <button onClick={() => history.push('/login')} className="landing-button">Log In</button>
                <button onClick={() => history.push('/sign-up')} className="landing-button">Sign Up</button>
                {history.location.message && <div className="message-success">{history.location.message}</div>}
            </div>
        </div>
    </div>
    );
    
}