import React, { useState, useCallback } from 'react';
import Slider from '@material-ui/lab/Slider'
import Cropper from 'react-easy-crop';
import getCroppedImg from './crop-image';
import UploadIcon from '../../images/upload-icon.png';
import './add-photo.scss';

export default function AddPhoto(props){

    const [photo, setPhoto] = useState('');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    // eslint-disable-next-line
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
    const changePhoto = (event) => {
        const file = event.target.files[0];
        if(file){
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
                const croppedImage = await getCroppedImg(
                    photo,
                    croppedAreaPixels,
                    rotation
                );
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
                image={photo}
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
            
        <input type="file" id="file" onChange={changePhoto} className="input-file"/>
        <label htmlFor="file" className="input-file-button">
            <img src={UploadIcon} alt="upload" className="upload-icon"/>
            Choose a photo
        </label>
        <button onClick={showCroppedImage} className="input-file-button">Done</button>
    </div>
    )
};
