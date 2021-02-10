import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { forgottenPasswordAPI } from '../../common/api/auth.api';
import { useDispatch, useSelector } from 'react-redux';
import SubmitButton from '../../components/common/submit-button';
import InputError from '../../components/common/input-error';

export default function ForgottenPasswordRestaurantModal(props) {
    
    const {register, handleSubmit, errors} = useForm();
    const [modalOpacity, setModalOpacity] = useState(0);
    const {loadingStatus} = useSelector(state => state.authentication);
    const [message, setMessage] = useState({text:'', success:false});
    const dispatch = useDispatch();

    const setNewMessage = (newMessage, newSuccess = false) => {
        setMessage({text: newMessage, success: newSuccess});
    };

    const submitEmail = (data) => {
        dispatch(forgottenPasswordAPI(data, setNewMessage));
    };

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    return (
        <div className="modal">
            <div className="modal-overlay" onClick={props.closeModal}></div>
            <div className="modal-container" style={{opacity:modalOpacity}}>
                <div className="modal-header">
                    <button onClick={props.closeModal} className="modal-x">x</button>
                </div>
                <div className="modal-body">
                    {!message.success && 
                        <form onSubmit={handleSubmit(submitEmail)}>
                            <div className="label-accent-color">Please enter your e-mail address and we will send you a link to change your password</div>
                            <input type="email" name="email" ref={register({required:true})}/>
                            {errors.email && <InputError text="Email is required"/>}
                            <SubmitButton loadingStatus={loadingStatus} text="Send"/>
                        </form>
                    }
                    {message.text && <p className={message.success? "message-success" : "message-danger"}>{message.text}</p>}
                    {message.success && <button onClick={props.closeModal} className="button-long">OK</button>}
                </div>
            </div>
        </div>
    );
};