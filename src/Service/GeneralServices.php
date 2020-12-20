<?php


namespace App\Service;

use Symfony\Component\HttpFoundation\Session\Session;
use App\Utils\Constants;

class GeneralServices
{
    private $session;

    public function __construct()
    {
        if (!$this->session){
            $this->session = new Session();
        }
    }

    public function getConfigSession()
    {
        return $this->session->get(Constants::FRESH_CONFIG);
    }

    public function getCredentials()
    {
        return [
            Constants::FRESH_URL    => $this->getConfigSession()[Constants::FRESH_URL],
            Constants::FRESH_TOKEN  => $this->getConfigSession()[Constants::FRESH_TOKEN]
        ];
    }
}