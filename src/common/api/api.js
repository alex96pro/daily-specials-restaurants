import axios from 'axios';
import { BACKEND_API } from '../../util/consts';

export async function get(url, isPrivate, message){
    try{
        if(isPrivate){
            let response = await axios.get(BACKEND_API + url, {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            return response;
        }else{
            let response = await axios.get(BACKEND_API + url);
            return response;
        }
        
    }catch(err){
        switch(err.response.status){
            case 500:
                return ('Server down');
            default:
                return message[err.response.status];
        }
    }
};

export async function post(url, data, isPrivate, message){
    try{
        if(isPrivate){
            let response = await axios.post(BACKEND_API + url, data, {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            return response;
        }else{
            let response = await axios.post(BACKEND_API + url, data);
            return response;
        }
        
    }catch(err){
        switch(err.response.status){
            case 500:
                return ('Server down');
            default:
                return message[err.response.status];
        }
    }
};

export async function put(url, data, isPrivate, message){
    try{
        if(isPrivate){
            let response = await axios.put(BACKEND_API + url, data, {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            return response;
        }else{
            let response = await axios.get(BACKEND_API + url, data);
            return response;
        }
    }catch(err){
        switch(err.response.status){
            case 500:
                return ('Server down');
            default:
                return message[err.response.status];
        }
    }
};

export async function deleteRequest(url, isPrivate, message){
    try{
        if(isPrivate){
            let response = await axios.delete(BACKEND_API + url, {headers:{'Authorization':`Basic ${localStorage.getItem("ACCESS_TOKEN_RESTAURANT")}`}});
            return response;
        }else{
            let response = await axios.delete(BACKEND_API + url);
            return response;
        }
        
    }catch(err){
        switch(err.response.status){
            case 500:
                return ('Server down');
            default:
                return message[err.response.status];
        }
    }
};