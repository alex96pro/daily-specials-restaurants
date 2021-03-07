import './modifiers.page.scss';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getModifiersAPI } from '../../common/api/modifiers.api';
import NavBar from '../../components/nav-bar/nav-bar';
import Loader from '../../components/loader';
import AddModifierModal from './add-modifier.modal';
import DeleteModifierModal from './delete-modifier.modal';
import EditModifierModal from './edit-modifier.modal';
import CopyModifierModal from './copy-modifier.modal';

export default function Modifiers() {

    const dispatch = useDispatch();
    const {modifiers, loadingModifiersPage} = useSelector(state => state.modifiers);
    const [addModifierModal, setAddModifierModal] = useState(false);
    const [deleteModifierModal, setDeleteModifierModal] = useState({show: false, modifier: ''});
    const [editModifierModal, setEditModifierModal] = useState({show: false, modifier:''});
    const [copyModifierModal, setCopyModifierModal] = useState({show: false, modifier:''});

    const prepareDataForEdit = (modifier, type) => {
        let arrayOfOptions = [];
        let indexCount = 0;
        for(let property in modifier.modifier.options){
            arrayOfOptions.push({index: indexCount, name: property, price: modifier.modifier.options[property]});
            indexCount++;
        }
        let data = {};
        data.options = arrayOfOptions;
        data.name = modifier.modifier.name;
        data.modifierId = modifier.modifierId;
        data.modifierType = modifier.modifier.modifierType;
        if(modifier.modifier.defaultOption){
            for(let i = 0; i < arrayOfOptions.length; i++){
                if(arrayOfOptions[i].name === modifier.modifier.defaultOption){
                    data.defaultOption = i;
                    break;
                }
            }
        }else{
            data.maximum = modifier.modifier.maximum;
        }
        if(type === "EDIT"){
            setEditModifierModal({show: true, modifier: data});
        }else{
            delete data.name;
            delete data.modifierId;
            setCopyModifierModal({show: true, modifier: data});
        }
    };

    useEffect(() => {
        dispatch(getModifiersAPI());    
    }, [dispatch]);

    return (
        <div className="modifiers">
            <NavBar loggedIn={true}/>
            {loadingModifiersPage ? <Loader className="loader-center"/>
            :
            <div className="modifiers-container">
                <div className="header">Your modifiers</div>
                <button className="button-long" onClick={() => setAddModifierModal(true)}>Add new modifier</button>
                {modifiers.map(modifierItem => <div key={modifierItem.modifierId} className="modifier">
                    {/* {Object.keys(modifier.modifier.values).map(key =>
                    <div key={key} className="flex-row">
                        <input value={key} key={key} type="radio"/>
                        <div className="label">{key}
                            {modifier.modifier.values[key] ? ' '+modifier.modifier.values[key] + CURRENCY : ''}
                        </div>
                    </div>)}  */}
                    <div className="label">{modifierItem.modifier.name}</div>
                    <div>
                        <i className="fas fa-copy fa-2x copy-icon" onClick={() => prepareDataForEdit(modifierItem, "COPY")}></i>
                        <i className="fas fa-edit fa-2x" onClick={() => prepareDataForEdit(modifierItem, "EDIT")}></i>
                        <i className="fas fa-trash fa-2x" onClick={() => setDeleteModifierModal({show: true, modifier: modifierItem})}></i>
                    </div>
                </div>)}
            </div>
            }
            {addModifierModal && <AddModifierModal closeModal={() => setAddModifierModal(false)}/>}
            {deleteModifierModal.show && <DeleteModifierModal modifier={deleteModifierModal.modifier} closeModal={() => setDeleteModifierModal({show: false, modifier: ''})}/>}
            {editModifierModal.show && <EditModifierModal modifier={editModifierModal.modifier} closeModal={() => setEditModifierModal({show:false, modifier:''})}/>}
            {copyModifierModal.show && <CopyModifierModal modifier={copyModifierModal.modifier} closeModal={() => setCopyModifierModal({show:false, modifier:''})}/>}
        </div>
    );
};