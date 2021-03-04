import './modifiers.page.scss';
import NavBar from '../../components/nav-bar/nav-bar';

export default function Modifiers() {

    return (
        <div className="modifiers">
            <NavBar loggedIn={true}/>
            <div className="modifiers-container">
                <div className="header">Hello from modifiers</div>
            </div>
        </div>
    );
};