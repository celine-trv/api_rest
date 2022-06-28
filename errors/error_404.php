<?php
    header("Content-Type: application/json");
    echo json_encode(isset($_GET["resource"]) ? ["message" => ucfirst($_GET["resource"]) . " not found"] : ["message" => "Resource not found"]);
?>
