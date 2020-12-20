<?php


namespace App\Service;

use App\Utils\Constants;

class OrderService
{
    public function getAllOrders()
    {
        $simpleOrder = [];
        $orders = $this->getOrders();
        if ($orders) {
            foreach ($orders->orders as $order) {
                array_push($simpleOrder, $this->getSimpleOrder($order->id)->order);
            }
        }

        return $simpleOrder;
    }

    public function getOrderStates()
    {
        $order_states = [];
        $file_get = file_get_contents($this->getFreshUrl(Constants::ORDER_STATES));
        $json = json_decode($file_get);

        foreach ($json->order_states as $item) {
            $simpleOrderStates = file_get_contents($this->getFreshUrl(Constants::ORDER_STATES, $item->id));
            array_push($order_states, json_decode($simpleOrderStates)->order_state);
        }

        return $order_states;
    }

    private function getOrders()
    {
        $file_get = file_get_contents($this->getFreshUrl(Constants::ORDERS));

        return json_decode($file_get);
    }

    private function getSimpleOrder($id)
    {
        $file_get = file_get_contents($this->getFreshUrl(Constants::ORDERS, $id));
        $json = json_decode($file_get);
        $this->getCustomers($json->order->id_customer);
        $customer = $this->getCustomers($json->order->id_customer);
        $address = $this->getCustomerAddress($customer->id);
        $order_state = $this->getSimpleOrderStates($json->order->current_state);
        $json->order->customer = $customer;
        $json->order->customer->addresses = $address;
        $json->order->order_state = $order_state;

        return $json;
    }

    private function getCustomers($id)
    {
        $file_get = file_get_contents($this->getFreshUrl(Constants::CUSTOMERS, $id));

        return json_decode($file_get)->customer;
    }

    private function getCustomerAddress($id)
    {
        $customerAddresses = [];
        $file_get = file_get_contents($this->getFreshUrl(Constants::ADDRESSES, null, Constants::ID_CUSTOMER, $id));
        $json = json_decode($file_get);

        if (is_array($json->addresses)) {

            foreach ($json->addresses as $address) {
                $simpleAddress = file_get_contents(
                    $this->getFreshUrl(Constants::ADDRESSES, $address->id)
                );
                $simpleCountry = file_get_contents(
                    $this->getFreshUrl(
                        Constants::COUNTRIES,
                        json_decode($simpleAddress)->address->id_country
                    )
                );
                array_push(
                    $customerAddresses,
                    [json_decode($simpleAddress)->address, json_decode($simpleCountry)->country]
                );
            }
        }

        return $customerAddresses;
    }

    private function getSimpleOrderStates($id)
    {
        $file_get = file_get_contents($this->getFreshUrl(Constants::ORDER_STATES, $id));

        return json_decode($file_get)->order_state;
    }

    private function getFreshUrl($field, $id = null, $filter_name = null, $filter_value = null)
    {
        $generalServices = new GeneralServices();
        $filter_content = '';
        if ($filter_name) {
            $filter_content = '&filter['.$filter_name.']='.$filter_value;
        }

        return $generalServices->getCredentials()[Constants::FRESH_URL].
            '/api/'.$field.'/'.$id.$filter_content.'?output_format=JSON&ws_key='.
            $generalServices->getCredentials()[Constants::FRESH_TOKEN];
    }
}