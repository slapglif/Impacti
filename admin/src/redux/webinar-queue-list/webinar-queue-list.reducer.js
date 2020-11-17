import WebinarQueuetListActionTypes from './webinar-queue-list.types';

const INITIAL_STATE = {
    product_items: {
        rows: [{
            id: 1,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 2,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 31,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 41,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 15,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 61,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 71,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 18,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 19,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 11,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 112,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 123,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 1123,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 1231,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 4211,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 551,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        },
        {
            id: 112443,
            name: "aaa",
            shortDescription: "aaaaaa",
            price_per_seats: 500,
            publish_method: "queued",
            seats:50
        }],
        count: 1,
        webinar_queue_limit: 0
    },
    filterStr: "",
    limitPerPage: 10,
    pageNum: 1
}

const WebinarQueueListItemsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case WebinarQueuetListActionTypes.SET_PRODUCT_LIST_ITEMS:
            return {
                ...state, 
                product_items : action.payload, 
            }
        case WebinarQueuetListActionTypes.SET_FILTER_STRING:
            return {
                ...state, filterStr: action.payload
            }
        case WebinarQueuetListActionTypes.SET_LIMIT_PER_PAGE:
            return {
                ...state, limitPerPage: action.payload
            }
        case WebinarQueuetListActionTypes.SET_MAX_WEBINAR_COUNT:
            return {
                ...state, product_items: {...state.product_items, webinar_queue_limit: action.payload}
            }            
        case WebinarQueuetListActionTypes.SET_PRODUCT_LIST_PAGE_NUM:
            return {
                ...state, pageNum: action.payload
            }
        default:
            return state;
    }
}

export default WebinarQueueListItemsReducer;