import { UserActionTypes } from './user.types';
import axios from 'axios';
import { RestAPI } from '../api-config';

export const sendForgotPassword = dispatch => async email => {
    try {
        const result = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "general/users/forgotpassword", { email: email});        
        return result.data.message;        
    } catch (error) {
        console.log(error.message);
    }
}

export const sendResetPassword = dispatch => async (userID, code, password) => {
    const obj = {
        id: userID,
        forgot_link: code,
        password: password
    }
    try {
        const result = await axios.put( RestAPI.ORIGINAL_ENDPOINT + "general/users/resetpassword", obj);        
        return result.data.message;        
    } catch (error) {
        console.log(error.message);
    }
}

export const setCurrentUser = dispatch => async (user) => {

    try {
        const result = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "general/users", user);        
        return result.data.message;
        
    } catch (error) {
        console.log(error.message);
    }
}

export const getVerifiedStatus = dispatch => async (user) => {

    try {
        console.log(user);
        const userData = await axios.get( RestAPI.ORIGINAL_ENDPOINT + "general/users/verifiedstatus/" + user);     
        return userData.data;
        
    } catch (error) {
        console.log(error.message);
    }
}

export const setVerifiedUser = dispatch => async (user, isEmailVerified = false, isPhoneVerified = false ) => {
    try {
        console.log(user);
        const userData = await axios.get( RestAPI.ORIGINAL_ENDPOINT + "general/users/verifiedstatus/" + user);
        let userInfo = userData.data;
        if(!isEmailVerified && !isPhoneVerified)
            userInfo.is_verified = true;
        else{
            if(isEmailVerified && isPhoneVerified){
                userInfo.is_email_verified = true;
                userInfo.is_phone_verified = true;
                userInfo.is_verified = true;
            }                
            else{
                userInfo.is_email_verified = isEmailVerified;
                userInfo.is_phone_verified = isPhoneVerified;
                userInfo.is_verified = false;
            }
        }
        const result = await axios.put( RestAPI.ORIGINAL_ENDPOINT + "general/users/verifiedstatus/"+user, userInfo); 
        return result;
    } catch (error) {
        console.log(error.message);
    }
}

export const getCurrentUser = dispatch => async (user, fromDB, token = null) => {

    let header = {}
    if (token)
        header = {
            'Authorization': token
        }
    else
        header =  {
        'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
        }

    try {
        const result = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "consumer/users/login", null, { 
            headers: header
        });
        if(fromDB === "fromDB")
            return result.data; 
        else{
            dispatch(addCurrentUser(result.data));
            return result.data.first_name;
        }                
        
    } catch (error) {
        console.log("Not registered user! Check and try again.");
    }
    
}

export const updateCurrentUser = dispatch => async (user, token = null) => {  
    console.log("Update axios ===", user, token);  

    let header = {}
    if (token)
        header = {
            'Authorization': token
        }
    else
        header =  {
        'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
        }

    try {
        const result = await axios.put( RestAPI.ORIGINAL_ENDPOINT + "consumer/users/profile", user, { 
            headers: header
        });

        if (!token)
            dispatch(addCurrentUser(result.data.message));

    } catch (error) {
        console.log(error.message);
    }
}

export const delCurrentUser = () => ({
    type: UserActionTypes.DEL_CURRENT_USER
})
const addCurrentUser = user => ({
    type: UserActionTypes.ADD_CURRENT_USER,
    payload: user
});
