import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteSpecialAPI } from '../../common/api/specials.api';
import ConfirmButton from '../../components/common/confirm-button';
import MessageDanger from '../../components/common/message-danger';

export default function ConfirmDelete(props) {

    const [modalOpacity, setModalOpacity] = useState(0);
    const {loadingStatus} = useSelector(state => state.specials);
    const dispatch = useDispatch();

    const deleteMeal = () => {
        dispatch(deleteSpecialAPI(props.special.specialId, props.closeModal));
    };

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
                    <div className="label-accent-color">Are you sure you want to delete "{props.special.name}"?</div>
                    <MessageDanger text="Used specials count won't decrease."/>
                    <ConfirmButton loadingStatus={loadingStatus} onClick={deleteMeal} text="Delete"/>
                </div>
            </div>
        </div>
    );
};