import './sign-up.page.scss';
import { useForm } from 'react-hook-form';
import NavBar from '../../components/nav-bar/nav-bar';
import { CURRENCY, DISTANCE } from '../../util/consts';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { signUpFirstStepAPI } from '../../common/api/auth.api';
import { useDispatch, useSelector } from 'react-redux';

export default function SignUpRestaurant() {

    const {register, handleSubmit, errors} = useForm();
    const history = useHistory();
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();
    const restaurant = useSelector(state => state.authentication.restaurantSignUpInfo);

    const nextStep = (data) => {
        if(data.password !== data.retypePassword){
            setMessage("Passwords don't match");
        }else{
            dispatch(signUpFirstStepAPI(data));
            history.push('/map');
        }
    };

    return(
        <div className="sign-up-restaurant">
            <NavBar loggedIn={false}/>
            <div className="sign-up-restaurant-container">
                <div className="form-container">
                <div className="sign-up-restaurant-header">Create account for your restaurant</div>
                    <form onSubmit={handleSubmit(nextStep)}>
                        <div className="label-accent-color">Restaurant Name</div>
                        <input type="text" name="restaurantName" ref={register({required:true})} defaultValue={restaurant.restaurantName}/>
                        {errors.restaurantName && <div>Email required</div>}

                        <div className="label-accent-color">Email</div>
                        <input type="email" name="email" ref={register({required:true})} defaultValue={restaurant.email}/>

                        <div className="label-accent-color">Phone</div>
                        <input type="text" name="phone" ref={register({required:true})} defaultValue={restaurant.phone}/>

                        <div className="restaurant-delivery-checkbox">Delivery
                        <input type="checkbox" name="delivery" ref={register()} defaultValue={restaurant.delivery}/></div>

                        <div className="label-accent-color">Delivery range</div>
                        <input type="number" name="deliveryRange" ref={register()} step="0.1" defaultValue={restaurant.deliveryRange}/>
                        <label className="label-accent-color">{DISTANCE}</label>

                        <div className="label-accent-color">Delivery minimum</div>
                        <input type="number" name="deliveryMinimum" ref={register()} step="0.01" defaultValue={restaurant.deliveryMinimum}/>
                        <label className="label-accent-color">{CURRENCY}</label>

                        <div className="label-accent-color">Password</div>
                        <input type="password" name="password" ref={register({required:true})} defaultValue={restaurant.password}/>

                        <div className="label-accent-color">Retype password</div>
                        <input type="password" name="retypePassword" ref={register({required:true})} defaultValue={restaurant.retypePassword}/>

                        <button type="submit" className="button-long">Next</button>
                    </form>
                    {message && <div className="message-danger">{message}</div>}
                </div>
                <div className="label-accent-color">Already have an account?
                <button type="button" onClick={() => history.push('/login')} className="button-link">Log In</button></div>
            </div>
        </div>
    );
};