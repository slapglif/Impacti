import AlertsActionTypes from './alerts.types';
import axios from 'axios';
import { RestAPI } from '../api-config';

export const alertsShow = () => ({
    type: AlertsActionTypes.ALERTS_SHOW
});

export const hideAlerts = () => ({
    type: AlertsActionTypes.HIDE_ALERTS
});

export const removeReadItem = id => ({
    type: AlertsActionTypes.REMOVE_READ_ITEM,
    payload: id
});

export const setLoadAlerts = flag => ({
    type: AlertsActionTypes.SET_LOAD_ALERTS,
    payload: flag
})

export const getNotifications = dispatch => async (userID) => {
    try {
        const result = await axios.get( RestAPI.ORIGINAL_ENDPOINT + "consumer/notification", {
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
            }
        });
        dispatch(setNotifications(result.data.message))
    } catch (error) {
        console.log(error.message);
    }
};

export const readNotifications = dispatch => async (notificationID) => {
    try {
        const result = await axios.put( RestAPI.ORIGINAL_ENDPOINT + "consumer/notification/read/"+notificationID, null, { headers: {
            'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
        }});
        return result.data.message;
    } catch (error) {
        console.log(error.message);
    }
};

const setNotifications = notifications => ({
    type: AlertsActionTypes.SET_NOTIFICATIONS,
    payload: notifications
})

