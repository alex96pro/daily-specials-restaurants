import imageCompression from 'browser-image-compression'; 

export function getClientDateAndTime(dateOnly = false, dateWithMidnightTime = false) {
    let today = new Date();
    let day = today.getDate();
    day = day < 10 ? '0' + day : day;
    let month = today.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    if(dateOnly){
        return today.getFullYear() + '-' + month + '-' + day;
    }
    if(dateWithMidnightTime){
        return today.getFullYear() + '-' + month + '-' + day + ' 00:00:00';
    }
    let hours = today.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let minutes = today.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let seconds = today.getSeconds();
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return today.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
};

export function getNextWeekDates() {
    let days = [];
    let daysNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for(let i = 0; i < 7; i++){
        let date = new Date();
        date.setDate(date.getDate() + i);
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let month = (date.getMonth() + 1 ) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        days.push({
            dbFormat: date.getFullYear() + '-' + month + '-' + day,
            value: day + '-' + month + '-' + date.getFullYear(),
            dayName: daysNames[date.getDay()]
        });
    }
    return days;
};

export function checkTag(newTagForCheck, setNewTag, tags, setTags, setTagMessage) {
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
        setNewTag('');
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