import WebinarQueuetListActionTypes from './webinar-queue-list.types';
import axios from 'axios';
import { RestAPI } from '../api-config';

export const getProductItems = dispatch => async ( filterStr = null, queue_type = null, limit = 10, offset = 0) => {

    try {
        const result = await axios.get( RestAPI.ORIGINAL_ENDPOINT + `admin/products/product/webinar/queue?filterString=${filterStr}&queue_type=${queue_type}&limit=${limit}&offset=${offset}`, { 
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

export const updateQueueLimit = dispatch => async (obj) => {

    try {
        const result = await axios.put( RestAPI.ORIGINAL_ENDPOINT + "support/updatesitesettings", obj, { 
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
    type: WebinarQueuetListActionTypes.SET_FILTER_STRING,
    payload: filterStr
})

export const setLimitPerPage = limit => ({
    type: WebinarQueuetListActionTypes.SET_LIMIT_PER_PAGE,
    payload: limit
})

export const setProductPageNum = num => ({
    type: WebinarQueuetListActionTypes.SET_PRODUCT_LIST_PAGE_NUM,
    payload: num
})

export const setMaxWebinarCount = num => ({
    type: WebinarQueuetListActionTypes.SET_MAX_WEBINAR_COUNT,
    payload: num
})

const setProductItems = items => ({
    type: WebinarQueuetListActionTypes.SET_PRODUCT_LIST_ITEMS,
    payload: items
})
