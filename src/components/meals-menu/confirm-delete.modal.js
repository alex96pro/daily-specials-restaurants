import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteMenuMealAPI } from '../../common/api/menu.api';
import ConfirmButton from '../../components/confirm-button';

export default function ConfirmDelete(props) {

    const dispatch = useDispatch();
    const [modalOpacity, setModalOpacity] = useState(0);
    const {loadingStatus} = useSelector(state => state.menu);

    const deleteMeal = () => {
        dispatch(deleteMenuMealAPI(props.meal.mealId, props.closeModal));
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
                <div className="label">Are you sure you want to delete "{props.meal.name}" from your menu?</div>
                <ConfirmButton className="button-long" loadingStatus={loadingStatus} onClick={deleteMeal} text="Delete"/>
            </div>
        </div>
        </React.Fragment>
    );
};