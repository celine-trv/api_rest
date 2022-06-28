<?php
    namespace api;

    Class Api {

        public $http_protocol;
        public $http_request;

        private $userController;
        private $taskController;

        const RESOURCES = ["user" => "utilisateur", "task" => "tâche"];     // singular values - in order to have the list of each resource dynamically in front & index (title, links, etc) and to choose displaying EN or FR
        private $resource;
        private $resource2;
        private $id;
        private $id2;

        private $result;

    
        // CONSTRUCTOR
        public function __construct() {
            // XSS execution
            $this->xss();

            // http infos
            $this->http_protocol = isset($_SERVER["SERVER_PROTOCOL"]) ? $_SERVER["SERVER_PROTOCOL"] : "HTTP/1.0";
            $this->http_request = isset($_SERVER["REQUEST_METHOD"]) ? $_SERVER["REQUEST_METHOD"] : "GET";

            // Instantiations of Controllers
            $this->userController = new \controllers\UserController;
            $this->taskController = new \controllers\TaskController;

            // define resources
            $this->resource = isset($_GET["resource"]) ? trim($_GET["resource"]) : NULL;
            $this->resource2 = isset($_GET["resource2"]) && $_GET["resource2"] != $this->resource ? trim($_GET["resource2"]) : NULL;

            // define ids & if it is_numeric, convert it in int type
            $this->id = isset($_GET["id"]) && !empty($_GET["id"]) ? trim(filter_input(INPUT_GET, "id")) : NULL;
            $this->id2 = isset($_GET["id2"]) && !empty($_GET["id2"]) ? trim(filter_input(INPUT_GET, "id2")) : NULL;

            $this->id = $this->id > 0 && is_numeric($this->id) && !is_float($this->id) ? (int) $this->id : $this->id;
            $this->id2 = $this->id2 > 0 && is_numeric($this->id2) && !is_float($this->id2) ? (int) $this->id2 : $this->id2;
        }

        
        // XSS attack
        private function xss() {
            foreach($_POST as $key => $value) {
                $_POST[$key] = htmlspecialchars(strip_tags(trim($value)));
            }
            foreach($_GET as $key => $value) {
                $_GET[$key] = htmlentities(strip_tags(trim($value)));
            }
        }


        // RESOURCE_NAME if needed to use it for message (get this one from self::RESOURCES by comparing with the one in $_GET)
        private function resource_name($resource) {
            $resources_keys = array_keys(self::RESOURCES);

            for($i = 0; $i < sizeof($resources_keys); $i++) { 
                if(strpos($resource, $resources_keys[$i]) !== false) {
                    $resource_name = $resources_keys[$i];
                }
            }
            return isset($resource_name) ? $resource_name : "resource";
        }


        // CALL_API
        public function call_api() {
            // header content json
            header("Content-Type: application/json");
                                    
            // define resource_name to use in message
            $resource_name = $this->resource_name($this->resource);
            $resource2_name = $this->resource_name($this->resource2);

            // define controller
            switch($this->resource) {
                // USERS
                case "users":
                    $controller = $this->userController;
                break;
                
                // TASKS
                case "tasks":
                    $controller = $this->taskController;
                break;
                
                // DEFAULT = 404
                default:
                    header($this->http_protocol . " 404 Not Found");
                    echo json_encode(["message" => ucfirst($resource_name) ." not found"]);
                    // echo "<h1>Not Found</h1>The requested URL was not found on this server.";
                break;
            }


            if(isset($controller)) {
                try {

                    // POST
                    if($this->http_request == "POST") {
                        // decode json containing data
                        $data = json_decode(file_get_contents("php://input"));

                        // controller method
                        $post = $controller->post($data);

                        // check if result
                        if(isset($post["result"])) {
                            header($this->http_protocol . " 201 Created");
                            $this->result = $post["result"];
                        }
                        // else message
                        else {
                            $this->result = ["message" => isset($post["message"]) ? $post["message"] : "Error : not added"];
                        }
                        
                        // unset $data
                        unset($data);

                        // json
                        echo json_encode($this->result);
                    }


                    // PUT
                    else if($this->http_request == "PUT" && isset($this->id)) {
                        // decode json containing data
                        $data = json_decode(file_get_contents("php://input"));

                        if($data->id === $this->id) {
                            // controller method
                            $put = $controller->put($data);

                            // check if result
                            if(isset($put["result"])) {
                                $this->result = $put["result"];
                            }
                            else if($put == 404) {
                                header($this->http_protocol . " 404 Not Found");
                                $this->result = ["message" => ucfirst($resource_name) . " not found"];
                            }
                            // else message
                            else {
                                $this->result = ["message" => isset($put["message"]) ? $put["message"] : "Error : not updated"];
                            }
                        }
                        else {
                            header($this->http_protocol . " 400 Bad Request");
                            $this->result = ["message" => "Request or identification of ".$resource_name." ununderstood"];
                        }

                        // unset $data
                        unset($data);

                        // json
                        echo json_encode($this->result);
                    }


                    // DELETE
                    else if($this->http_request == "DELETE" && isset($this->id)) {
                        // controller method
                        $delete = $controller->delete($this->id);

                        // check if result == true ? no content (204) : else message
                        if(isset($delete["result"]) && $delete["result"] === true) {
                            $this->result = NULL;
                        }
                        else if(isset($delete["message"])) {
                            $this->result = ["message" => $delete["message"]];
                        }
                        else if($delete == 404) {
                            header($this->http_protocol . " 404 Not Found");
                            $this->result = ["message" => ucfirst($resource_name) . " not found"];
                        }
                        else if($delete == 405) {
                            header($this->http_protocol . " 405 Not Allowed");
                            $this->result = ["message" => "Impossible to delete this user : \n\nAt least one task \"not done\" or \"in progress\" is associated with this one"];
                        }
                        else 
                            $this->result = ["message" => "Error : not deleted"];

                        // json if message
                        if($this->result) echo json_encode($this->result);
                        else header($this->http_protocol . " 204 No Content");
                    }

                    
                    // GET_ONE
                    else if($this->http_request == "GET" && isset($this->id)) {
                        // controller method
                        $get_one = $controller->get_one($this->id);

                        // check if result
                        if(isset($get_one["result"])) {

                            // check case of resource2
                            switch($this->resource2) {
                                // TASKS
                                case "tasks":
                                    $controller2 = $this->taskController;
                                    $fk_id = "user_id";     // need to define foreign_key field
                                break;
                                
                                // DEFAULT : get_one resource without resource2
                                default:
                                    $this->result = $get_one["result"];
                                break;
                            }

                            // get_one resource with all resource2 associated
                            if(isset($controller2) && !isset($this->id2)) {
                                $get_all_resources2 = $controller2->get_all();

                                // check if result for resource2
                                if(isset($get_all_resources2["result"])) {

                                    // foreach resources2
                                    foreach($get_all_resources2["result"] as $value) {
                                        // if fk_id == id ? add this resource2 in array
                                        if($value[$fk_id] == $get_one["result"]["id"]) {
                                            $this->result[] = $value;
                                        }
                                    }
                                    // check if none match : message
                                    if(!isset($this->result) || empty($this->result)) {
                                        $this->result = ["message" => "No ". $resource2_name ." associated with this ". $resource_name];
                                    }
                                }
                                // else (no result for resource2) : message
                                else {
                                    $this->result = ["message" => isset($get_all_resources2["message"]) ? $get_all_resources2["message"] : "No result found"];
                                }
                            }
                            // get_one resource with one resource2 associated
                            else if(isset($controller2) && isset($this->id2)) {
                                $get_one_resource2 = $controller2->get_one($this->id2);

                                // check if result for this id2
                                if(isset($get_one_resource2["result"])) {

                                    // for this resource2 -> if fk_id == id ? result : message;
                                    $this->result = $get_one_resource2["result"][$fk_id] == $get_one["result"]["id"] ? $get_one_resource2["result"] : ["message" => ucfirst($resource2_name) ." not associated with this ". $resource_name];
                                }
                                // else if this id2 doesn't exist : 404
                                else if($get_one_resource2 == 404) {
                                    header($this->http_protocol . " 404 Not Found");
                                    $this->result = ["message" => ucfirst($resource2_name) . " not found"];
                                }
                                // else message
                                else {
                                    $this->result = ["message" => isset($get_one_resource2["message"]) ? $get_one_resource2["message"] : "No result found"];
                                }
                            }
                        }
                        // else if this id doesn't exist : 404
                        else if($get_one == 404) {
                            header($this->http_protocol . " 404 Not Found");
                            $this->result = ["message" => ucfirst($resource_name) . " not found"];
                        }
                        // else message
                        else {
                            $this->result = ["message" => isset($get_one["message"]) ? $get_one["message"] : "No result found"];
                        }

                        // json
                        echo json_encode($this->result);
                    }

                    
                    // GET_ALL
                    else {
                        $get_all = $controller->get_all();

                        // check if result
                        if(isset($get_all["result"])) {
                            $this->result = $get_all["result"];

                            // search option (autocomplete input)
                            if(isset($_GET["search"]) && !empty($_GET["search"])) {
                                foreach($this->result as $key => $resource_array) {
                                    $i = 0;
            
                                    // search is made on each value of resource
                                    foreach($resource_array as $k => $value) {
                                        // if the value searched matches with one of the value of resource && its key doesn't contain these words : url, date, time, create or update
                                        if(stripos((string)$value, $_GET["search"]) !== false && stripos((string)$k, "url") === false && stripos((string)$k, "date") === false && stripos((string)$k, "time") === false && stripos((string)$k, "create") === false && stripos((string)$k, "update") === false)
                                            $i++;
                                    }
                                    // if none matches the search : unset resource
                                    if($i == 0) {
                                        unset($this->result[$key]);
                                    }
                                }
                                // re-index from 0
                                $this->result = array_values($this->result);
                            }
                        }
                        // else message with fields name (for form)
                        else {
                            $this->result = isset($get_all["message"]) ? $get_all : $get_all += ["message" => "No result found"];
                        }

                        // json
                        echo json_encode($this->result);
                    }
                }
                catch(\Exception $e) {
                    header($this->http_protocol . " 400 Bad Request");
                    echo json_encode(["error" => $e->getMessage()]);
                }
            }
        }
    }
?>
