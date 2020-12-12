// @ts-ignore
import React, {useState, useEffect} from "react";
import { getLocalStorage, prepareJson } from "../utils/Calls";
import axios from "axios";

const Orders = (props) => {

    const [table, setTable] = useState([]);
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState({});
    const credentials = getLocalStorage();

    async function getOrders() {
        let response = await axios
            .get(`${credentials.url}/api/orders?output_format=JSON&ws_key=${credentials.token}`)
        setOrders(response.data.orders);
    }

    async function getSimpleOrder(id) {
        let response = await axios
            .get(`${credentials.url}/api/orders/${id}?output_format=JSON&ws_key=${credentials.token}`)
        return response.data.order;
    }

    useEffect(()=>{
        getOrders()
    }, []);
    
    useEffect(()=>{
        if (orders.length > 0) {
            orders.map(e => {
                getSimpleOrder(e.id).then(e => {
                })
            })
        }
    }, [orders])

    console.log(order);

    return (
        <div className={"container"}>
            <div className="row mt-3">
                <div className="col-12">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">ID Order</th>
                            <th scope="col">Fecha del pedido</th>
                            <th scope="col">Direccion de envio</th>
                            <th scope="col">Nombre y apellidos de la direccion de envio</th>
                            <th scope="col">País de envio</th>
                            <th scope="col">Nombre productos</th>
                            <th scope="col">Estado del pedido</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        </tbody>
                    </table>
                    <button className={'btn btn-primary'} onClick={()=>{}}>getOrders</button>
                </div>
            </div>
        </div>
    );
}

export default Orders;