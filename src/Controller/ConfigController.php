<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

use App\Utils\Constants;
use App\Service\GeneralServices;

class ConfigController extends AbstractController
{

    private $client;
    private $session;

    public function __construct(HttpClientInterface $client)
    {
        $this->client = $client;
        $this->session = new Session();
    }

    /**
     * @Route("/config", name="fresh_config_path")
     */
    public function config()
    {
        $generalService = new GeneralServices();
        $credentials = [
            Constants::FRESH_URL     => null,
            Constants::FRESH_TOKEN   => null,
        ];

        if (isset($generalService->getConfigSession()[Constants::FRESH_URL]) &&
            isset($generalService->getConfigSession()[Constants::FRESH_TOKEN])) {
            $credentials = $generalService->getCredentials();
        }
        return $this->render(
            "config/fresh_config.html.twig",
            [
                "credentials" => $credentials,
            ]
        );
    }

    /**
     * @Route("/configpost", name="fresh_config_post_path")
     * @param Request $request
     * @return object
     * @throws TransportExceptionInterface
     */
    public function configPost(Request $request)
    {
        $req = $request->request->all();
        $response = $this->client->request(
            'GET',
            $req[Constants::FRESH_URL]
        );

        $statusCode = $response->getStatusCode();


        if (intval($statusCode) == 200) {
            $this->session->set(Constants::FRESH_CONFIG, $req);

            return new RedirectResponse($this->generateUrl('index_path'));
        }

        return new RedirectResponse($this->generateUrl('fresh_config_path'));
    }
}