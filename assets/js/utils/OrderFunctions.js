import React from 'react';
import StateFilter from "../components/filters/StateFilter";
import {FILTER} from "./constants";
import CountryFilter from "../components/filters/CountryFilter";

export function getLocalStorage() {
    const credentials = JSON.parse(document.getElementById('root').attributes['data-credentials'].nodeValue);
    const order_states = JSON.parse(document.getElementById('root').attributes['data-order-states'].nodeValue);
    const simple_order = JSON.parse(document.getElementById('root').attributes['data-simple-order'].nodeValue);
    return {
        'credentials': credentials,
        'order_states': order_states,
        'simple_order': simple_order
    }
}

export function getAddressDelivery(id, address) {
    let address_delivery = {
        address: '',
        country: ''
    }

    address.map(a => {
        if (a[0].id === parseInt(id)) {
            address_delivery.address = `${a[0].address1}, 
            ${a[0].address2},
            ${a[0].postcode},
            ${a[0].city}`;

            address_delivery.country = `${a[1].name}`;
        }
    })
    return address_delivery;
}

export function getProductsAssociates(products) {
    let product = [];
    products.map(p => {
        product.push(p.product_name);
    })
    return product;
}

export function getStateList(order, filter, state) {
    let temp_array = [];
    if (filter && state) {
        order.map(o => {
            if (o.current_state === state) {
                temp_array.push(o);
            }
        })
    }
    else {
        temp_array = order;
    }
    return temp_array;
}

export function getCountryList(order, country) {
    let orders = [];
    let id_country;
    
    if (country) {
        const countries = getCountryForOrder(order);
        countries.map(c => {
            if (c.name === country) id_country = c.id;
        })

        order.map(o => {
            o.customer.addresses.map(oca => {
                if (parseInt(o.id_address_delivery) === oca[0].id && id_country === oca[1].id) {
                    orders.push(o);
                }
            });
        })
    }
    else return order;

    return orders;
}

export function getCountryForOrder(order) {
    let countries = [];
    
    order.map(o => {
        o.customer.addresses.map(oca => {
            if (countries.length === 0) {
                countries.push(oca[1])
            } else {
                let toBeInArray = false;
                countries.map(c => {
                    if (oca[1].id === c.id) {
                        toBeInArray = true;
                    }
                })
                if (!toBeInArray) {
                    countries.push(oca[1]);
                }
            }
        })
    })

    return countries;
}

export function getStateAcceptedAndSend(order) {
    const {order_states} = getLocalStorage();
    let order_state_id = [];
    let orders = [];
    order_states.map(os => {
        if (os.name === FILTER.ACCEPTED_PAY || os.name === FILTER.SENDED) {
            order_state_id.push(os.id);
        }
    })
    order.map(o => {
        if (order_state_id.includes(parseInt(o.current_state))) {
            orders.push(o);
        }
    })
    return orders;
}