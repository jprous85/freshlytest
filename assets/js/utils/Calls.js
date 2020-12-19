import React from 'react';
import axios from 'axios';

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

export function fillModalDataOrder(order) {
    const array_values = [
        'id',
        'delivery_date',
        'custom_name',
        'address',
        'country'
    ];
    const body = document.getElementById('modal-body');
    body.innerHTML = '';

    array_values.map(av => {
        body.appendChild(createParagraph(order, av));
    })
    body.appendChild(createModalProducts(order));
    body.appendChild(createModalSelectStates(order));
}

function createParagraph(order, value) {
    const address = getAddressDelivery(order.id_address_delivery, order.customer.addresses);

    const div = document.createElement('div');
    const span = document.createElement('span');
    const paragraph = document.createElement('p');
    let span_value = '';
    let paragraph_value = '';
    switch (value) {
        case 'id':
            span_value = 'Id:'
            paragraph_value = order.id
            break;
        case 'delivery_date':
            span_value = 'Fecha de pedido:'
            paragraph_value = order.delivery_date;
            break;
        case 'custom_name':
            span_value = 'Usuario:'
            paragraph_value = `${order.customer.firstname} ${order.customer.lastname}`;
            break;
        case 'address':
            span_value = 'Dirección de entrega:'
            paragraph_value = address.address;
            break;
        case 'country':
            span_value = 'País:'
            paragraph_value = address.country;
            break;
    }
    paragraph.innerText = paragraph_value;
    span.innerText = span_value;
    div.appendChild(span);
    div.appendChild(paragraph);
    return div;
}

function createModalProducts(order) {
    const products = getProductsAssociates(order.associations.order_rows);

    const div = document.createElement('div');
    const span = document.createElement('span');
    const ul = document.createElement('ul');

    products.map(p => {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(p));
        ul.appendChild(li);
    })

    span.innerText = 'Productos:';
    div.appendChild(span);
    div.appendChild(ul);
    return div;
}

function createModalSelectStates(order) {
    const {order_states} = getLocalStorage();
    const div = document.createElement('div');
    const span = document.createElement('span');
    const select = document.createElement('select');
    select.classList.add('form-control')

    select.addEventListener('change', (e) => {
        changeSelectListOrder(order.id, e);
    })

    order_states.map(os => {
        const option = document.createElement('option');
        option.id = os.id;
        option.appendChild(document.createTextNode(os.name));
        if (order.order_state.id === os.id) {
            option.setAttribute('selected', true);
        }
        select.appendChild(option);
    })

    span.innerText = 'Estado del pedido:';
    div.appendChild(span);
    div.appendChild(select);
    return div;
}

function changeSelectListOrder(id, e) {

    let id_current_state = 0;
    const {credentials, order_states} = getLocalStorage();
    order_states.map(os => {
        if (os.name === e.target.value) {
            id_current_state = os.id;
        }
    })

    const url = `${credentials.fresh_url}/api/orders/${id}?io_format=JSON&ws_key=${credentials.fresh_token}`;
    axios.get(url)
        .then(res => {
            res.data.order.current_state = id_current_state;
            axios.put(url, {
                'body': {
                    'order': OBJtoXML(res.data)
                }
            })
                .then(r => {
                    console.log('then');
                    console.log(r)
                })
                .catch(err => {
                    console.log('err');
                    console.log(err)
                })
        })
}

function OBJtoXML(obj) {
    let xml = '';
    for (let prop in obj) {
        xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
        if (obj[prop] instanceof Array) {
            for (var array in obj[prop]) {
                xml += "<" + prop + ">";
                xml += OBJtoXML(new Object(obj[prop][array]));
                xml += "</" + prop + ">";
            }
        } else if (typeof obj[prop] == "object") {
            xml += OBJtoXML(new Object(obj[prop]));
        } else {
            xml += obj[prop];
        }
        xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
    }
    return xml.replace(/<\/?[0-9]{1,}>/g, '');
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