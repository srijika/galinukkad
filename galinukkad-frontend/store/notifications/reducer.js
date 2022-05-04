import { actionTypes } from './action';
import { notification  as notificationPopup } from 'antd';
export const notification = {
    notifications: []
};

function reducer(state = notification, action) {
    switch (action.type) {
        case actionTypes.GET_NOTIFICATION_SUCCESS:
            return {
                ...state,
                notifications: action.payload.map((notifications) => {return {...notifications}}),
            };
        case actionTypes.MARK_AS_READ_SUCCESS:
            notificationPopup.success({message:'Read successfully'});
            const savedNotifications = [...state.notifications].map((notification) => {
                if(notification._id == action.payload) {

                    return {
                        ...notification,
                        status:notification.status === 0?1:0
                    };
                }
                return notification;
            });
            return {
                ...state,
                notifications:savedNotifications
            };
        case actionTypes.MARK_AS_UNREAD_SUCCESS:
            notificationPopup.success({message:'Unread successfully'});
            const newSavedNotifications = [...state.notifications].map((notification) => {
                if(notification._id == action.payload) {

                    return {
                        ...notification,
                        status:notification.status === 1?0:1
                    };
                }
                return notification;
            });
            return {
                ...state,
                notifications:newSavedNotifications
            };
        case actionTypes.DELETE_NOTIFICATION_SUCCESS:
            notificationPopup.success({message:'Deleted successfully'});
            const newNotifications = state.notifications.filter((notification) => notification._id !== action.payload);
            return {
                ...state,
                notifications:newNotifications
            };
        default:
            return state;
    }
}

export default reducer;
