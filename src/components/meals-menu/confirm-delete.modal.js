import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteMenuMealAPI } from '../../common/api/menu.api';
import ConfirmButton from '../../components/confirm-button';

export default function ConfirmDelete(props) {

    const dispatch = useDispatch();
    const [modalOpacity, setModalOpacity] = useState(0);
    const {loadingStatus} = useSelector(state => state.menu);

    const deleteMeal = () => {
        dispatch(deleteMenuMealAPI(props.meal.mealId, props.closeModal));
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
                    <div className="label-accent-color">Are you sure you want to delete "{props.meal.name}" from your menu?</div>
                    <ConfirmButton loadingStatus={loadingStatus} onClick={deleteMeal} text="Delete"/>
                </div>
            </div>
        </div>
    );
};