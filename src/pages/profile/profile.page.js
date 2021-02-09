import './profile.page.scss';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import NavBar from '../../components/nav-bar/nav-bar';
import {DISTANCE, CURRENCY} from '../../util/consts';
import ChangePasswordModal from './change-password.modal';
import DisableDeliveryModal from './disable-delivery.modal';
import GoogleAutocomplete from '../../components/common/google-autocomplete';
import SubmitButton from '../../components/common/submit-button';
import MessageDanger from '../../components/common/message-danger';
import MessageSuccess from '../../components/common/message-success';
import { updateProfileAPI } from '../../common/api/auth.api';
import InputError from '../../components/common/input-error';

export default function Profile() {

    const dispatch = useDispatch();
    const {restaurant, loadingStatus} = useSelector(state => state.authentication);
    const {register, handleSubmit, errors} = useForm({defaultValues:{name: restaurant.name, phone: restaurant.phone, deliveryMinimum: restaurant.deliveryMinimum, deliveryRange: restaurant.deliveryRange}});
    const [changePasswordModal, setChangePasswordModal] = useState(false);
    const [disableDeliveryModal, setDisableDeliveryModal] = useState(false);
    const [message, setMessage] = useState({text: '', success: false});
    const [enabledDelivery, setEnabledDelivery] = useState(false);

    const setNewMessage = (newMessage, newSuccess) => {
        setMessage({text: newMessage, success: newSuccess});
    };

    const updateProfile = (data) => {
        let location = localStorage.getItem('ADDRESS');
        if(location && location === restaurant.location){
            setMessage({text: 'Your restaurant is already in that location', success: false});
            localStorage.removeItem('POSITION');
            localStorage.removeItem('ADDRESS');
            document.getElementById('search-google-maps').value = '';
        }else{
            setMessage({text: '', success: false});
            dispatch(updateProfileAPI(data, setNewMessage));
        }
    };

    const enableDelivery = (event) => {
        if(event.target.checked){
            setEnabledDelivery(true);
        }else{
            setEnabledDelivery(false);
        }
    };

    return(
        <div className="profile">
            <NavBar loggedIn={true}/>
            <div className="profile-container">
                <div className="header-accent-color">Your restaurant profile</div>
                <div className="profile-info">
                    <form onSubmit={handleSubmit(updateProfile)}>
                        <div className="label-accent-color">
                            Name:
                            <input type="text" name="name" ref={register()}></input>
                        </div>
                        <div className="label-accent-color">
                            Location:
                            <GoogleAutocomplete placeholder={restaurant.location}/>
                        </div>
                        <div className="label-accent-color">
                            Phone: 
                            <input type="text" name="phone" ref={register({pattern: /^\d+$/})}></input>
                            {errors.phone && <InputError text='Phone number can contain numbers only'/>}
                        </div>
                        {!restaurant.delivery &&
                            <div className="label-accent-color">
                                Enable delivery<input type="checkbox" name="delivery" ref={register()} value={enabledDelivery} onChange={enableDelivery}/>
                            </div>
                        }
                        {(restaurant.delivery || enabledDelivery ) &&
                        <React.Fragment> 
                            <div className="label-accent-color">
                                Delivery minimum: ({CURRENCY})
                            </div>
                            <div>
                                <input type="number" name="deliveryMinimum" 
                                ref={register({required: enabledDelivery ? true : false})} step="0.01"></input>
                            </div>
                            <div className="label-accent-color">
                                Delivery range: ({DISTANCE})
                            </div>
                            <div>
                                <input type="number" name="deliveryRange" 
                                ref={register({required: enabledDelivery ? true : false, min: 1})} step="0.1"></input>
                            </div> 
                        </React.Fragment>
                        }
                        <SubmitButton loadingStatus={loadingStatus} text='Save changes'/>
                        {message.text && !message.success && <MessageDanger text={message.text}/>}
                        {message.text && message.success && <MessageSuccess text={message.text}/>}
                    </form>
                </div>
                <button className="button-link" type="button" onClick={() => setDisableDeliveryModal(true)}>Disable delivery</button>
                <button className="button-link" type="button" onClick={() => setChangePasswordModal(true)}>Change password</button>
            </div>
            {changePasswordModal && <ChangePasswordModal closeModal={() => setChangePasswordModal(false)}/>}
            {disableDeliveryModal && <DisableDeliveryModal closeModal={() => setDisableDeliveryModal(false)} hideDeliveryFields={() => setEnabledDelivery(false)}/>}
        </div>
    );
};