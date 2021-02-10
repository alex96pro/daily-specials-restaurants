import {toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "./toasts.scss";

export function infoToast(text, time = 1200){
    return toast.info(text, {
        autoClose: time,
        pauseOnHover: false,
        containerId: "top-center",
    });
};

export function successToast(text, time = 1500){
    return toast.success(text, {
        autoClose: time,
        pauseOnHover: false,
        containerId: "top-center"
    });
};

export function errorToast(text, time = 3000){
    return toast.error(text, {
        autoClose: time,
        pauseOnHover: false,
        containerId: "top-center"
    });
}; 
     