<?php
    namespace controllers;

    Class UserController {

        // URL 
        private $url;

        // MODEL
        private $user;
    

        // CONSTRUCTOR
        public function __construct() {
            // URL - trim() function removes a possible "/" at the end of base_url
            $this->url = trim("https://" . $_SERVER["SERVER_NAME"] . dirname($_SERVER["SCRIPT_NAME"]), "\\/") . "/users";

            // Instantiation of Model
            $this->user = new \models\User;
        }


        // GET ALL USERS    (/users)
        public function get_all() {

            // query method in model
            $data = $this->user->read_all();

            // if $data : push it in result
            if($data) {
                // by adding URLs for each
                for($i = 0; $i < sizeof($data); $i++) {
                    $data[$i]["url"] = $this->url ."/". $data[$i]["id"];
                    $data[$i]["url_tasks"] = $this->url ."/". $data[$i]["id"] ."/tasks";
                }
                $result = ["result" => $data];
            }
            // else message & need to have fields value for add form (modal)
            else {
                $fields = $this->user->fields();
                $result = ["message" => "No user found"];

                if($fields) {
                    foreach($fields as $v) {
                        $result[$v] = null;
                    }
                }
            }
            return $result;
        }


        // GET ONE USER     (/users/id)
        public function get_one($id) {

            // check setter id : as it's in url, if not true : 404
            if($this->user->setId($id) !== true) {
                $result = 404;
            }
            // else valid value
            else {
                // check if $id exists in db
                $is_existing_id = $this->user->is_existing("id");

                // if it exists : query method in model
                if($is_existing_id === true) {
                    // set values to the object
                    if($this->user->read_one()) {

                        // get values to array $data
                        $data = [   "id" => $this->user->getId(), 
                                    "name" => $this->user->getName(), 
                                    "email" => $this->user->getEmail(),
                                    "url" => $this->url ."/". $this->user->getId(),
                                    "url_tasks" => $this->url ."/". $this->user->getId() ."/tasks",
                                ];

                        $result = ["result" => $data];
                    }
                    else
                        $result = ["message" => "User not found"];
                }
                // else $id doesn't exist in db : 404
                else if($is_existing_id === false) {
                    $result = 404;
                }
                // else message
                else 
                    $result = ["message" => $is_existing_id];
            }

            return $result;
        }


        // POST USER        (/users)
        public function post($data) {

            if(isset($data) && isset($data->name) && !empty($data->name) && isset($data->email) && !empty($data->email)) {

                // check setters : if not true set message
                if($this->user->setName($data->name) !== true) {
                    $result = ["message" => "Invalid name"];
                }
                else if($this->user->setEmail($data->email) !== true) {
                    $result = ["message" => "Invalid email"];
                }
                // else valid values
                else {
                    // check if email not already in db
                    $is_existing_email = $this->user->is_existing("email");

                    // if it doesn't exist : create user
                    if($is_existing_email === false) {
                        // get last inserted id returned
                        $id = $this->user->create();

                        // check response
                        if($id && $this->user->setId($id)) {
                            $data = [   "id" => $this->user->getId(), 
                                        "name" => $this->user->getName(), 
                                        "email" => $this->user->getEmail(),
                                        "url" => $this->url ."/". $this->user->getId(),
                                        "url_tasks" => $this->url ."/". $this->user->getId() ."/tasks",
                                    ];

                            $result = ["result" => $data];
                        }
                        else
                            $result = ["message" => "The user couldn't be added"];
                    }
                    // else email already exists in db : message
                    else if($is_existing_email === true) {
                        $result = ["message" => "This email already exists"];
                    }
                    // else message
                    else 
                        $result = ["message" => $is_existing_email];
                }
            }
            else 
                $result = ["message" => "Missing informations"];

            return $result;
        }


        // PUT USER         (/users/id)
        public function put($data) {

            if(isset($data) && isset($data->id) && !empty($data->id) && isset($data->name) && !empty($data->name) && isset($data->email) && !empty($data->email)) {

                // check setters : if not true set message (for id = 404)
                if($this->user->setId($data->id) !== true) {
                    $result = 404;
                }
                else if($this->user->setName($data->name) !== true) {
                    $result = ["message" => "Invalid name"];
                }
                else if($this->user->setEmail($data->email) !== true) {
                    $result = ["message" => "Invalid email"];
                }
                // else valid values
                else {
                    // check if $data->id exists in db
                    $is_existing_id = $this->user->is_existing("id");
    
                    // if $data->id exists
                    if($is_existing_id === true) {

                        // query method in model : return result (executed ? true : false)
                        if($this->user->update()) {
                            $data = [   "id" => $this->user->getId(), 
                                        "name" => $this->user->getName(), 
                                        "email" => $this->user->getEmail(),
                                        "url" => $this->url ."/". $this->user->getId(),
                                        "url_tasks" => $this->url ."/". $this->user->getId() ."/tasks",
                                    ];

                            $result = ["result" => $data];
                        }
                        else
                            $result = ["message" => "The user couldn't be updated"];
                    }
                    // else $data->id doesn't exist in db : 404
                    else if($is_existing_id === false) {
                        $result = 404;
                    }
                    // else message
                    else 
                        $result = ["message" => $is_existing_id];
                }
            }
            else 
                $result = ["message" => "Missing informations"];

            return $result;
        }


        // DELETE USER      (/users/id)
        public function delete($id) {

            // check setter id : as it's in url, if not true : 404
            if($this->user->setId($id) !== true) {
                $result = 404;
            }
            // else valid value
            else {
                // check if $id exists in db
                $is_existing_id = $this->user->is_existing("id");

                // if it exists
                if($is_existing_id === true) {
                    // query method in model
                    $delete = $this->user->delete();

                    // check return
                    if($delete === true)
                        $result = ["result" => true];
                    else if($delete == 405)
                        $result = 405;
                    else
                        $result = ["message" => "This user couldn't be deleted"];
                }
                // else $id doesn't exist in db : 404
                else if($is_existing_id === false) {
                    $result = 404;
                }
                // else message
                else 
                    $result = ["message" => $is_existing_id];
            }

            return $result;
        }
    }
?>
