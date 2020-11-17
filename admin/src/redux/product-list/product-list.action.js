import ProductListActionTypes from './product-list.types';
import axios from 'axios';
import { RestAPI } from '../api-config';

export const getProductItems = dispatch => async ( filterStr = null, statusFilter = null, type = null, limit = 10, offset = 0) => {

    try {
        const result = await axios.get( RestAPI.ORIGINAL_ENDPOINT + `admin/products/product/listings?filterString=${filterStr}&filterByStatus=${statusFilter}&limit=${limit}&offset=${offset}&product_type=${type}`, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        console.log(result.data);
        dispatch(setProductItems(result.data));
    } catch (error) {
        console.log(error.message);
    }
}

export const getCurrentProductItem = dispatch => async ( id, prodType ) => {

    try {
        const result = await axios.get( RestAPI.ORIGINAL_ENDPOINT + `admin/products/product?id=${id}&product_type=${prodType}`, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        return result.data;
    } catch (error) {
        console.log(error.message);
    }
}

export const addNewWebinar = dispatch => async ( type, obj ) => {
  
    try {
        const result = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "admin/products/"+type, obj, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        return result.data.message;

    } catch (error) {
        console.log(error.message);
    }
}

export const addGalleryImages = dispatch => async ( obj ) => {
  
    try {
        const result = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "admin/products/images", obj, { 
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

export const removeGalleryImage = dispatch => async ( obj ) => {
  
    try {
        const result = await axios.delete( RestAPI.ORIGINAL_ENDPOINT + "admin/products/images", { 
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

export const updateProduct = dispatch => async ( obj ) => {

    try {
        const result = await axios.put( RestAPI.ORIGINAL_ENDPOINT + "admin/products/product", obj, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        return result.data.message;
    } catch (error) {
        console.log(error.message);
    }
}


export const setFilterString = filterStr => ({
    type: ProductListActionTypes.SET_FILTER_STRING,
    payload: filterStr
})

export const setLimitPerPage = limit => ({
    type: ProductListActionTypes.SET_LIMIT_PER_PAGE,
    payload: limit
})

export const setProductPageNum = num => ({
    type: ProductListActionTypes.SET_PRODUCT_LIST_PAGE_NUM,
    payload: num
})

export const setAddNewClicked = flag => ({
    type: ProductListActionTypes.SET_ADD_NEW_CLICKED,
    payload: flag
})


const setProductItems = items => ({
    type: ProductListActionTypes.SET_PRODUCT_LIST_ITEMS,
    payload: items
})
