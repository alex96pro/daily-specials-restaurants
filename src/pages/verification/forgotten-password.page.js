import './verify-account.page.scss';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { newPasswordAPI } from '../../common/api/auth.api';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import SubmitButton from '../../components/common/submit-button';
import NavBar from '../../components/nav-bar/nav-bar';

export default function ForgottenPasswordRestaurant() {

    const params = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const {loadingStatus, newPasswordMessage} = useSelector(state => state.auth);
    const {register, handleSubmit, errors} = useForm();
    const [message, setMessage] = useState('');
    
    const handleNewPassword = (data) => {
        if(data.newPassword !== data.retypeNewPassword){
            setMessage("Passwords don't match");
        }else{
            setMessage('');
            dispatch(newPasswordAPI(data, params.id));
        }
    };

    return (
        <div className="verify-account">
            <NavBar loggedIn={false}/>
                <div className="wrapper-container">
                    {!newPasswordMessage ?
                    <form onSubmit={handleSubmit(handleNewPassword)}>
                        <div className="label-accent-color">New password</div>
                        <input type="password" name="newPassword" ref={register({required:true})}/>
                        {errors.newPassword && <p className="message-danger">New password is required</p>}
                        <div className="label-accent-color">Retype new password</div>
                        <input type="password" name="retypeNewPassword" ref={register({required:true})}/>
                        {errors.retypeNewPassword && <p className="message-danger">Retype new password</p>}
                        <SubmitButton loadingStatus={loadingStatus} text="Confirm"/>
                        {message && <p className="message-danger">{message}</p>}
                    </form> :   
                        <div>
                            <p className="message-success">{newPasswordMessage}</p>
                            <button onClick={() => history.push('/login-restaurant')} className="button-long">Log In</button>
                        </div>
                    }
                </div>
        </div>
    );
};