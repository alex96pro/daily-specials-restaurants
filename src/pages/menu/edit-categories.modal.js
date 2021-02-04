//import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function EditCategoriesModal(props) {
    
    //const {register, handleSubmit, errors} = useForm();
    const [modalOpacity, setModalOpacity] = useState(0);
    const {categories} = useSelector(state => state.menu);
    //const [message, setMessage] = useState('');

    useEffect(() => {
        setModalOpacity(1);
    }, []);

    return (
        <div className="modal">
            <div className="modal-overlay" onClick={() => props.closeModal()}></div>
            <div className="modal-container" style={{opacity:modalOpacity}}>
                <div className="modal-x-container">
                    <button onClick={() => props.closeModal()} className="modal-x">x</button>
                </div>
                <div className="wrapper-container">
                    <div className="label-accent-color">Add new category</div>
                    <input type="text" style={{width:'50%'}}/>
                    <button className="button-small">Add</button>
                </div>
                <div className="wrapper-container">
                    <div className="label-accent-color">Remove category</div>
                    <select style={{width:'50%'}}>
                        {categories.map((category, index) => <option value={category} key={index}>
                            {category}
                        </option>)}
                    </select>
                    <button className="button-small">Remove</button>
                </div>
            </div>
        </div>
    );
};