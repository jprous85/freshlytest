import React, {useState, useEffect} from "react";
import {
    getLocalStorage,
    getStateList,
    getStateAcceptedAndSend,
    getCountryForOrder,
    getCountryList
} from "../utils/OrderFunctions";
import TableOrders from "./TableOrders";
import ModalOrder from "./ModalOrder";
import {FILTER} from '../utils/constants';
import StateFilter from "./filters/StateFilter";
import CountryFilter from "./filters/CountryFilter";

const Orders = () => {
    const {simple_order} = getLocalStorage();
    const [filter, setFilter] = useState('');
    const [changeState, setChangeState] = useState('');
    const [changeCountry, setChangeCountry] = useState('');


    let listOrder;
    if (filter === FILTER.STATUS) {
        listOrder = getStateList(simple_order, filter, changeState);
    } else if (filter === FILTER.COUNTRY) {
        listOrder = getCountryList(simple_order, changeCountry);
    }
    else {
        listOrder = simple_order;
    }

    let applyFilters;
    if (filter.length !== 0 && filter === FILTER.STATUS) {
        applyFilters = <StateFilter order={simple_order} changeState={changeState} setChangeState={setChangeState}/>
    }
    else if (filter.length !== 0 && filter === FILTER.COUNTRY) {
        let countries = getCountryForOrder(simple_order);
        applyFilters = <CountryFilter countries={countries} setChangeCountry={setChangeCountry}/>
    }
    else if (filter.length !== 0 && filter === FILTER.ACCEPTED_PAY_SEND) {
        listOrder = getStateAcceptedAndSend(simple_order);
    }

    const listOrderTable = (listOrder.length !== 0) ? <TableOrders simple_order={listOrder} /> : (
        <div className={"row"}>
            <div className={"col-12"}>
                <div className="alert alert-warning ">
                    Sorry, but there are no results.
                </div>
            </div>
        </div>
    );

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
                        <option value={FILTER.COUNTRY}>Filter for country</option>
                        <option value={FILTER.ACCEPTED_PAY_SEND}>Show only "accepted pay" and "sended"</option>
                    </select>
                </div>
                <div className="col-6">
                    {applyFilters}
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-12">
                    {listOrderTable}
                    <ModalOrder/>
                </div>
            </div>
        </div>
    );
}

export default Orders;