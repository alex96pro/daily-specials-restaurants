import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

export default function RejectModal(props) {
    
    const [modalOpacity, setModalOpacity] = useState(0);
    const [selectedReason, setSelectedReason] = useState('Delivery address too far');

    const rejectOrder = () => {
        props.reject(selectedReason);
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
                <Select onChange={(selected) => setSelectedReason(selected)} defaultValue="Delivery address too far">
                    <Select.Option value="Delivery address too far">
                        Delivery address too far
                    </Select.Option>
                    <Select.Option value="Delivery minimum not fullfiled">
                        Delivery minimum not fullfiled
                    </Select.Option>
                    <Select.Option value="Closing soon">
                        Closing soon
                    </Select.Option>
                    <Select.Option value="Out of stock">
                        Out of stock
                    </Select.Option>
                </Select>
                <button type="button" onClick={rejectOrder} className="button-long">Reject</button>
            </div>
        </div>
        </React.Fragment>
    );
};