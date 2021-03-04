import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { disableDeliveryAPI } from '../../common/api/auth.api';
import { useDispatch, useSelector } from 'react-redux';
import SubmitButton from '../../components/submit-button';
import InputError from '../../components/input-error';

export default function DisableDeliveryModal(props) {
    
    const {register, handleSubmit, errors} = useForm();
    const [modalOpacity, setModalOpacity] = useState(0);
    const [message, setMessage] = useState('');
    const {loadingStatus} = useSelector(state => state.authentication);
    const dispatch = useDispatch();

    const setNewMessage = (newMessage, success = false) => {
        setMessage(newMessage);
        if(success){
            props.closeModal();
            props.hideDeliveryFields();
        }
    };

    const handleDisableDelivery = (data) => {
        dispatch(disableDeliveryAPI(data, setNewMessage));
    };

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    return (
        <React.Fragment>
        <div className="modal-underlay" onClick={props.closeModal}></div>
        <div className="modal" style={{opacity:modalOpacity}}>
        <div className="modal-header">
                    <i className="fas fa-times fa-2x" onClick={() => props.closeModal()}></i>
                </div>
            <div className="modal-body-vertical">
                
                    <div className="label">
                        In order to disable delivery for your restaurant please enter your password
                    </div>
                    <form onSubmit={handleSubmit(handleDisableDelivery)}>
                        <input type="password" name="password" ref={register({required:true})} placeholder="Your password here"/>
                        {errors.password && <InputError text={'Password is required'}/>}
                        {message && <InputError text={message}/>}
                        <SubmitButton loadingStatus={loadingStatus} text="Disable delivery"/>
                    </form>
            </div>
        </div>
        </React.Fragment>
    );
};