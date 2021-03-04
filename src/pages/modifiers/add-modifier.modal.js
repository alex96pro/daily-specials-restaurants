// import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import SubmitButton from '../../components/submit-button';
// import InputError from '../../components/input-error';

export default function AddModifierModal(props) {
    
    // const {register, handleSubmit, errors} = useForm();
    const [modalOpacity, setModalOpacity] = useState(0);
    // const {loadingStatus} = useSelector(state => state.authentication);
    // const [message, setMessage] = useState({text:'', success:false});
    // const dispatch = useDispatch();

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
                <div className="header-small">Add new modifier</div>
                <label className="label">Name</label>
                <input type="text"/>
                <div className="label">Choose type</div>
                <div className="modifier-type">
                    <input type="radio"/>
                    <div>
                        <div className="label m-0">Required base (determins starting price)</div>
                        <div className="modifier-example">Example: Small: 4$, Medium: 6$, Big: 8$...</div>
                    </div>
                </div>
                <div className="modifier-type">
                    <input type="radio"/>
                    <div>
                        <div className="label m-0">Required (may change price)</div>
                        <div className="modifier-example">Example: Normal pizza doe: 0$, Chicago pizza doe: 1$...</div>
                    </div>
                </div>
                <div className="modifier-type">
                    <input type="radio"/>
                    <div>
                        <div className="label m-0">Optional (extras)</div>
                        <div className="modifier-example">Example: Ketchup: 0$, Cheese $1, Mustard: 0$...</div>
                    </div>
                </div>
                
            </div>
        </div>
        </React.Fragment>
    );
};