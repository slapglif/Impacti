import { ColorChangeActionTypes } from './colorChange.types';

const INITIAL_SATE = {
    currentFontColors: null,
    currentHeaderColor: null,
    currentFooterColor: null
}

const ColorChangeReducer = (state = INITIAL_SATE, action) => {
    switch (action.type) {
        case ColorChangeActionTypes.SET_CURRENT_FONT_COLORS:
            return {
                ...state, currentFontColors: action.payload 
            }
    
        default:
            return state;
    }
}

export default ColorChangeReducer;