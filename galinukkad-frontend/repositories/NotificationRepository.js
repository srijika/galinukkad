import Repository, { baseUrl, serializeQuery } from './Repository';
import axios from 'axios';
import Router from 'next/router';
class NotificationRepository {

    constructor(callback) {
        this.callback = callback;
    }

    async getNotifications() {
            const reponse = await Repository.post(`${baseUrl}/notification/listing`,{})
            .then((response) => {
                return response.data.notification;
                })
                .catch(res => {
                    return {error: res }
                });
            return reponse;
    }

    async markAsRead(id) {
        const reponse = await Repository.post(`${baseUrl}/mark-as-read`,{id:id})
        .then((response) => {
            return response.data;
            })
            .catch(res => {
                return {error: res }
            });
        return reponse;    
    }

    async markAsUnread(id) {
        const reponse = await Repository.post(`${baseUrl}/mark-as-unread`,{id:id})
        .then((response) => {
            return response.data;
            })
            .catch(res => {
                return {error: res }
            });
        return reponse;    
    }
 
    async deleteNotification(id) {
        const reponse = await Repository.post(`${baseUrl}/delete-notification`,{id:id})
        .then((response) => {
            return response.data;
            })
            .catch(res => {
                return {error: res }
            });
        return reponse;    
    }

}

export default new NotificationRepository();
