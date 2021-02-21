import './working-hours.page.scss';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { DAYS_OF_THE_WEEK } from '../../util/consts';
import { changeWorkingHoursAPI } from '../../common/api/auth.api';
import NavBar from '../../components/nav-bar/nav-bar';
import InputError from '../../components/input-error';
import SubmitButton from '../../components/submit-button';

export default function WorkingHours() {
    
    const {register, handleSubmit} = useForm();
    const dispatch = useDispatch();
    const workingHours = useSelector(state => state.authentication.restaurant.workingHours);
    const loadingStatus = useSelector(state => state.authentication.loadingStatus);
    const [checkedDays, setCheckedDays] = useState(
        [workingHours[0].from ? true : false,
        workingHours[1].from ? true : false,
        workingHours[2].from ? true : false,
        workingHours[3].from ? true : false,
        workingHours[4].from ? true : false,
        workingHours[5].from ? true : false,
        workingHours[6].from ? true : false]
    );
    const [message, setMessage] = useState({day:-1, text:''});

    const changeWorkingHours = (data) => {
        const workingHoursFrom = [data.From0, data.From1, data.From2, data.From3, data.From4, data.From5, data.From6];
        const workingHoursTo = [data.To0, data.To1, data.To2, data.To3, data.To4, data.To5, data.To6];
        for(let i = 0; i < 7; i++) {
            if((!workingHoursFrom[i] && workingHoursTo[i]) || (workingHoursFrom[i] && !workingHoursTo[i])
            ||(workingHoursFrom[i] === "" && workingHoursTo[i] === "")){
                setMessage({day: i, text:'Please set valid working time'});
                return;
            }
        }
        setMessage('');
        const workingHours = {workingHoursFrom, workingHoursTo};
        dispatch(changeWorkingHoursAPI(workingHours));
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

    return (
        <div className="working-hours">
            <NavBar loggedIn={true}/>
                <div className="working-hours-container">
                    <form onSubmit={handleSubmit(changeWorkingHours)}>
                        {DAYS_OF_THE_WEEK.map((day, index) => <div key={index}>
                            <label className="label-accent-color-2">{day} {!checkedDays[index] && 
                            <label className="message-danger">(Closed)</label>
                            }</label>
                            <div>
                                <input type="time" defaultValue={workingHours[index].from} disabled={!checkedDays[index]} name={'From'+index} ref={register()}/>
                                <label className="label-accent-color-2">-</label>
                                <input type="time" defaultValue={workingHours[index].to} disabled={!checkedDays[index]} name={'To'+index} ref={register()}/>
                                <input type="checkbox" checked={checkedDays[index]} name={'Checkbox'+index} ref={register()}
                                onChange={(event) => changeWorkingDay(event, index)}/>
                                {(message.text && message.day === index) && <InputError text={message.text}/>}
                            </div>
                        </div>)}
                        <SubmitButton loadingStatus={loadingStatus} text="Save changes"/>
                    </form>
                </div>
            </div>
    );
};