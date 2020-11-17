import { ColorChangeActionTypes } from './colorChange.types';
import axios from 'axios';
import { RestAPI } from '../api-config';

export const getCurrentFontColors = dispatch => async () => {

    try {
        const result = await axios.get( RestAPI.ORIGINAL_ENDPOINT + "support/getallsitesettings");
        dispatch(setCurrentFontColors(result.data.data));
        return result.data.data;

    } catch (error) {
        console.log(error.message);
    }
}

export const updateCurrentFontColors = dispatch => async (colors) => {

    try {
        const result = await axios.put( RestAPI.ORIGINAL_ENDPOINT + "support/updatesitesettings", colors, { 
            headers: {
                'Authorization': `${ JSON.parse(localStorage.getItem("userSession")).idToken.jwtToken}`
                }
        });
        return result.data.message;
        
    } catch (error) {
        console.log(error.message);
    }
}

const setCurrentFontColors = colors => ({
    type: ColorChangeActionTypes.SET_CURRENT_FONT_COLORS,
    payload: colors
});