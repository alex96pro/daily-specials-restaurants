import './modifiers.page.scss';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getModifiersAPI } from '../../common/api/modifiers.api';
import NavBar from '../../components/nav-bar/nav-bar';
import Loader from '../../components/loader';
import AddModifierModal from './add-modifier.modal';
import DeleteModifierModal from './delete-modifier.modal';

export default function Modifiers() {

    const dispatch = useDispatch();
    const {modifiers, loadingModifiersPage} = useSelector(state => state.modifiers);
    const [addModifierModal, setAddModifierModal] = useState(false);
    const [deleteModifierModal, setDeleteModifierModal] = useState({show: false, modifier: ''});

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
                        <i className="fas fa-copy fa-2x copy-icon"></i>
                        <i className="fas fa-edit fa-2x"></i>
                        <i className="fas fa-trash fa-2x" onClick={() => setDeleteModifierModal({show: true, modifier: modifierItem})}></i>
                    </div>
                </div>)}
            </div>
            }
            {addModifierModal && <AddModifierModal closeModal={() => setAddModifierModal(false)}/>}
            {deleteModifierModal.show && <DeleteModifierModal modifier={deleteModifierModal.modifier} closeModal={() => setDeleteModifierModal({show: false, modifier: ''})}/>}
        </div>
    );
};