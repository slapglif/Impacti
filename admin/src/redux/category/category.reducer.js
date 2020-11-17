import { CategoryActionTypes } from './category.types';

const INITIAL_SATE = {
    currentCategories: null
}

const CategoryReducer = (state = INITIAL_SATE, action) => {
    switch (action.type) {
        case CategoryActionTypes.SET_CURRENT_CATEGORIES:
            return {
                ...state, currentCategories: action.payload 
            }
    
        default:
            return state;
    }
}

export default CategoryReducer;