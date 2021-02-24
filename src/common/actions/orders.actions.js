export const ADD_NEW_ORDER = "ADD_NEW_ORDER";
export const ACCEPT_ORDER = "ACCEPT_ORDER";
export const REJECT_ORDER = "REJECT_ORDER";

export function addNewOrder(payload) {
    return {
        type: ADD_NEW_ORDER,
        payload
    };
};
export function acceptOrder(payload) {
    return {
        type: ACCEPT_ORDER,
        payload
    };
};
export function rejectOrder(payload) {
    return {
        type: REJECT_ORDER,
        payload
    };
};
