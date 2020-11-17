import { UserActionTypes } from './user.types';
import axios from 'axios';
import { RestAPI } from '../api-config';

export const sendForgotPassword = dispatch => async email => {
    try {
        const result = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "users/forgotpassword", { email: email});        
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
        const result = await axios.put( RestAPI.ORIGINAL_ENDPOINT + "users/resetpassword", obj);        
        return result.data.message;        
    } catch (error) {
        console.log(error.message);
    }
}

export const setCurrentUser = dispatch => async (user) => {

    try {
        const result = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "users/signup", user);        
        return result.data.message;
        
    } catch (error) {
        console.log(error.message);
    }
}

export const setVerifiedUser = dispatch => async (user, isEmailVerified = false, isPhoneVerified = false ) => {
    try {
        const userData = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "users/login", user);
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
        await axios.put( RestAPI.ORIGINAL_ENDPOINT + "users/updateuser/"+userInfo.id, userInfo); // must add token

    } catch (error) {
        console.log(error.message);
    }
}

export const getCurrentUser = dispatch => async (user, fromDB) => {

    try {
        const result = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "users/login", null, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        if(fromDB === "fromDB")
            return result.data; 
        else{
            if (result.data.user_role === "admin") {
                dispatch(addCurrentUser(result.data));
                return result.data.first_name;
            }           
        }                
        
    } catch (error) {
        console.log("Not registered user! Check and try again.");
    }
    
}

export const updateCurrentUser = dispatch => async user => {

    try {
        const result = await axios.put( RestAPI.ORIGINAL_ENDPOINT + "users/updateuser/"+user.id, user, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        dispatch(addCurrentUser(result.data.message));

    } catch (error) {
        console.log(error.message);
    }
}

export const delCurrentUser = () => ({
    type: UserActionTypes.DEL_CURRENT_USER
})

export const loadPage = flag => ({
    type: UserActionTypes.LOAD_PAGE,
    payload: flag
})

const addCurrentUser = user => ({
    type: UserActionTypes.ADD_CURRENT_USER,
    payload: user
});
