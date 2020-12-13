<?php


namespace App\Controller;


use http\Message\Body;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class DefaultController extends AbstractController
{
    private $client;
    private $session;

    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
        if (!$this->session){
            $this->session = new Session();
        }
    }

    /**
     * @Route("/", name="index_path")
     * @param Request $request
     * @return object
     */
    public function index(Request $request)
    {
        $simpleOrder = [];

        if (!$this->session->get('fresh_config')) {
            return new RedirectResponse($this->generateUrl('fresh_config_path'));
        }

        $order_states = $this->getOrderStates();

        $filter = null;
        if ($request->request->get('filter_check_state') == 'on') {
            $filters_id = [];
            foreach ($order_states as $orderState) {
                if ($orderState->name == 'Pago aceptado' || $orderState->name == 'Enviado') {
                    array_push($filters_id, $orderState->id);
                }
            }
            $filter = '&filter[current_state]=['.$filters_id[0].'|'.$filters_id[1].']';
        }
        else if ($request->request->get('filter_select_state')) {
            $filter = '&filter[current_state]='.$request->request->get('filter_select_state');
        }

        $orders = $this->getOrders($filter);
        if ($orders) {
            foreach ($orders->orders as $order) {
                array_push($simpleOrder, $this->getSimpleOrder($order->id)->order);
            }
        }

        return $this->render("orders/orders.html.twig", [
            "simpleOrder"           => $simpleOrder,
            "value_select_state"    => $request->request->get('filter_select_state'),
            "filter_check_state"    => $request->request->get('filter_check_state'),
            "order_states"          => $order_states,
            "fresh_url"             => $this->session->get('fresh_config')['fresh_url'],
            "fresh_token"           => $this->session->get('fresh_config')['fresh_token']
        ]);
    }

    /**
     * @Route("/change_status", name="change_status_path")
     * @param Request $request
     */
    public function change_status(Request $request)
    {
        $id = explode('_', $request->request->keys()[0])[2];
        $value = $request->request->get($request->request->keys()[0]);


        $data = array("current_state" => $value);
        $ch = curl_init($this->session->get('fresh_config')['fresh_url'].'/api/orders/'.$id.'&ws_key='.$this->session->get('fresh_config')['fresh_token']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_setopt($ch, CURLOPT_POSTFIELDS,http_build_query($data));

        $response = curl_exec($ch);

        if (!$response)
        {
            return false;
        }

        /*$response = $this->client->request(
            'PUT',
            $this->session->get('fresh_config')['fresh_url'].'/api/orders/'.$id.'&ws_key='.$this->session->get('fresh_config')['fresh_token'],
            [
                'body' => [
                    'current_state' => $value
                ]
            ]
        );
        $statusCode = $response->getStatusCode();
        var_dump($statusCode);
        */

        return new RedirectResponse($this->generateUrl('index_path'));
    }

    public function getOrders($filter = '')
    {
        $file_get = file_get_contents($this->session->get('fresh_config')['fresh_url'].'/api/orders'.$filter.'?output_format=JSON&ws_key='.$this->session->get('fresh_config')['fresh_token']);
        return json_decode($file_get);
    }

    public function getSimpleOrder($id)
    {
        $file_get = file_get_contents($this->session->get('fresh_config')['fresh_url'].'/api/orders/'.$id.'?output_format=JSON&ws_key='.$this->session->get('fresh_config')['fresh_token']);
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

    public function getCustomers($id)
    {
        $file_get = file_get_contents($this->session->get('fresh_config')['fresh_url'].'/api/customers/'.$id.'?output_format=JSON&ws_key='.$this->session->get('fresh_config')['fresh_token']);
        return json_decode($file_get)->customer;
    }

    public function getCustomerAddress($id)
    {
        $customerAddresses = [];
        $file_get = file_get_contents($this->session->get('fresh_config')['fresh_url'].'/api/addresses&filter[id_customer]='.$id.'?output_format=JSON&ws_key='.$this->session->get('fresh_config')['fresh_token']);
        $json = json_decode($file_get);
        if (is_array($json->addresses)) {
            foreach ($json->addresses as $address) {
                $simpleAddress = file_get_contents($this->session->get('fresh_config')['fresh_url'].'/api/addresses/'.$address->id.'?output_format=JSON&ws_key='.$this->session->get('fresh_config')['fresh_token']);
                $simpleCountry = file_get_contents($this->session->get('fresh_config')['fresh_url'].'/api/countries/'.json_decode($simpleAddress)->address->id_country.'?output_format=JSON&ws_key='.$this->session->get('fresh_config')['fresh_token']);
                array_push($customerAddresses, [json_decode($simpleAddress)->address, json_decode($simpleCountry)->country]);
            }
        }
        return $customerAddresses;
    }

    public function getOrderStates()
    {
        $order_states = [];
        $file_get = file_get_contents($this->session->get('fresh_config')['fresh_url'].'/api/order_states?output_format=JSON&ws_key='.$this->session->get('fresh_config')['fresh_token']);
        $json = json_decode($file_get);

        foreach ($json->order_states as $item) {
            $simpleOrderStates = file_get_contents($this->session->get('fresh_config')['fresh_url'].'/api/order_states/'.$item->id.'?output_format=JSON&ws_key='.$this->session->get('fresh_config')['fresh_token']);
            array_push($order_states, json_decode($simpleOrderStates)->order_state);
        }
        return $order_states;
    }

    public function getSimpleOrderStates($id)
    {
        $file_get = file_get_contents($this->session->get('fresh_config')['fresh_url'].'/api/order_states/'.$id.'?output_format=JSON&ws_key='.$this->session->get('fresh_config')['fresh_token']);
        return json_decode($file_get)->order_state;
    }
}