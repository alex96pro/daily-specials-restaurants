import { useState, useEffect } from 'react';
import AddPhoto from '../../components/add-photo/add-photo';

export default function ChangePhotoModal(props) {

    const [modalOpacity, setModalOpacity] = useState(0);

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    return (
        <div className="modal">
            <div className="modal-overlay" onClick={props.closeModal}></div>
            <div className="modal-container" style={{opacity:modalOpacity}}>
                <div className="modal-header">
                    <button onClick={props.closeModal} className="modal-x">x</button>
                </div>
                <div className="modal-body">
                    <AddPhoto setPhoto={(newPhoto) => props.setPhoto(newPhoto)} closeModal={props.closeModal}/>
                </div>
            </div>
        </div>
    );
};