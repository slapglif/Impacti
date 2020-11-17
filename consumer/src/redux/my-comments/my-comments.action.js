import { MyCommentsActionTypes } from './my-comments.types';
import axios from 'axios';
import { RestAPI } from '../api-config';

export const getMyComments = dispatch => async (userID) => {

    try {
        const result = await axios.get( RestAPI.ORIGINAL_ENDPOINT + "consumer/comments/getusercomments", { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        console.log("My comments ",result.data.data.result);  
        dispatch(setMyComments(result.data.data.result));       
    } catch (error) {
        console.log("Failed to load comments data!");
    }
    
}

const setMyComments = data => ({
    type: MyCommentsActionTypes.SET_MY_COMMENTS,
    payload: data
});
