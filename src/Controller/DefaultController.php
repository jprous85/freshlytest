<?php


namespace App\Controller;

use App\Service\OrderService;
use App\Service\GeneralServices;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @Route("/", name="index_path")
     * @return object
     */
    public function index()
    {
        $generalServices = new GeneralServices();
        if (!$generalServices->getConfigSession()) {
            return new RedirectResponse($this->generateUrl('fresh_config_path'));
        }

        $orderService   = new OrderService();
        $order_states   = $orderService->getOrderStates();
        $simpleOrder    = $orderService->getAllOrders();

        return $this->render("orders/orders.html.twig", [
            "simple_order"  => json_encode($simpleOrder),
            "order_states"  => json_encode($order_states),
            "credentials"   => json_encode($generalServices->getCredentials()),
        ]);
    }

}