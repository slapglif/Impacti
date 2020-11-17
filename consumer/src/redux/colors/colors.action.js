import { ColorsActionTypes } from './colors.types';
import axios from 'axios';
import { RestAPI } from '../api-config';

export const getCurrentFontColors = dispatch => async () => {

    try {
        const result = await axios.get( RestAPI.ORIGINAL_ENDPOINT + "general/support/sitesettings");
        dispatch(setCurrentFontColors(result.data.data));

    } catch (error) {
        console.log(error.message);
    }
}

const setCurrentFontColors = colors => ({
    type: ColorsActionTypes.SET_CURRENT_FONT_COLORS,
    payload: colors
});