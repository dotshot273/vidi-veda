<?php
header('Content-Type: application/json');
echo json_encode([
    "success" => true,
    "message" => "API folder is reachable",
    "file" => basename(__FILE__)
]);
