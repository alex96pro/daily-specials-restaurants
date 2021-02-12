export function getTodayDate() {
    let today = new Date();
    return today.getDate()+"."+(today.getMonth()+1)+"."+today.getFullYear();
};
export function getClientDate() {
    let today = new Date();
    return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
};