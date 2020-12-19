import React, {useState, useEffect} from "react";
import {getLocalStorage, getStateList} from "../utils/OrderFunctions";
import TableOrders from "./TableOrders";
import ModalOrder from "./ModalOrder";
import {FILTER} from '../utils/constants';
import StateFilter from "./filters/StateFilter";

const Orders = () => {
    const {simple_order} = getLocalStorage();
    const [filter, setFilter] = useState('');
    const [changeState, setChangeState] = useState('');

    const listOrder = getStateList(simple_order, filter, changeState);

    return (
        <div className={"container"}>
            <div className="row mt-3">
                <div className="col-12">
                    <a href="/config" className={'float-end'}>Configuration of credentials</a>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-6">
                    <select name="" id="" className="form-control" onChange={(e) => {
                        if (e.target.value.length === 0) {
                            setChangeState('');
                        }
                        setFilter(e.target.value);
                    }}>
                        <option value="">Apply filter</option>
                        <option value={FILTER.STATUS}>Filter for status</option>
                    </select>
                </div>
                <div className="col-6">
                    {filter.length !== 0 &&
                    <StateFilter order={simple_order} changeState={changeState} setChangeState={setChangeState}/>}
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-12">
                    <TableOrders
                        simple_order={listOrder}
                    />
                    <ModalOrder/>
                </div>
            </div>
        </div>
    );
}

export default Orders;