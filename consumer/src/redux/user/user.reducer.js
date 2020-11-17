import { UserActionTypes } from './user.types';

const INITIAL_STATE = {
    currentUser: null
}

const UserReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UserActionTypes.ADD_CURRENT_USER:
            
            return {
                ...state, currentUser: action.payload 
            }
        case UserActionTypes.DEL_CURRENT_USER:
            
            return {
                ...state, currentUser: "noInfo" 
            }
            
        default:
            return state;
    }
}

export default UserReducer;