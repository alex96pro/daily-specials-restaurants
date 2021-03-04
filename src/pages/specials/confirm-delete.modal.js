import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteSpecialAPI, deleteSpecialFromTodayAPI } from '../../common/api/specials.api';
import ConfirmButton from '../../components/confirm-button';
import MessageDanger from '../../components/message-danger';

export default function ConfirmDelete(props) {

    const [modalOpacity, setModalOpacity] = useState(0);
    const {loadingStatus} = useSelector(state => state.specials);
    const dispatch = useDispatch();

    const deleteMeal = () => {
        if(props.today){
            dispatch(deleteSpecialFromTodayAPI(props.special.specialId, props.closeModal));
        }else{
            dispatch(deleteSpecialAPI(props.special.specialId, props.closeModal));
        }
    };

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    return (
        <React.Fragment>
        <div className="modal-underlay" onClick={props.closeModal}></div>
        <div className="modal" style={{opacity:modalOpacity}}>
            <div className="modal-header">
                <i className="fas fa-times fa-2x" onClick={() => props.closeModal()}></i>
            </div>
            <div className="modal-body-vertical">
                <div>
                    <div className="label">Are you sure you want to delete "{props.special.name}"?</div>
                    {props.today && <MessageDanger text="Used specials count won't decrease."/>}
                    <ConfirmButton loadingStatus={loadingStatus} onClick={deleteMeal} text="Delete"/>
                </div>
            </div>
        </div>
        </React.Fragment>
    );
};