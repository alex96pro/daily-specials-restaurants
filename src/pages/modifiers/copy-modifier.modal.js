import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import InputError from '../../components/input-error';
import { useSelector, useDispatch } from 'react-redux';
import { CURRENCY } from '../../util/consts';
import { errorToast } from '../../util/toasts/toasts';
import { addNewModifierAPI } from '../../common/api/modifiers.api';
import { Radio } from 'antd';
import SubmitButton from '../../components/submit-button';

export default function CopyModifierModal(props) {

    const dispatch = useDispatch();
    const [modalOpacity, setModalOpacity] = useState(0);
    const {register, handleSubmit, errors} = useForm();
    const [messages, setMessages] = useState({nameTaken:'', default:''});
    const { loadingStatus, modifiers } = useSelector(state => state.modifiers);
    const [currentDefaultOption, setCurrentDefaultOption] = useState(props.modifier.defaultOption);
    const [options, setOptions] = useState(props.modifier.options);

    const copyModifier = (data) => {
        if(props.modifier.modifierType === "required" && +data["optionPrice"+currentDefaultOption] !== 0){
            setMessages({...messages, default: "Your default value must be 0 for this type of modifier"});
            return;
        }
        for(let i = 0; i < modifiers.length; i++){
            if(modifiers[i].modifier.name === data.name){
                setMessages({...messages, nameTaken: "You already have modifier with this name"});
                return;
            }
        }
        data.modifierType = props.modifier.modifierType;
        data.options = {};
        for(let i = 0; i < options.length; i++){
            if(props.modifier.modifierType !== "optional" && options[i].index === +currentDefaultOption){
                data.defaultOption = data["optionName"+options[i].index];
            }
            data.options[data["optionName"+options[i].index]] = data["optionPrice"+options[i].index];
            delete data["optionName"+options[i].index];
            delete data["optionPrice"+options[i].index];
        }
        setMessages({nameTaken:'', default:''});
        dispatch(addNewModifierAPI(data, props.closeModal));
    };

    const addNewOption = () => {
        let maxIndex = options.reduce((max, item) => item.index > max ? item.index : max, options[0].index);
        setOptions([...options, {index: maxIndex + 1, name:'', price:''}])
    };

    const deleteOption = (index) => {
        if(props.modifier.modifierType !== "optional"){
            for(let i = 0; i < options.length; i++){
                if(options[i].index === index && options[i].index === currentDefaultOption){
                    errorToast("You can't delete default option");
                    return;
                }
            }
        }
        setOptions(options.filter(optionItem => optionItem.index !== index));
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
                <form onSubmit={handleSubmit(copyModifier)}>
                    <div className="label">Modifier name</div>
                    <input type="text" name="name" ref={register({required:true})} className="app-input"/>
                    {errors.name && <InputError text="Name is required"></InputError>}
                    {messages.nameTaken && <InputError text={messages.nameTaken}/>}
                    <div className="label p-t-15">Modifier type</div>
                    <div className="label">
                        {props.modifier.modifierType === "requiredBase" && 'Required base (determins starting price)'}
                        {props.modifier.modifierType === "required" && 'Required (may change price)'}
                        {props.modifier.modifierType === "optional" && 'Optional (extras)'}
                    </div>
                    {props.modifier.modifierType === "optional" &&
                    <React.Fragment>
                        <label className="label">Maximum customer can pick</label><input type="number" name="maximum" ref={register({required:true, min:1, max:options.length})} defaultValue={props.modifier.maximum} className="app-input-number"/>
                        {errors.maximum && errors.maximum.type === "required" && <InputError text="Enter maximum"/>}
                        {errors.maximum && errors.maximum.type === "min" && <InputError text="Minimum value is 1"/>}
                        {errors.maximum && errors.maximum.type === "max" && <InputError text="Maximum is higher than your options size"/>}
                    </React.Fragment>}
                    <div className="label p-t-15">
                        Options
                    </div>
                    <Radio.Group defaultValue={currentDefaultOption}>
                        {options.map(option => <div key={option.index} className="modifier-option">
                            <div className="modifier-name">
                                <input type="text" name={"optionName"+option.index} ref={register({required:true})} defaultValue={option.name} placeholder="Name" className="app-input"/>
                                {errors["optionName" + option.index] && <InputError text="Enter option name"/>}
                            </div>
                            <div className="modifier-price">
                                <div className="flex-row">
                                    <input type="number" name={"optionPrice"+option.index} ref={register({required:true})} defaultValue={option.price} placeholder="Price" step="0.01" className="app-input-number input-with-icon"/>
                                    <span className="input-icon">{CURRENCY}</span>
                                </div>
                                {errors["optionPrice" + option.index] && <InputError text="Enter price"/>}
                            </div>
                            {props.modifier.modifierType !== "optional" && 
                            <div className="modifier-default">
                                <Radio value={option.index} onChange={() => setCurrentDefaultOption(option.index)}/>
                                <label className="label m-0 m-r-15">Default</label>
                            </div>
                            }
                            {options.length > 1 &&
                            <div className="modifier-trash">
                                <i className="fas fa-trash fa-2x" onClick={() => deleteOption(option.index)}></i>
                            </div>
                            }
                        </div>)}
                        {errors.defaultOption && <InputError text="Please select default option"/>}
                        {messages.default && <InputError text={messages.default}/>}
                        <div className="add-new-option-button-container">
                            <button type="button" onClick={addNewOption} className="add-new-option-button">+ Add new option</button>
                        </div>
                    </Radio.Group>
                    <SubmitButton text="Finish adding modifier" loadingStatus={loadingStatus} className="button-long"/>
                </form>
            </div>
        </div>
        </React.Fragment>
    );
};