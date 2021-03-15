import './profile.page.scss';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileAPI } from '../../common/api/auth.api';
import { infoToast } from '../../util/toasts/toasts';
import { DISTANCE, CURRENCY } from '../../util/consts';
import { Checkbox } from 'antd';
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

    useEffect(() => {
        return () => {
            localStorage.removeItem('POSITION');
            localStorage.removeItem('ADDRESS');
        };
    }, []);

    const setNewMessageName = (newMessage, success = false) => {
        setMessageName(newMessage);
        if(success){
            setPhotoData({photo:'', photoCropped: true, changePhoto: false, message:''});
        }
    };

    const updateProfile = (data) => {
        let location = localStorage.getItem('ADDRESS');
        //check if anything changed
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
            data.delivery = enabledDelivery;
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
                <div className="header">Profile</div>
                <div className="profile-info">
                    <form onSubmit={handleSubmit(updateProfile)}>
                        {(restaurant.logo || photoData.photo ) ?
                            <img src={photoData.photo ? photoData.photo : restaurant.logo} alt="Loading..." className="profile-restaurant-logo"
                            onClick={() => setAddLogoModal(true)}/>
                            :
                            <div>
                                <label className="label">Your restaurant has no logo</label>
                                <button type="button" onClick={() => setAddLogoModal(true)} className="button-small">Add logo</button>
                            </div>
                        }
                        <div className="label">
                            Name
                            <input type="text" name="name" ref={register({required:true})} className="app-input"/>
                            {messageName && <InputError text={messageName}/>}
                            {errors.name && <InputError text='Name is required'/>}
                        </div>
                        <div className="label">
                            Location
                            <GoogleAutocomplete placeholder={restaurant.location}/>
                        </div>
                        {messageAddress && <InputError text={messageAddress}/>}
                        <div className="label">
                            Phone
                            <input type="text" name="phone" ref={register({required:true, pattern: /^\d+$/})} className="app-input"/>
                            {errors.phone && errors.phone.type ==="required" && <InputError text='Phone is required'/>}
                            {errors.phone && errors.phone.type ==="pattern" && <InputError text='Phone number can contain numbers only'/>}
                        </div>
                        {!restaurant.delivery &&
                            <div className="label p-t-15 p-b-15">
                                Enable delivery<Checkbox onChange={enableDelivery} checked={restaurant.delivery || enabledDelivery}/>
                            </div>
                        }
                        {(restaurant.delivery || enabledDelivery ) &&
                        <React.Fragment> 
                            <div className="label">
                                Delivery minimum
                            </div>
                            <div className="flex-row">
                                <input type="number" name="deliveryMinimum" 
                                ref={register({required: enabledDelivery ? true : false})} step="0.01" className="app-input-number input-with-icon"/>
                                <span className="input-icon">{CURRENCY}</span>
                            </div>
                            {errors.deliveryMinimum && <InputError text='Delivery minimum is required'/>}
                            <div className="label">
                                Delivery range
                            </div>
                            <div className="flex-row">
                                <input type="number" name="deliveryRange" 
                                ref={register({required: enabledDelivery ? true : false, min: 1})} step="0.1" className="app-input-number input-with-icon"/>
                                <span className="input-icon">{DISTANCE}</span>
                            </div>
                            {errors.deliveryRange && <InputError text='Delivery range is required'/>}
                        </React.Fragment>
                        }
                        <SubmitButton loadingStatus={loadingStatus} text='Save changes' className="button-long"/>
                    </form>
                </div>
                <button className="button-link" type="button" onClick={() => setDisableDeliveryModal(true)}>Disable delivery</button>
            </div>
            {addLogoModal && <AddLogoModal photoData={photoData} setPhotoData={setPhotoData} closeModal={() => setAddLogoModal(false)}/>}
            {disableDeliveryModal && <DisableDeliveryModal closeModal={() => setDisableDeliveryModal(false)} hideDeliveryFields={() => setEnabledDelivery(false)}/>}
        </div>
    );
};