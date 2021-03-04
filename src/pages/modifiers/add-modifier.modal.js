// import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { CURRENCY } from '../../util/consts';

export default function AddModifierModal(props) {
    
    // const {register, handleSubmit, errors} = useForm();
    const [modalOpacity, setModalOpacity] = useState(0);
    // const {loadingStatus} = useSelector(state => state.authentication);
    // const [message, setMessage] = useState({text:'', success:false});
    // const dispatch = useDispatch();
    const [modifiers, setModifiers] = useState([{}]);

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
                {/* <div className="header-small">Add new modifier</div> */}
                <label className="label-accent-color-2">Modifier name</label>
                <input type="text"/>
                <div className="label-accent-color-2 p-t-15">Choose modifier type</div>
                <div className="modifier-type">
                    <input type="radio" name="modifierType"/>
                    <div>
                        <div className="label m-0">Required base (determins starting price)</div>
                        <div className="modifier-example">Example: Small: 4$, Medium: 6$, Big: 8$...</div>
                    </div>
                </div>
                <div className="modifier-type">
                    <input type="radio" name="modifierType"/>
                    <div>
                        <div className="label m-0">Required (may change price)</div>
                        <div className="modifier-example">Example: Normal pizza doe: 0$, Chicago pizza doe: 1$...</div>
                    </div>
                </div>
                <div className="modifier-type">
                    <input type="radio" name="modifierType"/>
                    <div>
                        <div className="label m-0">Optional (extras)</div>
                        <div className="modifier-example">Example: Ketchup: 0$, Cheese $1, Mustard: 0$...</div>
                    </div>
                </div>
                <div className="label-accent-color-2 p-t-15">
                    Options
                </div>
                {modifiers.map((modifier, index) => 
                <div className="modifier-option" key={index}>
                    <input type="text" className="modifier-option-name-input" placeholder="Name of the option"/>
                    <input type="number" className="modifier-option-price-input" placeholder="Price"/><label className="label">{CURRENCY}</label>
                    {modifiers.length > 1 && <i className="fas fa-trash fa-2x" onClick={() => setModifiers(modifiers.filter((modifier, modifierIndex) => modifierIndex !== index))}></i>}
                </div>
                )}
                <div>
                    <button onClick={() => setModifiers([...modifiers, {}])} className="add-new-modifier-option">+ Add new option</button>
                </div>
                <button className="button-long">Finish adding modifier</button>
            </div>
        </div>
        </React.Fragment>
    );
};