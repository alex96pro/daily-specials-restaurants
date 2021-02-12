import './change-password.page.scss';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { changePasswordAPI } from '../../common/api/auth.api';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logOut } from '../../common/actions/auth.actions';
import SubmitButton from '../../components/common/submit-button';
import InputError from '../../components/common/input-error';
import NavBar from '../../components/nav-bar/nav-bar';

export default function ChangePasswor(props) {
    
    const {register, handleSubmit, errors} = useForm();
    const [message, setMessage] = useState({text: '', success: false});
    const [messageMatch, setMessageMatch] = useState('');
    const {loadingStatus} = useSelector(state => state.authentication);
    const dispatch = useDispatch();
    const history = useHistory();

    const setNewMessage = (newMessage, newSuccess = false) => {
        setMessage({text: newMessage, success: newSuccess});
        if(newSuccess){
            history.push({pathname:'/login', message:'Successfully changed your password !'});
            dispatch(logOut());
        }
    };

    const handleChangePassword = (data) => {
        if(data.newPassword !== data.retypeNewPassword){
            setMessageMatch("Passwords don't match");
        }else{
            setMessageMatch("");
            dispatch(changePasswordAPI(data, setNewMessage));
        }
    };

    return (
        <div className="change-password">
            <NavBar loggedIn={true}/>
            <div className="change-password-container">
                <form onSubmit={handleSubmit(handleChangePassword)}>
                    <div className="label-accent-color">Old password</div>
                    <input type="password" name="oldPassword" ref={register({required:true})}/>
                    {errors.oldPassword && <InputError text={'Old password is required'}/>}
                    {message.text && <InputError text={message.text}/>}

                    <div className="label-accent-color">New password</div>
                    <input type="password" name="newPassword" ref={register({required:true})}/>
                    {errors.newPassword && <InputError text={'New password is required'}/>}
                    {messageMatch && <InputError text={messageMatch}/>}

                    <div className="label-accent-color">Retype new password</div>
                    <input type="password" name="retypeNewPassword" ref={register({required:true})}/>
                    {errors.retypeNewPassword && <InputError text={'Retype new password'}/>}
                    {messageMatch && <InputError text={messageMatch}/>}

                    <SubmitButton loadingStatus={loadingStatus} text="Confirm"/>
                </form>
            </div>
        </div>
    );
};