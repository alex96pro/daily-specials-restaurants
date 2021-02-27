import './specials.page.scss';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSpecialsAPI } from '../../common/api/specials.api';
import { CURRENCY, DAILY_SPECIALS_LIMIT } from '../../util/consts';
import { getTodayDate } from '../../util/functions';
import NavBar from '../../components/nav-bar/nav-bar';
import Loader from '../../components/loader';
import Label from '../../components/label';
import PostNewSpecialModal from './post-new-special.modal';
import ConfirmDeleteModal from './confirm-delete.modal';
import EditSpecialModal from './edit-special.modal';

export default function Specials() {

    const dispatch = useDispatch();
    const history = useHistory();
    const {specials, usedSpecials, loadingSpecialsPage} = useSelector(state => state.specials);
    const [date, setDate] = useState('');
    const [postNewSpecialModal, setPostNewSpecialModal] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState({show:false, special:{}});
    const [editSpecialModal, setEditSpecialModal] = useState({show: false, special: {}});

    useEffect(() => {
        if(!localStorage.getItem('ACCESS_TOKEN_RESTAURANT')){
            history.push('/login');
            return;
        }
        dispatch(getSpecialsAPI());
        setDate(getTodayDate());
    },[dispatch, history]);

    return (
        <div className="specials">
            <NavBar loggedIn={true}/>
                {loadingSpecialsPage ? <Loader className="loader-center"/>
                :
                <React.Fragment>
                    <div className="header-accent-color">Specials for day {date}</div>
                    {usedSpecials !== '' && 
                    <div className="header-accent-color">
                        Used specials {usedSpecials}/{DAILY_SPECIALS_LIMIT}
                        {specials.length !== usedSpecials && ` (${usedSpecials - specials.length} deleted)`}
                    </div>}
                    <button onClick={() => setPostNewSpecialModal(true)} className={usedSpecials === DAILY_SPECIALS_LIMIT ? "button-normal-disabled" : "button-normal"}>
                        {usedSpecials === DAILY_SPECIALS_LIMIT ? 'Daily limit for specials is full' : 'Post new special'} 
                    </button>
                    <div className="specials-container">
                        {specials.map(special => <div className="special" key={special.specialId}>
                            <img src={special.photo} alt="Loading..." className="special-photo" onClick={() => setEditSpecialModal({show: true, special: special})}/>
                            <Label name="Name: " value={special.name}/>
                            <Label name="Description: " value={special.description}/>
                            <Label name="Price: " value={special.price + CURRENCY}/>
                            <div className="tags">
                            <label className="label-accent-color-2">Tags:</label>
                            {special.tags.map((tag, index) => <label className="tag" key={index}>
                                #{tag}
                            </label>)}
                            {special.tags.length === 0 && <label className="label-accent-color">No tags</label>}
                            </div>
                            <div className="specials-buttons">
                                <i className="fas fa-edit fa-3x" onClick={() => setEditSpecialModal({show: true, special: special})}></i>
                                <i className="fas fa-trash fa-3x" onClick={() => setConfirmDeleteModal({show:true, special:special})}></i>
                            </div>
                        </div>)}
                    </div>
                </React.Fragment>
                }
            {postNewSpecialModal && <PostNewSpecialModal closeModal={() => setPostNewSpecialModal(false)}/>}
            {confirmDeleteModal.show && <ConfirmDeleteModal special={confirmDeleteModal.special} closeModal={() => setConfirmDeleteModal({show: false, special:{}})}/>}
            {editSpecialModal.show && <EditSpecialModal special={editSpecialModal.special} closeModal={() => setEditSpecialModal({show: false, special: {}})}/>}
        </div>
    );
}