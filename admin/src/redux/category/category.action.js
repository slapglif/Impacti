import { CategoryActionTypes } from './category.types';
import axios from 'axios';
import { RestAPI } from '../api-config';

export const getCurrentCategories = dispatch => async (getData=false) => {

    try {
        const result = await axios.get( RestAPI.ORIGINAL_ENDPOINT + "admin/categories", { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        console.log(result.data.data);
        if (getData)
            return result.data.data;
        dispatch(setCurrentCategoris(result.data.data));

    } catch (error) {
        console.log(error.message);
    }
}

export const addCategory = dispatch => async (name, type) => {

    const obj = {
        category_name: name,
        product_type: type        
    }

    try {
        const result = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "admin/categories", obj, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        console.log(result.data.data);
        return result.data.data;

    } catch (error) {
        console.log(error.message);
    }
}

export const updateCategory = dispatch => async (id, name, type) => {

    const obj = {
        category_name: name,
        product_type: type        
    }

    try {
        const result = await axios.patch( RestAPI.ORIGINAL_ENDPOINT + "admin/categories/" + id, obj, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        return result;
       
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteCategory = dispatch => async (list) => {

    const obj = {
        list: list
    }

    try {
        const result = await axios.delete( RestAPI.ORIGINAL_ENDPOINT + "admin/categories", { 
            data: obj,
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        return result.data.message;
    } catch (error) {
        console.log(error.message);
    }
}

const setCurrentCategoris = list => ({
    type: CategoryActionTypes.SET_CURRENT_CATEGORIES,
    payload: list
});