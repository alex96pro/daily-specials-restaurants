import NavBar from '../../components/nav-bar/nav-bar';
import './restaurant.page.scss';

export default function Restaurant() {
    return (
        <div className="restaurant">
            <NavBar loggedIn={true}/>
            <div className="restaurant-buttons">
                <button className="button-long">
                    Menu
                </button>
                <button className="button-long">
                    Specials
                </button>
                <button className="button-long">
                    Orders
                </button>
            </div>
        </div>
    );
}