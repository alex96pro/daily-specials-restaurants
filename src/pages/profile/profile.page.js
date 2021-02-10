import './profile.page.scss';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileAPI } from '../../common/api/auth.api';
import {DISTANCE, CURRENCY} from '../../util/consts';
import NavBar from '../../components/nav-bar/nav-bar';
import ChangePasswordModal from './change-password.modal';
import DisableDeliveryModal from './disable-delivery.modal';
import GoogleAutocomplete from '../../components/common/google-autocomplete';
import SubmitButton from '../../components/common/submit-button';
import InputError from '../../components/common/input-error';

export default function Profile() {

    const dispatch = useDispatch();
    const {restaurant, loadingStatus} = useSelector(state => state.authentication);
    const {register, handleSubmit, errors} = useForm({defaultValues:{name: restaurant.name, phone: restaurant.phone, deliveryMinimum: restaurant.deliveryMinimum, deliveryRange: restaurant.deliveryRange}});
    const [changePasswordModal, setChangePasswordModal] = useState(false);
    const [disableDeliveryModal, setDisableDeliveryModal] = useState(false);
    const [messageAddress, setMessageAddress] = useState('');
    const [messageName, setMessageName] = useState('');
    const [enabledDelivery, setEnabledDelivery] = useState(false);

    const setNewMessageName = (newMessage) => {
        setMessageName(newMessage);
    };

    const updateProfile = (data) => {
        let location = localStorage.getItem('ADDRESS');
        if(location && location === restaurant.location){
            setMessageAddress('Your restaurant is already in that location');
            localStorage.removeItem('POSITION');
            localStorage.removeItem('ADDRESS');
            document.getElementById('search-google-maps').value = '';
        }else{
            setMessageAddress('');
            dispatch(updateProfileAPI(data, setNewMessageName));
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
                            <input type="text" name="name" ref={register({required:true})}></input>
                            {messageName && <InputError text={messageName}/>}
                            {errors.name && <InputError text='Name is required'/>}
                        </div>
                        <div className="label-accent-color">
                            Location:
                            <GoogleAutocomplete placeholder={restaurant.location}/>
                        </div>
                        {messageAddress && <InputError text={messageAddress}/>}
                        <div className="label-accent-color">
                            Phone: 
                            <input type="text" name="phone" ref={register({required:true, pattern: /^\d+$/})}></input>
                            {errors.phone && errors.phone.type ==="required" && <InputError text='Phone is required'/>}
                            {errors.phone && errors.phone.type ==="pattern" && <InputError text='Phone number can contain numbers only'/>}
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
                                {errors.deliveryMinimum && <InputError text='Delivery minimum is required'/>}
                            </div>
                            <div className="label-accent-color">
                                Delivery range: ({DISTANCE})
                            </div>
                            <div>
                                <input type="number" name="deliveryRange" 
                                ref={register({required: enabledDelivery ? true : false, min: 1})} step="0.1"></input>
                                {errors.deliveryRange && <InputError text='Delivery range is required'/>}
                            </div> 
                        </React.Fragment>
                        }
                        <SubmitButton loadingStatus={loadingStatus} text='Save changes'/>
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