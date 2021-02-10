import { useState, useEffect } from 'react';

export default function Advertisement(props) {

    const [modalOpacity, setModalOpacity] = useState(0);

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
                    <div className="header-accent-color">Limit of 3 specials per day is not enough for you?</div>
                    <button className="button-long">Upgrade account</button>
                </div>
            </div>
        </div>
    );
};