import './profile.page.scss';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileAPI } from '../../common/api/auth.api';
import { infoToast } from '../../util/toasts/toasts';
import {DISTANCE, CURRENCY} from '../../util/consts';
import NavBar from '../../components/nav-bar/nav-bar';
import DisableDeliveryModal from './disable-delivery.modal';
import AddLogoModal from './add-logo.modal';
import GoogleAutocomplete from '../../components/google-autocomplete';
import SubmitButton from '../../components/submit-button';
import InputError from '../../components/input-error';

export default function Profile() {

    const dispatch = useDispatch();
    const {restaurant, loadingStatus} = useSelector(state => state.authentication);
    const {register, handleSubmit, errors} = useForm({defaultValues:{name: restaurant.name, phone: restaurant.phone, deliveryMinimum: restaurant.deliveryMinimum, deliveryRange: restaurant.deliveryRange}});
    const [disableDeliveryModal, setDisableDeliveryModal] = useState(false);
    const [messageAddress, setMessageAddress] = useState('');
    const [messageName, setMessageName] = useState('');
    const [enabledDelivery, setEnabledDelivery] = useState(false);
    const [addLogoModal, setAddLogoModal] = useState(false);
    const [photoData, setPhotoData] = useState({photo:'', photoCropped: true, changePhoto: false, message:''});

    const setNewMessageName = (newMessage, success = false) => {
        setMessageName(newMessage);
        if(success){
            setPhotoData({photo:'', photoCropped: true, changePhoto: false, message:''});
        }
    };

    const updateProfile = (data) => {
        let location = localStorage.getItem('ADDRESS');
        //check if anyhing changed
        if(!location && data.name === restaurant.name && data.phone === restaurant.phone && !photoData.photo){
            if(data.deliveryMinimum && +data.deliveryMinimum === restaurant.deliveryMinimum && data.deliveryRange && +data.deliveryRange === restaurant.deliveryRange){
                infoToast('No changes');
                return;
            }
        }
        if(location && location === restaurant.location){
            setMessageAddress('Your restaurant is already in that location');
            localStorage.removeItem('POSITION');
            localStorage.removeItem('ADDRESS');
            document.getElementById('search-google-maps').value = '';
        }else{
            setMessageAddress('');
            data.logo = restaurant.logo; //restaurant already has logo or has no logo at all (null)
            if(photoData.photo){
                data.newLogo = photoData.photo; //restaurant set new logo
            }
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
                        {(restaurant.logo || photoData.photo ) ?
                            <img src={photoData.photo ? photoData.photo : restaurant.logo} alt="Loading..." className="profile-restaurant-logo"
                            onClick={() => setAddLogoModal(true)}/>
                            :
                            <div>
                                <label className="label-accent-color">Your restaurant has no logo</label>
                                <button type="button" onClick={() => setAddLogoModal(true)} className="button-small">Add logo</button>
                            </div>
                        }
                        <div className="label-accent-color-2">
                            Name:
                            <input type="text" name="name" ref={register({required:true})}></input>
                            {messageName && <InputError text={messageName}/>}
                            {errors.name && <InputError text='Name is required'/>}
                        </div>
                        <div className="label-accent-color-2">
                            Location:
                            <GoogleAutocomplete placeholder={restaurant.location}/>
                        </div>
                        {messageAddress && <InputError text={messageAddress}/>}
                        <div className="label-accent-color-2">
                            Phone: 
                            <input type="text" name="phone" ref={register({required:true, pattern: /^\d+$/})}></input>
                            {errors.phone && errors.phone.type ==="required" && <InputError text='Phone is required'/>}
                            {errors.phone && errors.phone.type ==="pattern" && <InputError text='Phone number can contain numbers only'/>}
                        </div>
                        {!restaurant.delivery &&
                            <div className="label-accent-color-2">
                                Enable delivery<input type="checkbox" name="delivery" ref={register()} value={enabledDelivery} onChange={enableDelivery}/>
                            </div>
                        }
                        {(restaurant.delivery || enabledDelivery ) &&
                        <React.Fragment> 
                            <div className="label-accent-color-2">
                                Delivery minimum: ({CURRENCY})
                            </div>
                            <div>
                                <input type="number" name="deliveryMinimum" 
                                ref={register({required: enabledDelivery ? true : false})} step="0.01"></input>
                                {errors.deliveryMinimum && <InputError text='Delivery minimum is required'/>}
                            </div>
                            <div className="label-accent-color-2">
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
            </div>
            {addLogoModal && <AddLogoModal photoData={photoData} setPhotoData={setPhotoData} closeModal={() => setAddLogoModal(false)}/>}
            {disableDeliveryModal && <DisableDeliveryModal closeModal={() => setDisableDeliveryModal(false)} hideDeliveryFields={() => setEnabledDelivery(false)}/>}
        </div>
    );
};