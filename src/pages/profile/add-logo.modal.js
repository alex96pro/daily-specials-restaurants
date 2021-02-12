// import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
// import { disableDeliveryAPI } from '../../common/api/auth.api';
// import { useDispatch, useSelector } from 'react-redux';
// import SubmitButton from '../../components/common/submit-button';
// import InputError from '../../components/common/input-error';
import AddPhoto from '../../components/add-photo/add-photo';

export default function AddLogoModal(props) {
    
    const [modalOpacity, setModalOpacity] = useState(0);

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    return (
        <div className="modal">
            <div className="modal-underlay" onClick={props.closeModal}></div>
            <div className="modal-container" style={{opacity:modalOpacity}}>
                <div className="modal-header">
                    <button onClick={props.closeModal} className="modal-x">x</button>
                </div>
                <div className="modal-body">
                    <AddPhoto setPhoto={props.setPhoto} closeModal={props.closeModal} photo={props.photo}/>
                </div>
            </div>
        </div>
    );
};