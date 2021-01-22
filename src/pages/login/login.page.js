import './login.page.scss';
import { useForm } from 'react-hook-form';
import NavBar from '../../components/nav-bar/nav-bar';
import SubmitButton from '../../components/common/submit-button';
import { useHistory } from 'react-router-dom';
import { logInAPI } from '../../common/api/auth.api';
import { useDispatch, useSelector } from 'react-redux';
import ForgottenPasswordModal from './forgotten-password.modal';
import { useState } from 'react';

export default function LoginRestaurant() {

    const {register, handleSubmit, errors} = useForm();
    const history = useHistory();
    const dispatch = useDispatch();
    const { loadingStatus, loginMessage } = useSelector(state => state.authentication);
    const [showModal, setShowModal] = useState(false);

    const handleLogIn = (data) => {
        dispatch(logInAPI(data, loginSuccess));
    };

    const closeModal = () => {
        setShowModal(false);
    }

    const loginSuccess = () => {
        history.push('/restaurant');
    }

    return(
        <div className="login-restaurant">
            <NavBar loggedIn={false}/>
            <div className="login-restaurant-container">
                <div className="form-container">
                    <div className="login-restaurant-header">Log in to your restaurant</div>
                    <form onSubmit={handleSubmit(handleLogIn)}>
                        <div className="label-accent-color">Email</div>
                        <input type="email" name="email" ref={register({required:true})}/>
                        {errors.email && <div className="message-danger">Email is required</div>}
                        <div className="label-accent-color">Password</div>
                        <input type="password" name="password" ref={register({required:true})}/>
                        {errors.password && <div className="message-danger">Password is required</div>}
                        <SubmitButton loadingStatus={loadingStatus} text="Log In"/>
                    </form>
                    {loginMessage && <div className="message-danger">{loginMessage}</div>}
                </div>
                <div><button onClick={() => setShowModal(true)} type="button" className="button-link">Forgot password?</button></div>
            </div>
            {showModal && <ForgottenPasswordModal closeModal={closeModal}/>}
        </div>
    );
};