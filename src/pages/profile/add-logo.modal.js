import React, { useState, useEffect } from 'react';
import AddPhoto from '../../components/add-photo/add-photo';

export default function AddLogoModal(props) {
    
    const [modalOpacity, setModalOpacity] = useState(0);

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
                <div className="change-logo-container">
                    <AddPhoto photoData={props.photoData} setPhotoData={props.setPhotoData} closeModal={props.closeModal}/>
                </div>
            </div>
        </div>
        </React.Fragment>
    );
};