import React from 'react';
export default function GuardedRoute (component,redirect) {
    if(typeof window !== "undefined") {
    const token = localStorage.getItem('accessToken');
    if(token) {
        return component;
    } else {
          window.location.href = '/account/login?redirect='+redirect  
        return null;
    }
   } 
       return component;
}
