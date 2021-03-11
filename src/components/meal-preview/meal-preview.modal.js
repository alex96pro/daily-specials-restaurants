import './meal-preview.modal.scss';
import React, { useState } from 'react';
import { CURRENCY } from '../../util/consts';
import { calculateMealPrice } from '../../util/functions';
import ModifiersPreview from './modifiers-preview';

export default function MealPreviewModal(props) {
    
    const [amount, setAmount] = useState(1);
    const [selectedModifiers, setSelectedModifiers] = useState({requiredBaseModifier:props.meal.price, requiredModifiers:[], optionalModifiers:[]});

    const changeAmount = () => {
        const input = document.getElementsByName('amount')[0];
        if(input){
            setAmount(+input.value);
        }
    };

    const incrementAmmount = () => {
        const input = document.getElementById('preview-amount');
        if(input){
            input.value = +input.value + 1;
            setAmount(amount + 1);
        }
    };

    const decrementAmmount = () => {
        const input = document.getElementById('preview-amount');
        if(input && input.value > 1){
            input.value = input.value - 1;
            setAmount(amount - 1);
        }
    };

    const addRequiredBaseModifier = (price) => {
        setSelectedModifiers({...selectedModifiers, requiredBaseModifier: price});
    };

    const addRequiredModifier = (modifierId, optionPrice) => {
        let newRequiredModifiers = selectedModifiers.requiredModifiers.filter(modifier => modifier.modifierId !== modifierId);
        newRequiredModifiers.push({modifierId: modifierId, optionPrice: optionPrice});
        setSelectedModifiers({...selectedModifiers, requiredModifiers: newRequiredModifiers});
    };

    const addOptionalModifier = (event, modifierId, optionName, optionPrice) => {
        if(event.target.checked){
            setSelectedModifiers({...selectedModifiers, optionalModifiers: [...selectedModifiers.optionalModifiers, {modifierId: modifierId, optionName: optionName, optionPrice: optionPrice}]});
        }else{
            setSelectedModifiers({...selectedModifiers, optionalModifiers: selectedModifiers.optionalModifiers.filter(modifier => modifier.optionName !== optionName && modifier.modifierId !== modifierId)});
        }
    };

    return (
        <React.Fragment>
        <div className="modal-underlay" onClick={() => props.closeModal()}></div>
        <div className="modal" style={{opacity:1}}>
            <div className="modal-header">
                <i className="fas fa-times fa-2x" onClick={() => props.closeModal()}></i>
            </div>
            <div className="modal-body-horizontal">
                <div className="meal-preview-photo-container">
                    <img src={props.meal.photo} alt="Loading..." className="meal-preview-photo"/>
                </div>
                <div className="meal-preview-basic-info">
                    <div className="label-accent-color">{props.meal.name}</div>
                    <div className="label p-t-15">{props.meal.description}</div>
                    <div className="label p-t-15">Amount</div>
                    <div className="meal-modal-amount-row">
                        <input type="number" id="preview-amount" defaultValue="1" onChange={changeAmount} className="app-input-number"/>
                        <i className="fas fa-minus fa-2x" onClick={decrementAmmount}></i>
                        <i className="fas fa-plus fa-2x" onClick={incrementAmmount}></i>
                    </div>
                    <div className="label p-t-15">Notes (optional)</div>
                    <textarea className="app-textarea"/>
                </div>
                <ModifiersPreview addOptionalModifier={addOptionalModifier} addRequiredModifier={addRequiredModifier} addRequiredBaseModifier={addRequiredBaseModifier}/>
            </div>
            <div className="modal-footer">
                <div className="meal-preview-button">
                    {calculateMealPrice(selectedModifiers, amount) + CURRENCY}
                </div>
            </div>
        </div>
        </React.Fragment>
    );
};