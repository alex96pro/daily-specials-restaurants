import './sign-up.page.scss';
import { useForm } from 'react-hook-form';
import { CURRENCY, DISTANCE } from '../../util/consts';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { changeDeliveryCheckbox } from '../../common/actions/auth.actions';
import { signUpFirstStepAPI } from '../../common/api/auth.api';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from '../../components/nav-bar/nav-bar';
import SubmitButton from '../../components/common/submit-button';
import InputError from '../../components/common/input-error';

export default function SignUp() {

    const history = useHistory();
    const dispatch = useDispatch();
    const {register, handleSubmit, errors} = useForm();
    const [messageName, setMessageName] = useState('');
    const [messageEmail, setMessageEmail] = useState('');
    const [messagePasswords, setMessagePasswords] = useState('');
    const restaurant = useSelector(state => state.authentication.restaurantSignUpInfo);
    const {loadingStatus} = useSelector(state => state.authentication);

    const setNewMessage = (newMessage, type) => {
        if(type === "name"){
            setMessageName(newMessage);
            setMessageEmail('');
        }else if(type === "email"){
            setMessageEmail(newMessage);
            setMessageName('');
        }
    };
    
    const secondStep = (data) => {
        if(data.password !== data.retypePassword){
            setMessagePasswords("Passwords don't match");
        }else{
            setMessagePasswords('');
            dispatch(signUpFirstStepAPI(data, passedFirstStep, setNewMessage));
        }
    };

    const passedFirstStep = () => {
        history.push('/sign-up-second-step');
    };

    const changeDelivery = (event) => {
        if(event.target.checked){
            dispatch(changeDeliveryCheckbox(true));
        }else{
            dispatch(changeDeliveryCheckbox(false));
        }
    };

    return(
        <div className="sign-up-restaurant">
            <NavBar loggedIn={false}/>
            <div className="sign-up-restaurant-container">
                <div className="form-container">
                <div className="sign-up-restaurant-header">Create account for your restaurant</div>
                    <form onSubmit={handleSubmit(secondStep)}>
                        <div className="label-accent-color">Restaurant Name</div>
                        <input type="text" name="restaurantName" ref={register({required:true})} defaultValue={restaurant.restaurantName}/>
                        {errors.restaurantName && <InputError text="Name is required"/>}
                        {messageName && <InputError text={messageName}/>}

                        <div className="label-accent-color">Phone</div>
                        <input type="text" name="phone" ref={register({required:true, pattern: /^\d+$/})} defaultValue={restaurant.phone}/>
                        {errors.phone?.type === 'required' && <InputError text="Phone is required"/>}
                        {errors.phone?.type === 'pattern' && <InputError text="Phone can contain only numbers"/>}

                        <div className="restaurant-delivery-checkbox">Delivery
                        <input type="checkbox" name="delivery" ref={register()} checked={restaurant.delivery} onChange={changeDelivery}/></div>

                        {restaurant.delivery && 
                        <div>
                            <div className="label-accent-color">Maximal delivery range</div>
                            <input type="number" name="deliveryRange" ref={register({required:true})} step="0.1" defaultValue={restaurant.deliveryRange}/>
                            <label className="label-accent-color">{DISTANCE}</label>
                            {errors.deliveryRange && <InputError text="Maximal delivery range is required"/>}
                            <div className="label-accent-color">Minimal amount for delivery</div>
                            <input type="number" name="deliveryMinimum" ref={register({required:true})} step="0.01" defaultValue={restaurant.deliveryMinimum}/>
                            <label className="label-accent-color">{CURRENCY}</label>
                            {errors.deliveryMinimum && <InputError text="Minimal amount for delivery is required"/>}
                        </div>}

                        <div className="label-accent-color">Email</div>
                        <input type="email" name="email" ref={register({required:true})} defaultValue={restaurant.email}/>
                        {errors.email && <InputError text="Email is required"/>}
                        {messageEmail && <InputError text={messageEmail}/>}

                        <div className="label-accent-color">Password</div>
                        <input type="password" name="password" ref={register({required:true})} defaultValue={restaurant.password}/>
                        {errors.password && <InputError text="Password is required"/>}
                        {messagePasswords && <InputError text={messagePasswords}/>}

                        <div className="label-accent-color">Retype password</div>
                        <input type="password" name="retypePassword" ref={register({required:true})} defaultValue={restaurant.retypePassword}/>
                        {errors.retypePassword && <InputError text="Retype your password"/>}
                        {messagePasswords && <InputError text={messagePasswords}/>}

                        <SubmitButton text={'Next step'} loadingStatus={loadingStatus}/>
                    </form>
                </div>
                <div className="label-accent-color">Already have an account?
                <button type="button" onClick={() => history.push('/login')} className="button-link">Log In</button></div>
            </div>
        </div>
    );
};