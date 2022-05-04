export const actionTypes = {
    GET_NOTIFICATION: 'GET_NOTIFICATION',
    GET_NOTIFICATION_SUCCESS: 'GET_NOTIFICATION_SUCCESS',
    GET_NOTIFICATION_ERROR: 'GET_NOTIFICATION_ERROR',
    
    MARK_AS_READ: 'MARK_AS_READ',
    MARK_AS_READ_SUCCESS: 'MARK_AS_READ_SUCCESS',
    MARK_AS_READ_ERROR: 'MARK_AS_READ_SUCCESS',

    DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
    DELETE_NOTIFICATION_SUCCESS: 'DELETE_NOTIFICATION_SUCCESS',
    DELETE_NOTIFICATION_ERROR: 'DELETE_NOTIFICATION_ERROR',

    MARK_AS_UNREAD:'MARK_AS_UNREAD',
    MARK_AS_UNREAD_SUCCESS:'MARK_AS_UNREAD_SUCCESS',
    MARK_AS_UNREAD_ERROR:'MARK_AS_UNREAD_ERROR'
};


export const getNotifications = () => {
return { type: actionTypes.GET_NOTIFICATION }
}

export const getNotificationsSuccess = (payload) => {
return { type: actionTypes.GET_NOTIFICATION_SUCCESS , payload }
}

export const getNotificationsError = (err) => {
return { type: actionTypes.GET_NOTIFICATION_ERROR, err }
}



export const markAsUnreadNotification = (payload) => {
    return { type: actionTypes.MARK_AS_UNREAD, payload }
}

export const markAsUnreadNotificationSuccess = (payload) => {
    return { type: actionTypes.MARK_AS_UNREAD_SUCCESS, payload }
}

export const markAsUnreadNotificationError = (err) => {
    return { type: actionTypes.MARK_AS_UNREAD_ERROR, err }
}



export const markAsReadNotification = (payload) => {
    return { type: actionTypes.MARK_AS_READ, payload }
}

export const markAsReadNotificationSuccess = (payload) => {
    return { type: actionTypes.MARK_AS_READ_SUCCESS , payload}
}

export const markAsReadNotificationError = (err) => {
    return { type: actionTypes.MARK_AS_READ_ERROR, err }
}


export const deleteNotification = (payload) => {
    return { type: actionTypes.DELETE_NOTIFICATION, payload }
}

export const deleteNotificationSuccess = (payload) => {
    return { type: actionTypes.DELETE_NOTIFICATION_SUCCESS , payload}
}

export const deleteNotificationError = (err) => {
    return { type: actionTypes.DELETE_NOTIFICATION_ERROR, err }
}