import ProductListActionTypes from './product-list.types';

const INITIAL_STATE = {
    product_items: {
        rows: [],
        count: 1,
        total_live_count: 0
    },
    isAddNewClicked: false,
    filterStr: "",
    limitPerPage: 10,
    pageNum: 1
}

const ProductListItemsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ProductListActionTypes.SET_PRODUCT_LIST_ITEMS:
            return {
                ...state, 
                product_items : action.payload, 
            }
        case ProductListActionTypes.SET_FILTER_STRING:
            return {
                ...state, filterStr: action.payload
            }
        case ProductListActionTypes.SET_LIMIT_PER_PAGE:
            return {
                ...state, limitPerPage: action.payload
            }
        case ProductListActionTypes.SET_PRODUCT_LIST_PAGE_NUM:
            return {
                ...state, pageNum: action.payload
            }
        case ProductListActionTypes.SET_ADD_NEW_CLICKED:
            return {
                ...state, isAddNewClicked: action.payload
            }
        default:
            return state;
    }
}

export default ProductListItemsReducer;