import { PurchaseSeatsActionTypes } from './purchase-seats.types';
import { RestAPI } from '../api-config';
import axios from 'axios';

export const getPurchaseSeatsArray = dispatch => async (webinarID) => {
    try {
        const result = await axios.get(RestAPI.ORIGINAL_ENDPOINT + `consumer/products/webinarseats/${webinarID}`, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        
        dispatch(setSeatsArray(result.data.message));
    } catch (error) {
        console.log(error.message);
    }
}

export const getReservedStatus = dispatch => async (userID, webinarID) => {
    // const obj = {
    //     user_id: userID,
    //     webinar_id: webinarID
    // }
    try {
        const result = await axios.get(RestAPI.ORIGINAL_ENDPOINT + `consumer/products/getwebinarreservedstatus/` + webinarID, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        return result.data.data;
    } catch (error) {
        console.log(error.message);
    }
}

export const setSeatsReserved = dispatch => async (userID, webinarID, seatsArray) => {
    const obj = {
        user_id: userID,
        webinar_id: webinarID,
        seatNoArray: seatsArray
    }
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + `consumer/products/reservewebinarticket`, obj, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        return result.data;
    } catch (error) {
        console.log(error.message);
    }
}

export const cancelReservation = dispatch => async (userID, webinarID) => {
    const obj = {
        user_id: userID,
        webinar_id: webinarID
    }
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + `consumer/products/cancel`, obj, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        return result.data;
    } catch (error) {
        console.log(error.message);
    }
}

export const purchaseWebinarSeats = dispatch => async (obj) => {
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + `consumer/products/purchasewebinar`, obj ,{ 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        return result.data;
    } catch (error) {
        console.log(error.message);
    }
}

export const buyPhysicalProduct = dispatch => async (obj) => {
    try {
        const result = await axios.post(RestAPI.ORIGINAL_ENDPOINT + `consumer/products/purchasephysical`, obj, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        return result.data;
    } catch (error) {
        console.log(error.message);
    }
}

const setSeatsArray = array => ({
    type: PurchaseSeatsActionTypes.SET_SEATS_ARRAY,
    payload: array
})