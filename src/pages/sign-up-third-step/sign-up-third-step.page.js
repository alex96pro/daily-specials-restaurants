import './sign-up-third-step.page.scss';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signUpCompleteAPI } from '../../common/api/auth.api';
import { DAYS_OF_THE_WEEK } from '../../util/consts';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import NavBar from '../../components/nav-bar/nav-bar';
import SubmitButton from '../../components/common/submit-button';
import MessageDanger from '../../components/common/message-danger';

export default function SignUpThirdStep() {

    const history = useHistory();
    const dispatch = useDispatch();
    const {register, handleSubmit} = useForm();
    const {loadingStatus, restaurantSignUpInfo} = useSelector(state => state.authentication);
    const [message, setMessage] = useState('');
    const [checkedDays, setCheckedDays] = useState(
        [true, true, true, true, true, true, true]
    );

    const successfullSignUp = () => {
        history.push('/');
    };

    const changeWorkingDay = (event, index) => {
        let newChecked = [];
        for(let i = 0; i < checkedDays.length; i++){
            if(i === index){
                event.target.checked ? newChecked.push(true) : newChecked.push(false);
            }else{
                newChecked.push(checkedDays[i]);
            }
        }
        setCheckedDays(newChecked);
    };

    const finishSignUp = (data) => {
        if(!restaurantSignUpInfo.firstStepSuccess){
            setMessage('First step is not completed');
            return;
        }
        if(!restaurantSignUpInfo.location){
            setMessage('Second step is not completed');
            return;
        }
        const workingHoursFrom = [data.From0, data.From1, data.From2, data.From3, data.From4, data.From5, data.From6];
        const workingHoursTo = [data.To0, data.To1, data.To2, data.To3, data.To4, data.To5, data.To6];
        const workingHours = {workingHoursFrom, workingHoursTo};
        restaurantSignUpInfo.workingHours = workingHours;
        dispatch(signUpCompleteAPI(restaurantSignUpInfo, successfullSignUp));
    };

    return(
        <div className="sign-up-third-step">
            <NavBar loggedIn={false}/>
            <div className="working-hours-container">
                <div className="header-accent-color">Add working hours</div>
                <form onSubmit={handleSubmit(finishSignUp)}>
                    {DAYS_OF_THE_WEEK.map((day, index) => <div key={index} className="working-hours-row">
                        <div>
                            <div className="label-accent-color-2">{day}</div>
                            {!checkedDays[index] && <label className="message-danger">(Closed)</label>}
                        </div>
                        
                        <div>
                            <input type="time" defaultValue="09:00" name={'From'+index} ref={register()} disabled={!checkedDays[index]}/>
                            <label className="label-accent-color-2">-</label>
                            <input type="time" defaultValue="21:00" name={'To'+index} ref={register()} disabled={!checkedDays[index]}/>
                            <input type="checkbox" checked={checkedDays[index]} className="working-hours-checkbox"
                            onChange={(event) => changeWorkingDay(event, index)}/>
                        </div>
                    </div>)}
                    <SubmitButton loadingStatus={loadingStatus} text='Finish sign up'/>
                    {message && <MessageDanger text={message}/>}
                </form>
            </div>
        </div>
    );
};