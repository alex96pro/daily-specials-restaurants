import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

export default function AcceptModal(props) {
    
    const [modalOpacity, setModalOpacity] = useState(0);
    const [selectedTime, setSelectedTime] = useState('15 minutes');

    const acceptOrder = () => {
        props.accept(selectedTime);
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
                <label className="label">Estimated time for delivery</label>
                    <Select onChange={(selected) => setSelectedTime(selected)} defaultValue="15 minutes">
                        <Select.Option value='15 minutes'>
                            15 minutes
                        </Select.Option>
                        <Select.Option value='30 minutes'>
                            30 minutes
                        </Select.Option>
                        <Select.Option value='45 minutes'>
                            45 minutes
                        </Select.Option>
                        <Select.Option value='1 hour'>
                            1 hour
                        </Select.Option>
                    </Select>
                    <button type="button" onClick={acceptOrder} className="button-long">Accept</button>
            </div>
        </div>
        </React.Fragment>
    );
};