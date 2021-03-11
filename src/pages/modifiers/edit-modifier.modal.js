import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import InputError from '../../components/input-error';
import { useSelector, useDispatch } from 'react-redux';
import { CURRENCY } from '../../util/consts';
import { errorToast } from '../../util/toasts/toasts';
import SubmitButton from '../../components/submit-button';
import { editModifierAPI } from '../../common/api/modifiers.api';
import { Radio } from 'antd';

export default function EditModifierModal(props) {

    const dispatch = useDispatch();
    const [modalOpacity, setModalOpacity] = useState(0);
    const {register, handleSubmit, errors} = useForm();
    const { loadingStatus, modifiers } = useSelector(state => state.modifiers);
    const [currentModifierType, setCurrentModifierType] = useState(props.modifier.modifierType);
    const [currentDefaultOption, setCurrentDefaultOption] = useState(props.modifier.defaultOption);
    const [options, setOptions] = useState(props.modifier.options);
    const [messages, setMessages] = useState({nameTaken:'', default:''});

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    const editModifier = (data) => {
        if(currentModifierType !== "optional" && currentDefaultOption === undefined){
            setMessages({...messages, default: "Please choose your default value"});
            return;
        }
        if(currentModifierType === "required" && +data["optionPrice"+currentDefaultOption] !== 0){
            setMessages({...messages, default: "Your default value must be 0 for this type of modifier"});
            return;
        }
        for(let i = 0; i < modifiers.length; i++){
            if(modifiers[i].modifier.name === data.name && props.modifier.name !== data.name){
                setMessages({...messages, nameTaken: "You already have modifier with this name"});
                return;
            }
        }
        data.options = {};
        for(let i = 0; i < options.length; i++){
            if(currentModifierType !== "optional" && options[i].index === +currentDefaultOption){
                data.defaultOption = data["optionName"+options[i].index];
            }
            data.options[data["optionName"+options[i].index]] = data["optionPrice"+options[i].index];
            delete data["optionName"+options[i].index];
            delete data["optionPrice"+options[i].index];
        }
        setMessages({nameTaken:'', default:''});
        data.modifierType = currentModifierType;
        dispatch(editModifierAPI({modifier: data, modifierId: props.modifier.modifierId}, props.closeModal));
    };

    const changeModifierType = (event) => {
        setCurrentModifierType(event.target.value);
    };

    const addNewOption = () => {
        // new option index is set to be maximum in options array
        let maxIndex = options.reduce((max, item) => item.index > max ? item.index : max, options[0].index);
        setOptions([...options, {index: maxIndex + 1, name:'', price:''}])
    };

    const deleteOption = (index) => {
        if(currentModifierType !== "optional"){
            for(let i = 0; i < options.length; i++){
                if(options[i].index === index && options[i].index === currentDefaultOption){
                    errorToast("You can't delete default option");
                    return;
                }
            }
        }
        setOptions(options.filter(optionItem => optionItem.index !== index));
    };

    return (
        <React.Fragment>
        <div className="modal-underlay" onClick={props.closeModal}></div>
        <div className="modal" style={{opacity:modalOpacity}}>
            <div className="modal-header">
                <i className="fas fa-times fa-2x" onClick={() => props.closeModal()}></i>
            </div>
            <div className="modal-body-vertical">
                <form onSubmit={handleSubmit(editModifier)}>
                    <div className="label-accent-color-2">Modifier name</div>
                    <input type="text" name="name" ref={register({required:true})} defaultValue={props.modifier.name} className="app-input"/>
                    {errors.name && <InputError text="Name is required"></InputError>}
                    {messages.nameTaken && <InputError text={messages.nameTaken}/>}
                    <div className="label-accent-color-2 p-t-15">Choose modifier type</div>
                    {messages.modifierType && <InputError text={messages.modifierType}/>}
                    <Radio.Group defaultValue={currentModifierType}>
                    <div className="modifier-type">
                        <Radio value="requiredBase" onChange={changeModifierType}/>
                        <div>
                            <div className="label m-0">Required base (determins starting price)</div>
                            <div className="modifier-example">Example: Small: 4$, Medium: 6$, Big: 8$...</div>
                        </div>
                    </div>
                    <div className="modifier-type">
                        <Radio value="required" onChange={changeModifierType}/>
                        <div>
                            <div className="label m-0">Required (may change price)</div>
                            <div className="modifier-example">Example: Normal pizza doe: 0$, Chicago pizza doe: 1$...</div>
                        </div>
                    </div>
                    <div className="modifier-type">
                        <Radio value="optional" onChange={changeModifierType}/>
                        <div>
                            <div className="label m-0">Optional (extras)</div>
                            <div className="modifier-example">Example: Ketchup: 0$, Cheese $1, Mustard: 0$...</div>
                            {currentModifierType === "optional" && 
                            <React.Fragment>
                                <label className="label">Maximum customer can pick</label><input type="number" name="maximum" ref={register({required:true, min:1, max:options.length})} defaultValue={props.modifier.maximum} className="app-input-number"/>
                                {errors.maximum && errors.maximum.type === "required" && <InputError text="Enter maximum"/>}
                                {errors.maximum && errors.maximum.type === "min" && <InputError text="Minimum value is 1"/>}
                                {errors.maximum && errors.maximum.type === "max" && <InputError text="Maximum is higher than your options size"/>}
                            </React.Fragment>}
                        </div>
                    </div>
                    </Radio.Group>
                    <div className="label-accent-color-2 p-t-15">
                        Options
                    </div>
                    <Radio.Group defaultValue={currentDefaultOption}>
                        {options.map(option => <div key={option.index} className="modifier-option">
                            <div className="modifier-name">
                                <input type="text" name={"optionName" + option.index} ref={register({required:true})} defaultValue={option.name} placeholder="Name" className="app-input"/>
                                {errors["optionName" + option.index] && <InputError text="Enter option name"/>}
                            </div>
                            <div className="modifier-price">
                                <input type="number" name={"optionPrice" + option.index} ref={register({required:true})} defaultValue={option.price} placeholder="Price" step="0.01" className="app-input-number"/>
                                <label className="label">{CURRENCY}</label>
                                {errors["optionPrice" + option.index] && <InputError text="Enter price"/>}
                            </div>
                            {currentModifierType !== "optional" && 
                            <div className="modifier-default">
                                <Radio value={option.index} onChange={() => setCurrentDefaultOption(option.index)}/>
                                <label className="label">Default</label>
                            </div>
                            }
                            {options.length > 1 &&
                            <div className="modifier-trash">
                                <i className="fas fa-trash fa-2x" onClick={() => deleteOption(option.index)}></i>
                            </div>
                            }
                        </div>)}
                        <div>{messages.default && <InputError text={messages.default}/>}</div>
                        <div className="add-new-option-button-container">
                            <button type="button" onClick={addNewOption} className="add-new-option-button">+ Add new option</button>
                        </div>
                    </Radio.Group>
                    <SubmitButton text="Save changes" loadingStatus={loadingStatus}/>
                </form>
            </div>
        </div>
        </React.Fragment>
    );
};