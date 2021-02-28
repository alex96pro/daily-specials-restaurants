import './specials.page.scss';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSpecialsAPI } from '../../common/api/specials.api';
import { CURRENCY, DAILY_SPECIALS_LIMIT } from '../../util/consts';
import { getClientDateAndTime, getNextWeekDates } from '../../util/functions';
import NavBar from '../../components/nav-bar/nav-bar';
import Loader from '../../components/loader';
import FillBar from '../../components/fill-bar/fill-bar';
import PostNewSpecialModal from './post-new-special.modal';
import ConfirmDeleteModal from './confirm-delete.modal';
import EditSpecialModal from './edit-special.modal';

export default function Specials() {

    const dispatch = useDispatch();
    const history = useHistory();
    const {specials, loadingSpecialsPage} = useSelector(state => state.specials);
    const [usedSpecials, setUsedSpecials] = useState([]);
    const [days, setDays] = useState([]);
    const [postNewSpecialModal, setPostNewSpecialModal] = useState({show: false, date: '', today:''});
    const [confirmDeleteModal, setConfirmDeleteModal] = useState({show:false, special:{}, date: '', today: ''});
    const [editSpecialModal, setEditSpecialModal] = useState({show: false, special: {}});

    const handleNewSpecial = (day) => {
        if(day.dbFormat === getClientDateAndTime(true, false)){
            setPostNewSpecialModal({show: true, date: day, today: true});
        }else{
            setPostNewSpecialModal({show: true, date: day, today: false});
        }
    };

    const handleEditSpecial = (special, day) => {
        if(day.dbFormat === getClientDateAndTime(true, false)){
            setEditSpecialModal({show: true, special: special, date: day, today: true});
        }else{
            setEditSpecialModal({show: true, special: special, date: day, today: false});
        }
    };

    const handleDeleteSpecial = (special, day) => {
        if(day.dbFormat === getClientDateAndTime(true, false)){
            setConfirmDeleteModal({show: true, special: special, today: true});
        }else{
            setConfirmDeleteModal({show: true, special: special, today: false});
        }
    };
    
    useEffect(() => {
        if(!localStorage.getItem('ACCESS_TOKEN_RESTAURANT')){
            history.push('/login');
            return;
        }
        dispatch(getSpecialsAPI());
        setDays(getNextWeekDates());
    },[dispatch, history]);

    useEffect(() => {
        let usedSpecialsPerDay = [0,0,0,0,0,0,0];
        for(let i = 0; i < specials.length; i++){
            for(let j = 0; j < days.length; j++){
                if(specials[i].date === days[j].dbFormat){
                    usedSpecialsPerDay[j]++;
                }
            } 
        }
        setUsedSpecials(usedSpecialsPerDay);
    }, [specials, days]);

    return (
        <div className="specials">
            <NavBar loggedIn={true}/>
                {loadingSpecialsPage ? <Loader className="loader-center"/>
                :
                <React.Fragment>
                    <div className="header-accent-color">Your specials for this week</div>
                    {days.map((day,index) => <div className="specials-date-card" key={index}>
                        <div className="specials-date-container">
                            <div className="specials-date">{day.value}</div>
                            <FillBar label={usedSpecials[index]+'/'+DAILY_SPECIALS_LIMIT +' used'} percentage={usedSpecials[index]/DAILY_SPECIALS_LIMIT}/>
                        </div>
                        {specials.map(special => special.date === day.dbFormat && 
                        <div className="special-container" key={special.specialId}>
                            {special.deleted ? <i className="fas fa-ban fa-6x"></i>
                            :
                            <img src={special.photo} alt="Loading..." onClick={() => handleEditSpecial(special, day)} className="special-photo"></img>
                            }
                            <div>
                                <div className="label-accent-color">{special.name}</div>
                                <div className="label-accent-color-3">{special.price + CURRENCY}</div>
                                <div className="label-accent-color">{special.time}</div>
                                {special.deleted ?
                                    <div className="deleted-special-label">Deleted</div>
                                :
                                <React.Fragment>
                                    <i className="fas fa-edit fa-2x" onClick={() => handleEditSpecial(special, day)}></i>
                                    <i className="fas fa-trash fa-2x" onClick={() => handleDeleteSpecial(special, day)}></i>
                                </React.Fragment>
                                } 
                            </div>
                        </div>)}
                        {usedSpecials[index] !== DAILY_SPECIALS_LIMIT && 
                        <button onClick={() => handleNewSpecial(day)} className='button-normal' style={{margin:0}}>Post new special</button>
                        }
                    </div>)}
                </React.Fragment>
                }
            {postNewSpecialModal.show && <PostNewSpecialModal date={postNewSpecialModal.date} today={postNewSpecialModal.today} closeModal={() => setPostNewSpecialModal({...postNewSpecialModal, show: false})}/>}
            {confirmDeleteModal.show && <ConfirmDeleteModal special={confirmDeleteModal.special} today={confirmDeleteModal.today} closeModal={() => setConfirmDeleteModal({show: false, special:{}})}/>}
            {editSpecialModal.show && <EditSpecialModal data={editSpecialModal} closeModal={() => setEditSpecialModal({show: false, special: {}})}/>}
        </div>
    );
}