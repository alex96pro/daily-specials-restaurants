import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';

export default function RejectModal(props) {
    
    const {register, handleSubmit} = useForm();
    const [modalOpacity, setModalOpacity] = useState(0);

    const rejectOrder = (data) => {
        props.reject(data.rejectReason);
        props.closeModal();
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
                <label className="label">Reason for rejecting</label>
                <form onSubmit={handleSubmit(rejectOrder)}>
                    <select name="rejectReason" ref={register()} className="app-select">
                        <option className="app-option">Delivery address too far</option>
                        <option className="app-option">Delivery minimum not fullfiled</option>
                        <option className="app-option">Out of stock</option>
                        <option className="app-option">Closed</option>
                    </select>
                    <button className="button-long" type="submit">Reject</button>
                </form>
            </div>
        </div>
        </React.Fragment>
    );
};