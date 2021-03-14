import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteModifierAPI } from '../../common/api/modifiers.api';
import ConfirmButton from '../../components/confirm-button';

export default function AddModifierModal(props) {

    const dispatch = useDispatch();
    const [modalOpacity, setModalOpacity] = useState(0);
    const { loadingStatus } = useSelector(state => state.modifiers);

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    const deleteModifier = () => {
        dispatch(deleteModifierAPI(props.modifier.modifierId, props.closeModal));
    };

    return (
        <React.Fragment>
        <div className="modal-underlay" onClick={props.closeModal}></div>
        <div className="modal" style={{opacity:modalOpacity}}>
            <div className="modal-header">
                <i className="fas fa-times fa-2x" onClick={() => props.closeModal()}></i>
            </div>
            <div className="modal-body-vertical">
                <div className="label">
                    Are you sure you want to delete {props.modifier.modifier.name}?
                </div>
                <div className="label">
                    This will also delete modifier from all your meals.
                </div>
                <ConfirmButton className="button-long" onClick={deleteModifier} text="Delete modifier" loadingStatus={loadingStatus}/>
            </div>
        </div>
        </React.Fragment>
    );
};