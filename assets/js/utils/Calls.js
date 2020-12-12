import React from 'react';
import axios from 'axios';


export async function getOrders() {
    let credentials = getLocalStorage();
    let data = "{'order': [";

    let response = await axios
        .get(`${credentials.url}/api/orders?output_format=JSON&ws_key=${credentials.token}`)

}

export function prepareJson(json) {
    return {"entra": [{
        'id': json.id,
        'delivery_date': json.delivery_date,
        'customer': 'customer',
        'customerAddress': 'customerAddress',
        'sendCountry': 'sendCountry'
}]
    }
}

async function getSimpleOrder(id) {
    let credentials = getLocalStorage();

    let response = await axios
        .get(`${credentials.url}/api/orders/${id}?output_format=JSON&ws_key=${credentials.token}`)
    return response.data.order;
}

export function getLocalStorage() {
    let url = localStorage.getItem('url');
    let token = localStorage.getItem('token');
    return {
        'url': url,
        'token': token
    }
}