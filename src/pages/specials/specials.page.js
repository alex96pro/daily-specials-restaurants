import './specials.page.scss';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSpecialsAPI } from '../../common/api/specials.api';
import { getModifiersAPI } from '../../common/api/modifiers.api';
import { getSpecialModifiersAPI } from '../../common/api/meal.api';
import { CURRENCY, DAILY_SPECIALS_LIMIT } from '../../util/consts';
import { getClientDateAndTime, getNextWeekDates } from '../../util/functions';
import { Tooltip } from 'antd';
import NavBar from '../../components/nav-bar/nav-bar';
import Loader from '../../components/loader';
import FillBar from '../../components/fill-bar/fill-bar';
import PostNewSpecialModal from './post-new-special.modal';
import ConfirmDeleteModal from './confirm-delete.modal';
import EditSpecialModal from './edit-special.modal';
import PreviewMealModal from '../../components/meal-preview/meal-preview.modal';

export default function Specials() {

    const dispatch = useDispatch();
    const history = useHistory();
    const {specials, loadingSpecialsPage} = useSelector(state => state.specials);
    const loadingAllModifiers = useSelector(state => state.modifiers.loadingModifiersPage);
    const loadingSpecialModifiers = useSelector(state => state.meal.loadingStatus);
    const [usedSpecials, setUsedSpecials] = useState([]);
    const [days, setDays] = useState([]);
    const [postNewSpecialModal, setPostNewSpecialModal] = useState({show: false, date: '', today:''});
    const [confirmDeleteModal, setConfirmDeleteModal] = useState({show:false, special:{}, date: '', today: ''});
    const [editSpecialModal, setEditSpecialModal] = useState({show: false, special: {}});
    const [previewMealModal, setPreviewMealModal] = useState({show: false, special: {}});

    const handleNewSpecial = (day) => {
        if(day.dbFormat === getClientDateAndTime(true, false)){
            dispatch(getModifiersAPI(() => setPostNewSpecialModal({show: true, date: day, today: true})));
        }else{
            dispatch(getModifiersAPI(() => setPostNewSpecialModal({show: true, date: day, today: false})));
        }
    };

    const handleEditSpecial = (special, day) => {
        if(day.dbFormat === getClientDateAndTime(true, false)){
            // API has to be in this order so that react-select can work (doesn't update its default values like it should from react redux store otherwise)
            dispatch(getModifiersAPI());
            dispatch(getSpecialModifiersAPI(special.specialId, () => setEditSpecialModal({show: true, special: special, date: day, today: true})));
        }else{
            dispatch(getModifiersAPI());
            dispatch(getSpecialModifiersAPI(special.specialId, () => setEditSpecialModal({show: true, special: special, date: day, today: false})));
        }
    };

    const handleDeleteSpecial = (special, day) => {
        if(day.dbFormat === getClientDateAndTime(true, false)){
            setConfirmDeleteModal({show: true, special: special, today: true});
        }else{
            setConfirmDeleteModal({show: true, special: special, today: false});
        }
    };

    const handlePreviewSpecial = (special) => {
        dispatch(getSpecialModifiersAPI(special.specialId, () => setPreviewMealModal({show: true, special: special})));
    };
    
    useEffect(() => {
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
            {(loadingAllModifiers || loadingSpecialModifiers) && <Loader className="loader-center" blackBackground/>}
            <NavBar loggedIn={true}/>
                {loadingSpecialsPage ? <Loader className="loader-center"/>
                :
                <div className="specials-container">
                    <div className="header">Your specials for this week</div>
                    {days.map((day,index) => <div className="specials-date-slot" key={index}>
                        <div className="specials-date-container">
                            <div className="specials-date-name">{day.dayName}</div>
                            <div className="specials-date">{day.value}</div>
                            <FillBar label={usedSpecials[index]+'/'+DAILY_SPECIALS_LIMIT +' used'} percentage={usedSpecials[index]/DAILY_SPECIALS_LIMIT}/>
                        </div>
                        {specials.map(special => special.date === day.dbFormat && 
                        <div className="special-container" key={special.specialId}>
                            {special.deleted ? <div className="special-photo"><i className="fas fa-ban fa-10x"></i></div>
                            :
                            <img src={special.photo} alt="Loading..." onClick={() => handleEditSpecial(special, day)} className="special-photo"></img>
                            }
                            <div>
                                <div className="label">{special.name}</div>
                                <div className="label-accent-color">{special.price + CURRENCY}</div>
                                <div className="label">{special.time}</div>
                                {special.deleted ?
                                    <div className="deleted-special-label">Deleted</div>
                                :
                                <React.Fragment>
                                    <Tooltip title="See from user's perspective">
                                        <i className="fas fa-eye fa-2x" onClick={() => handlePreviewSpecial(special)}></i>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                        <i className="fas fa-edit fa-2x" onClick={() => handleEditSpecial(special, day)}></i>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <i className="fas fa-trash fa-2x" onClick={() => handleDeleteSpecial(special, day)}></i>
                                    </Tooltip>
                                </React.Fragment>
                                } 
                            </div>
                        </div>)}
                        {usedSpecials[index] !== DAILY_SPECIALS_LIMIT && 
                        <button onClick={() => handleNewSpecial(day)} className='button-normal' style={{margin:0}}>Post new special</button>
                        }
                    </div>)}
                </div>
                }
            {postNewSpecialModal.show && <PostNewSpecialModal date={postNewSpecialModal.date} today={postNewSpecialModal.today} closeModal={() => setPostNewSpecialModal({...postNewSpecialModal, show: false})}/>}
            {editSpecialModal.show && <EditSpecialModal special={editSpecialModal.special} today={editSpecialModal.today} date={editSpecialModal.date} closeModal={() => setEditSpecialModal({show: false, special: {}, date:'', today:''})}/>}
            {confirmDeleteModal.show && <ConfirmDeleteModal special={confirmDeleteModal.special} today={confirmDeleteModal.today} closeModal={() => setConfirmDeleteModal({show: false, special:{}})}/>}
            {previewMealModal.show && <PreviewMealModal meal={previewMealModal.special} closeModal={() => setPreviewMealModal({show: false, special:{}})}/>}
        </div>
    );
}