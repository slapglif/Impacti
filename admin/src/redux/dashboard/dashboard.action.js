import { DashboardActionTypes } from './dashboard.types';
import axios from 'axios';
import { RestAPI } from '../api-config';

export const getCurrentRevenue = dispatch => async user => {

    try {
        const result = await axios.post( RestAPI.ORIGINAL_ENDPOINT + "users/updateuser/"+user.id, user, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        dispatch(setCurrentRevenue(result.data.message));

    } catch (error) {
        console.log(error.message);
    }
}

const setCurrentRevenue = list => ({
    type: DashboardActionTypes.SET_CURRENT_REVENUE,
    payload: list
});
