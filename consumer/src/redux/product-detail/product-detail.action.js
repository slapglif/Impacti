import { ProductDetailActionTypes } from './product-detail.type';
import axios from 'axios';
import { RestAPI } from '../api-config';

export const getCurrentProdItem = dispatch => async (prodID,prodType) => {
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + "consumer/products/getproduct", {id: prodID, product_type: prodType}, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
   
        dispatch(setCurrentProdItem(result.data.data));
    } catch (error) {
        console.log(error.message);
    }
}

export const getCurrentComments = dispatch => async (prodID) => {
    try {
        const result = await axios.get(RestAPI.ORIGINAL_ENDPOINT + "consumer/comments/getproductcomments/" + prodID, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        dispatch(setCurrentProdComments(result.data.data.result));
    } catch (error) {
        console.log(error.message);
    }
}

export const addCommentsFunc = dispatch => async (obj, index = null) => {
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + "consumer/comments", obj, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        // console.log("REPLY = = = = = = ",result.data.data);        
        return result.data.data;
        // if(index)
        //     dispatch(addRepliedComment(result.data.data, index));            
        // else
        //     dispatch(addOwnComment({
        //         message: result.data.data,
        //         childs: []
        //     }));

    } catch (error) {
        console.log(error.message);
    }
}

export const updateCommentFunc = dispatch => async (obj) => {

    try {
        const result = await axios.put(RestAPI.ORIGINAL_ENDPOINT + "consumer/comments", obj, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
            
        return result.data.message;
    } catch (error) {
        console.log(error.message);
    }
}

export const setCommentPin = dispatch => async (obj) => {
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + "admin/comments/pin", obj, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        // console.log("Result ============= ", result.data.message);
        return result.data.message;
    } catch (error) {
        console.log(error.message);
    }
}

export const setCommentDel = dispatch => async (obj) => {
    try {
        console.log('--------------',obj);
        const result = await axios.delete(RestAPI.ORIGINAL_ENDPOINT + "admin/comments/" + obj.comment_id,  { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        return result.data.message;
    } catch (error) {
        console.log(error.message);
    }
}

export const setCommentUserBan = dispatch => async (obj) => {
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + "admin/users/ban", obj, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        return result.data.message;
    } catch (error) {
        console.log(error.message);
    }
}

const setCurrentProdItem = items => ({
    type: ProductDetailActionTypes.SET_CURRENT_PRODUCT_DETAIL,
    payload: items
})

const setCurrentProdComments = comments => ({
    type: ProductDetailActionTypes.SET_CURRENT_PRODUCT_COMMENTS,
    payload: comments
})

const addOwnComment = comments => ({
    type: ProductDetailActionTypes.ADD_OWN_COMMENT,
    payload: comments
})

const addRepliedComment = (comments, index) => ({
    type: ProductDetailActionTypes.ADD_REPLIED_COMMENT,
    payload: {
        data: comments,
        index: index
    }
})