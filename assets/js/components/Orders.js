import React, {useState} from "react";
import { getLocalStorage } from "../utils/Calls";
import TableOrders from "./TableOrders";
import ModalOrder from "./ModalOrder";

const Orders = (props) => {
    const {order_states, simple_order} = getLocalStorage();

    return (
        <div className={"container"}>
            <div className="row mt-3">
                <div className="col-12">
                    <TableOrders
                        simple_order={simple_order}
                    />
                    <ModalOrder/>
                </div>
            </div>
        </div>
    );
}

export default Orders;