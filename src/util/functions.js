import imageCompression from 'browser-image-compression'; 

export function getTodayDate() {
    let today = new Date();
    return today.getDate()+"."+(today.getMonth()+1)+"."+today.getFullYear();
};

export function getClientDate() {
    let today = new Date();
    return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
};

export function checkTag(newTagForCheck, tags, setTags, setTagMessage) {
    if(tags.length === 10){
        setTagMessage('Maximal number of tags is 10');
        return;
    }
    let newTag = newTagForCheck.trim().replace(/ /g,'').replace(/#/g,'').replace(/,/g,'').toLowerCase();
    if(newTag.length === 0){
        setTagMessage('Please enter valid tag name');
    }
    else if(newTag.length > 25){
        setTagMessage('Tags are limited to 25 characters');
    }
    else if(tags.includes(newTag)){
        setTagMessage('Tag already exists');
    }
    else{
        setTags([...tags, newTag]);
        setTagMessage('');
    }  
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