import './modifiers-preview.scss';
import { CURRENCY } from '../../util/consts';
import { useSelector } from 'react-redux';
import { Checkbox, Radio } from 'antd';
import React from 'react';

export default function ModifiersPreview(props) {

    const modifiers = useSelector(state => state.meal.mealModifiers);
    // IMPORTANT !!!
    // Radio.Group has its own class which is overriden in elements.scss
    return (
        <div className="modifiers-preview">
            {modifiers.map(modifier => modifier.modifier.modifierType === "requiredBase" && 
            <React.Fragment key={modifier.modifierId}>
            <div className="label-accent-color-2 p-t-15 p-l-15">Choose {modifier.modifier.name}</div>
            <div className="modifiers-container">
                <Radio.Group defaultValue={modifier.modifier.defaultOption}>
                    {Object.keys(modifier.modifier.options).map(key =>
                    <label key={"requiredBase"+key} htmlFor={"option-"+modifier.modifierId+"-"+key} className="modifiers-option">
                        <Radio id={"option-"+modifier.modifierId+"-"+key} value={key} onChange={() => props.addRequiredBaseModifier(modifier.modifier.options[key])}/>
                        <div className="modifier-option-info">
                            <div className="label">{key}</div>
                            <div className="label" style={{alignSelf:'flex-end'}}>{modifier.modifier.options[key] ? ' '+modifier.modifier.options[key] + CURRENCY : ''}</div>
                        </div>
                    </label>
                    )} 
                </Radio.Group>
            </div>
            </React.Fragment>)}
            
            {modifiers.map(modifier => modifier.modifier.modifierType === "required" && 
            <React.Fragment key={modifier.modifierId}>
            <div className="label-accent-color-2 p-t-15 p-l-15">Choose {modifier.modifier.name}</div>
            <div className="modifiers-container">
                <Radio.Group defaultValue={modifier.modifier.defaultOption}>
                    {Object.keys(modifier.modifier.options).map(key =>
                    <label key={"required"+key} htmlFor={"option-"+modifier.modifierId+"-"+key} className="modifiers-option">
                        <Radio id={"option-"+modifier.modifierId+"-"+key} value={key} onChange={() => props.addRequiredModifier(modifier.modifierId, modifier.modifier.options[key])}/>
                        <div className="modifier-option-info">
                            <div className="label">{key}</div>
                            <div className="label">{modifier.modifier.options[key] ? ' '+modifier.modifier.options[key] + CURRENCY : ''}</div>
                        </div>
                    </label>
                    )} 
                </Radio.Group>
            </div>
            </React.Fragment>)}

            {modifiers.map(modifier => modifier.modifier.modifierType === "optional" && 
            <React.Fragment key={modifier.modifierId}>
            <div className="label-accent-color-2 p-t-15 p-l-15">Choose {modifier.modifier.name} (max {modifier.modifier.maximum})</div>
            <div className="modifiers-container">
                {Object.keys(modifier.modifier.options).map(key =>
                    <label key={"optional"+key} htmlFor={"optional-"+key+"-"+modifier.modifierId} className="modifiers-option">
                    <Checkbox onChange={(event) => props.addOptionalModifier(event, modifier.modifierId, key, modifier.modifier.options[key])} id={"optional-"+key+"-"+modifier.modifierId}/>
                    <div className="modifier-option-info">
                        <div className="label">{key}</div>
                        <div className="label">{modifier.modifier.options[key] ? ' '+modifier.modifier.options[key] + CURRENCY : ''}</div>
                    </div>
                    </label>
                )}
            </div>
            </React.Fragment>)}
        </div>
    );
};