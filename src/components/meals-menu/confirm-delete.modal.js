import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteMenuMealAPI } from '../../common/api/menu.api';
import Loader from '../../components/common/loader';

export default function ConfirmDelete(props) {

    const [modalOpacity, setModalOpacity] = useState(0);
    const {loadingStatus} = useSelector(state => state.menu);
    const dispatch = useDispatch();

    const successfullDelete = () => {
        props.closeModal();
    };

    const deleteMeal = () => {
        dispatch(deleteMenuMealAPI(props.meal.mealId, successfullDelete));
    };

    useEffect(() => {
        setModalOpacity(1);
    }, []);


    return (
        <div className="modal">
            <div className="modal-overlay" onClick={props.closeModal}></div>
            <div className="modal-container" style={{opacity:modalOpacity}}>
                <div className="modal-header">
                    <button onClick={props.closeModal} className="modal-x">x</button>
                </div>
                <div className="modal-body">
                    <div className="label-accent-color">Are you sure you want to delete "{props.meal.name}" from your menu?</div>
                    <button onClick={deleteMeal} type="button" className="button-long">
                        {loadingStatus ? <Loader small={true}/> : 'Delete'}
                    </button>
                </div>
                
            </div>
        </div>
    );
};