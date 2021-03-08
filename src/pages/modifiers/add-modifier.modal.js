import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { CURRENCY } from '../../util/consts';
import { useDispatch, useSelector } from 'react-redux';
import { errorToast } from '../../util/toasts/toasts' 
import { addNewModifierAPI } from '../../common/api/modifiers.api';
import InputError from '../../components/input-error';
import SubmitButton from '../../components/submit-button';

export default function AddModifierModal(props) {
    
    const {register, handleSubmit, errors} = useForm();
    const [modalOpacity, setModalOpacity] = useState(0);
    const { modifiers, loadingStatus } = useSelector(state => state.modifiers);
    const dispatch = useDispatch();
    const [messages, setMessages] = useState({nameTaken:'', default:''});
    const [options, setOptions] = useState([0]);
    const [currentModifierType, setCurrentModifierType] = useState('');
    const [currentDefaultOption, setCurrentDefaultOption] = useState(0);

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    const changeModifierType = (event) => {
        setCurrentModifierType(event.target.value);
    };

    const addNewOption = () => {
        // set new option index to highest value in options array + 1 so that key for rendering inputs is always unique
        setOptions([...options, Math.max(...options) + 1]);
    };

    const deleteOption = (index) => {
        if(currentModifierType !== "optional" && index === currentDefaultOption){
            errorToast("You can't delete default option");
            return;
        }
        setOptions(options.filter(optionIndex => optionIndex !== index));
    };

    const finishAddingModifier = (data) => {
        let optionsData = {};
        if(data.modifierType === "required" && +data["optionPrice"+currentDefaultOption] !== 0){
            setMessages({...messages, default: "Your default value must be 0 for this type of modifier"});
            return;
        }
        if(data.modifierType !== "optional" && !data.defaultOption){
            setMessages({...messages, default: "Please choose your default value"});
            return;
        }
        data.name = data.name.trim('');
        for(let i = 0; i < modifiers.length; i++){
            if(modifiers[i].modifier.name === data.name){
                setMessages({...messages, nameTaken:'You already have modifier with this name'});
                return;
            }
        }
        // create JSON object from data
        for(let i = 0; i < options.length; i++){
            if(currentModifierType !== "optional" && options[i] === +data.defaultOption){
                data.defaultOption = data["optionName"+options[i]];
            }
            optionsData[data["optionName"+options[i]]] = data["optionPrice"+options[i]];
            delete data["optionName"+options[i]];
            delete data["optionPrice"+options[i]];
        }
        data.options = optionsData;
        setMessages({nameTaken:'', default:''});
        // console.log(data);
        dispatch(addNewModifierAPI(data, props.closeModal));
    };

    return (
        <React.Fragment>
        <div className="modal-underlay" onClick={props.closeModal}></div>
        <div className="modal" style={{opacity:modalOpacity}}>
            <div className="modal-header">
                <i className="fas fa-times fa-2x" onClick={() => props.closeModal()}></i>
            </div>
            <div className="modal-body-vertical">
                <form onSubmit={handleSubmit(finishAddingModifier)}>
                    <div className="label-accent-color-2">Modifier name</div>
                    <input type="text" name="name" ref={register({required:true})}/>
                    {errors.name && <InputError text="Name is required"></InputError>}
                    {messages.nameTaken && <InputError text={messages.nameTaken}/>}
                    <div className="label-accent-color-2 p-t-15">Choose modifier type</div>
                    {errors.modifierType && <InputError text="Please choose modifier type"/>}
                    <div className="modifier-type">
                        <input type="radio" name="modifierType" ref={register({required:true})} value="requiredBase" onChange={changeModifierType}/>
                        <div>
                            <div className="label m-0">Required base (determins starting price)</div>
                            <div className="modifier-example">Example: Small: 4$, Medium: 6$, Big: 8$...</div>
                        </div>
                    </div>
                    <div className="modifier-type">
                        <input type="radio" name="modifierType" ref={register({required:true})} value="required" onChange={changeModifierType}/>
                        <div>
                            <div className="label m-0">Required (may change price)</div>
                            <div className="modifier-example">Example: Normal pizza doe: 0$, Chicago pizza doe: 1$...</div>
                        </div>
                    </div>
                    <div className="modifier-type">
                        <input type="radio" name="modifierType" ref={register({required:true})} value="optional" onChange={changeModifierType}/>
                        <div>
                            <div className="label m-0">Optional (extras)</div>
                            <div className="modifier-example">Example: Ketchup: 0$, Cheese $1, Mustard: 0$...</div>
                            {currentModifierType === "optional" && 
                            <React.Fragment>
                                <label className="label">Maximum customer can pick</label><input type="number" name="maximum" ref={register({required:true, min:1, max: options.length})}/>
                                {errors.maximum && errors.maximum.type === "required" && <InputError text="Enter maximum"/>}
                                {errors.maximum && errors.maximum.type === "min" && <InputError text="Minimum value is 1"/>}
                                {errors.maximum && errors.maximum.type === "max" && <InputError text="Maximum is higher than your options size"/>}
                            </React.Fragment>}
                        </div>
                    </div>
                    <div className="label-accent-color-2 p-t-15">
                        Options
                    </div>
                    {options.map(optionIndex => 
                    <div className="modifier-option" key={optionIndex}>
                        <div className="modifier-name">
                            <input type="text" name={"optionName" + optionIndex} ref={register({required:true})} placeholder="Name"/>
                            {errors["optionName" + optionIndex] && <InputError text="Enter option name"/>}
                        </div>
                        <div className="modifier-price">
                            <input type="number" name={"optionPrice" + optionIndex} ref={register({required:true})} placeholder="Price"/><label className="label">{CURRENCY}</label>
                            {errors["optionPrice" + optionIndex] && <InputError text="Enter price"/>}
                        </div>
                        {(currentModifierType === "requiredBase" || currentModifierType === "required") && 
                        <div className="modifier-default">
                            <input type="radio" name="defaultOption" ref={register({required:true})} value={optionIndex} onChange={() => setCurrentDefaultOption(optionIndex)} defaultChecked={optionIndex === currentDefaultOption}/>
                            <label className="label">Default</label>
                        </div>
                        }
                        {options.length > 1 && 
                        <div className="modifier-trash">
                            <i className="fas fa-trash fa-2x" onClick={() => deleteOption(optionIndex)}></i>
                        </div>}
                    </div>
                    )}
                    {errors.defaultOption && <InputError text="Please select default option"/>}
                    {messages.default && <InputError text={messages.default}/>}
                    <div>
                        <button type="button" onClick={addNewOption} className="add-new-modifier-option">+ Add new option</button>
                    </div>
                    <SubmitButton loadingStatus={loadingStatus} text="Finish adding modifier"/>
                </form>
            </div>
        </div>
        </React.Fragment>
    );
};