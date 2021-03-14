import './forgotten-password.page.scss';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { newPasswordAPI } from '../../common/api/auth.api';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import SubmitButton from '../../components/submit-button';
import NavBar from '../../components/nav-bar/nav-bar';
import InputError from '../../components/input-error';
import MessageDanger from '../../components/message-danger';

export default function ForgottenPassword() {

    const params = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const {loadingStatus} = useSelector(state => state.authentication);
    const {register, handleSubmit, errors} = useForm();
    const [message, setMessage] = useState({text: '', success: false});
    
    const setNewMessage = (newMessage, newSuccess = false) => {
        setMessage({text: newMessage, success: newSuccess});
    };
    const handleNewPassword = (data) => {
        if(data.newPassword !== data.retypeNewPassword){
            setMessage({text: "Passwords don't match", success: false});
        }else{
            setMessage({text: "", success: false});
            dispatch(newPasswordAPI(data, params.id, setNewMessage));
        }
    };

    return (
        <div className="forgotten-password">
            <NavBar loggedIn={false}/>
            <div className="forgotten-password-container">
                {!message.success ?
                <form onSubmit={handleSubmit(handleNewPassword)}>
                    <div className="label">New password</div>
                    <input type="password" name="newPassword" ref={register({required:true})} className="app-input"/>
                    {errors.newPassword && <InputError text="New password is required"/>}
                    <div className="label">Retype new password</div>
                    <input type="password" name="retypeNewPassword" ref={register({required:true})} className="app-input"/>
                    {errors.retypeNewPassword && <InputError text="Retype new password"/>}
                    <SubmitButton loadingStatus={loadingStatus} text="Confirm" className="button-long"/>
                    {message.text && <MessageDanger text={message.text}/>}
                </form> :
                    <div>
                        <p className="message-success">{message.text}</p>
                        <button onClick={() => history.push('/login')} className="button-long">Log In</button>
                    </div>
                }
            </div>
        </div>
    );
};