import { DashboardActionTypes } from './dashboard.types';

const INITIAL_STATE = {
    currentRevenue: null,
    currentMember: null,
    currentCategory: null
}

const DashboardReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case DashboardActionTypes.SET_CURRENT_REVENUE:
            
            return {
                ...state, currentRevenue: action.payload 
            }
        case DashboardActionTypes.SET_CURRENT_MEMBER:
            
            return {
                ...state, currentMember: action.payload
            }
        case DashboardActionTypes.SET_CURRENT_CATEGORY:
            return {
                ...state, currentCategory: action.payload
            }
            
        default:
            return state;
    }
}

export default DashboardReducer;