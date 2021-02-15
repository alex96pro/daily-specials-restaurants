import imageCompression from 'browser-image-compression'; 

export function getTodayDate() {
    let today = new Date();
    return today.getDate()+"."+(today.getMonth()+1)+"."+today.getFullYear();
};
export function getClientDate() {
    let today = new Date();
    return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
};
export async function compressPhoto(croppedPhoto) {
    try {
        const options = {
            maxSizeMB: 0.25,
            maxWidthOrHeight: 1024
        };
        const croppedPhotoFile = await imageCompression.getFilefromDataUrl(croppedPhoto);
        const compressedFile = await imageCompression(croppedPhotoFile, options);
        const compressedPhotoURL = await imageCompression.getDataUrlFromFile(compressedFile);
        return compressedPhotoURL;
    }catch (error) {
        console.log(error);
        return null;
    }
}