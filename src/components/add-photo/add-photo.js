import './add-photo.scss';
import React, { useState, useCallback } from 'react';
import Slider from '@material-ui/lab/Slider';
import Cropper from 'react-easy-crop';
import getCroppedImg from './crop-image';
import Loader from '../../components/common/loader';

export default function AddPhoto(props){

    const [photo, setPhoto] = useState('');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    // eslint-disable-next-line
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [message, setMessage] = useState('');
    const [loadingStatus, setLoadingStatus] = useState(false);
  
    const changePhoto = (event) => {
        const file = event.target.files[0];
        const acceptedFiles = ["image/jpeg", "image/jpg", "image/png"];
        if(file){
            if(!acceptedFiles.includes(file.type)){
                setMessage('Only jpeg, jpg or png photos allowed');
                return;
            }
            if(Math.trunc(file.size / 1024 / 1024) >= 10){
                setMessage('Maximal photo size is 10MB');
                return;
            }
            setMessage('');
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPhoto(reader.result);
            }
        }
    };

    const showCroppedImage = useCallback(async () => {
        try {
            if(photo){
                setLoadingStatus(true);
                const croppedImage = await getCroppedImg(
                    photo,
                    croppedAreaPixels,
                    rotation
                );
                setLoadingStatus(false);
                props.setPhoto(croppedImage);
                props.closeModal();
            }
        } catch (e) {
          console.error(e)
        }
    }, [croppedAreaPixels, rotation, props, photo]);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const cropperStyle = {
        containerStyle: {borderRadius: '0'}, 
        mediaStyle: {borderRadius: '0'}, 
        cropAreaStyle: {borderRadius: '0'}
    };
    
    return (
    <div className="add-photo">
        <div className="crop-container" style={{border: photo ? 'none' : '2px dotted black'}}>
            <Cropper
                image={photo ? photo : props.photo}
                crop={crop}
                zoom={zoom}
                aspect={1 / 1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={cropperStyle}
            />
        </div>
        <div className="slider-container">
            <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e, zoom) => setZoom(zoom)}
                classes={{ container: 'slider' }}
            />
        </div>    
            
        <input type="file" accept="image/jpeg, image/jpg, image/png" id="file" onChange={changePhoto} className="input-file"/>
        <label htmlFor="file" className="input-file-button">
            <i className="fas fa-cloud-upload-alt fa-1x"></i>
            Choose a photo
        </label>
        <button onClick={showCroppedImage} className="input-file-button" disabled={loadingStatus}>{loadingStatus ? <Loader small={true}/> : 'Done'}</button>
        <div className="add-photo-error">{message}</div>
    </div>
    )
};
