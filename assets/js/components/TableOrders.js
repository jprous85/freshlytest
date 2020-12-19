import React from 'react';
import {fillModalDataOrder} from "../utils/ModalFunctions";
import {getAddressDelivery, getProductsAssociates} from "../utils/OrderFunctions";

const TableOrders = (props) => {
    const {simple_order} = props;
    return (
        <table className="table table-hover">
            <thead>
            <tr>
                <th scope="col">ID Order</th>
                <th scope="col">Fecha del pedido</th>
                <th scope="col">Nombre y apellidos de la dirección de envío</th>
                <th scope="col">Direccion de envio</th>
                <th scope="col">País de envío</th>
                <th scope="col">Nombre de los productos comprados</th>
                <th scope="col">Estado del pedido</th>
            </tr>
            </thead>
            <tbody>
            {simple_order.map((order) => {
                const address = getAddressDelivery(order.id_address_delivery, order.customer.addresses);
                const products = getProductsAssociates(order.associations.order_rows);
                return (
                        <tr key={order.id} data-bs-toggle="modal" data-bs-target="#myModal" onClick={()=> {
                            fillModalDataOrder(order);
                        }}>
                            <td>{order.id}</td>
                            <td>{order.delivery_date}</td>
                            <td>{order.customer.firstname} {order.customer.lastname}</td>
                            <td>{address.address}</td>
                            <td>{address.country}</td>
                            <td>
                                <ul>
                                    {products.map(n => <li key={n}>`${n}`</li>)}
                                </ul>
                            </td>
                            <td>{order.order_state.name}</td>
                        </tr>
                );
            })}
            </tbody>
        </table>
    );
}

export default TableOrders;