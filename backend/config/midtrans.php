<?php

return [
    'server_key' => env('MIDTRANS_SERVER_KEY'),
    'client_key' => env('MIDTRANS_CLIENT_KEY'),
    'iris_creator_key' => env('MIDTRANS_IRIS_CREATOR_KEY'),
    'iris_approver_key' => env('MIDTRANS_IRIS_APPROVER_KEY'),
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
];
