import {combineReducers} from 'redux';
import UserReducer from './user/user.reducer';
import DashboardReducer from './dashboard/dashboard.reducer';
import CategoryReducer from './category/category.reducer';
import ColorChangeReducer from './colorChnage/colorChange.reducer';
import ProductListItemsReducer from './product-list/product-list.reducer';
import WebinarQueueListItemsReducer from './webinar-queue-list/webinar-queue-list.reducer';

export default combineReducers({
    user: UserReducer,
    dashboard: DashboardReducer,
    category: CategoryReducer,
    productList: ProductListItemsReducer,
    webinarList: WebinarQueueListItemsReducer,
    colors: ColorChangeReducer
});