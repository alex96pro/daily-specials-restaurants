import './login.page.scss';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { logInAPI } from '../../common/api/auth.api';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import NavBar from '../../components/nav-bar/nav-bar';
import SubmitButton from '../../components/submit-button';
import ForgottenPasswordModal from './forgotten-password.modal';
import MessageDanger from '../../components/message-danger';
import MessageSuccess from '../../components/message-success';
import InputError from '../../components/input-error';

export default function Login() {

    const history = useHistory();
    const dispatch = useDispatch();
    const {register, handleSubmit, errors} = useForm();
    const {loadingStatus} = useSelector(state => state.authentication);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const setNewMessage = (newMessage) => {
        setMessage(newMessage);
    };

    const handleLogIn = (data) => {
        dispatch(logInAPI(data, loginSuccess, setNewMessage));
    };

    const loginSuccess = () => {
        history.push('/dashboard');
    };

    useEffect(() => {
        if(localStorage.getItem('ACCESS_TOKEN_RESTAURANT')){
            history.push('/dashboard');
        }
    }, [history]);

    return(
        <div className="login">
            <NavBar loggedIn={false}/>
            <div className="login-container">
                <div className="form-container">
                    <div className="login-header">Log in to your restaurant</div>
                    <form onSubmit={handleSubmit(handleLogIn)}>
                        <div className="label">Email</div>
                        <input type="email" name="email" ref={register({required:true})}/>
                        {errors.email && <InputError text="Email is required"/>}
                        <div className="label">Password</div>
                        <input type="password" name="password" ref={register({required:true})}/>
                        {errors.password && <InputError text="Password is required"/>}
                        {message && <MessageDanger text={message}/>}
                        <SubmitButton loadingStatus={loadingStatus} text="Log In"/>
                        {history.location.message && <MessageSuccess text={history.location.message}/>}
                    </form>
                </div>
                <div><button onClick={() => setShowModal(true)} type="button" className="button-link">Forgot password?</button></div>
            </div>
            {showModal && <ForgottenPasswordModal closeModal={() => setShowModal(false)}/>}
        </div>
    );
};