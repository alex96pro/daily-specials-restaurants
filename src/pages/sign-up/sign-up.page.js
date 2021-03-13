import './sign-up.page.scss';
import { useForm } from 'react-hook-form';
import { CURRENCY, DISTANCE } from '../../util/consts';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { changeDeliveryCheckbox } from '../../common/actions/auth.actions';
import { signUpFirstStepAPI } from '../../common/api/auth.api';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'antd';
import NavBar from '../../components/nav-bar/nav-bar';
import SubmitButton from '../../components/submit-button';
import InputError from '../../components/input-error';

export default function SignUp() {

    const history = useHistory();
    const dispatch = useDispatch();
    const {register, handleSubmit, errors} = useForm();
    const [messageName, setMessageName] = useState('');
    const [messageEmail, setMessageEmail] = useState('');
    const [messagePasswords, setMessagePasswords] = useState('');
    const restaurant = useSelector(state => state.authentication.restaurantSignUpInfo);
    const {loadingStatus} = useSelector(state => state.authentication);
    const [deliveryChecked, setDeliveryChecked] = useState(false);

    const setNewMessage = (newMessage) => {
        if(newMessage === "Email already in use"){
            setMessageEmail(newMessage);
            setMessageName('');
        }else{
            setMessageName(newMessage);
            setMessageEmail('');
        }
    };
    
    const secondStep = (data) => {
        if(data.password !== data.retypePassword){
            setMessagePasswords("Passwords don't match");
        }else{
            setMessagePasswords('');
            data.delivery = deliveryChecked;
            dispatch(signUpFirstStepAPI(data, passedFirstStep, setNewMessage));
        }
    };

    const passedFirstStep = () => {
        history.push('/sign-up-second-step');
    };

    const changeDelivery = (event) => {
        if(event.target.checked){
            dispatch(changeDeliveryCheckbox(true));
            setDeliveryChecked(true);
        }else{
            dispatch(changeDeliveryCheckbox(false));
            setDeliveryChecked(false);
        }
    };

    useEffect(() => {
        if(localStorage.getItem('ACCESS_TOKEN_RESTAURANT')){
            history.push('/dashboard');
        }
    }, [history]);

    return(
        <div className="sign-up">
            <NavBar loggedIn={false}/>
            <div className="sign-up-container">
                <div className="form-container">
                <div className="sign-up-header">Create account for your restaurant</div>
                    <form onSubmit={handleSubmit(secondStep)}>
                        <div className="label">Restaurant Name</div>
                        <input type="text" name="restaurantName" ref={register({required:true})} defaultValue={restaurant.restaurantName} className="app-input"/>
                        {errors.restaurantName && <InputError text="Name is required"/>}
                        {messageName && <InputError text={messageName}/>}

                        <div className="label">Phone</div>
                        <input type="text" name="phone" ref={register({required:true, pattern: /^\d+$/})} defaultValue={restaurant.phone} className="app-input"/>
                        {errors.phone?.type === 'required' && <InputError text="Phone is required"/>}
                        {errors.phone?.type === 'pattern' && <InputError text="Phone can contain only numbers"/>}

                        <div className="label p-t-15 p-b-15 m-0">Delivery
                        <Checkbox checked={restaurant.delivery} onChange={changeDelivery}/></div>
                        {restaurant.delivery && 
                        <div>
                            <div className="label">Maximal delivery range</div>
                            <input type="number" name="deliveryRange" ref={register({required:true})} step="0.1" defaultValue={restaurant.deliveryRange} className="app-input-number"/>
                            <label className="label">{DISTANCE}</label>
                            {errors.deliveryRange && <InputError text="Maximal delivery range is required"/>}
                            <div className="label">Minimal amount for delivery</div>
                            <input type="number" name="deliveryMinimum" ref={register({required:true})} step="0.01" defaultValue={restaurant.deliveryMinimum} className="app-input-number"/>
                            <label className="label">{CURRENCY}</label>
                            {errors.deliveryMinimum && <InputError text="Minimal amount for delivery is required"/>}
                        </div>}

                        <div className="label">Email</div>
                        <input type="email" name="email" ref={register({required:true})} defaultValue={restaurant.email} className="app-input"/>
                        {errors.email && <InputError text="Email is required"/>}
                        {messageEmail && <InputError text={messageEmail}/>}

                        <div className="label">Password</div>
                        <input type="password" name="password" ref={register({required:true})} defaultValue={restaurant.password} className="app-input"/>
                        {errors.password && <InputError text="Password is required"/>}
                        {messagePasswords && <InputError text={messagePasswords}/>}

                        <div className="label">Retype password</div>
                        <input type="password" name="retypePassword" ref={register({required:true})} defaultValue={restaurant.retypePassword} className="app-input"/>
                        {errors.retypePassword && <InputError text="Retype your password"/>}
                        {messagePasswords && <InputError text={messagePasswords}/>}

                        <SubmitButton text={'Next step'} loadingStatus={loadingStatus}/>
                    </form>
                </div>
                <div className="label">Already have an account?
                <button type="button" onClick={() => history.push('/login')} className="button-link">Log In</button></div>
            </div>
        </div>
    );
};