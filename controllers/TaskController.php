<?php
    namespace controllers;

    Class TaskController {

        // URL 
        private $url;

        // MODEL
        private $task;
    

        // CONSTRUCTOR
        public function __construct() {
            // URL - trim() function removes a possible "/" at the end of base_url
            $this->url = trim("https://" . $_SERVER["SERVER_NAME"] . dirname($_SERVER["SCRIPT_NAME"]), "\\/") . "/tasks";

            // Instantiation of Model
            $this->task = new \models\Task;
        }


        // GET ALL TASKS    (/tasks)
        public function get_all() {

            // query method in model
            $data = $this->task->read_all();

            // if $data : push it in result
            if($data) {
                // by adding URL for each
                for($i = 0; $i < sizeof($data); $i++) {
                    $data[$i]["url"] = $this->url ."/". $data[$i]["id"];
                }
                $result = ["result" => $data];
            }
            // else message & need to have fields value for the add form (modal)
            else {
                $fields = $this->task->fields();
                $result = ["message" => "No task found"];

                if($fields) {
                    foreach($fields as $v) {
                        $result[$v] = NULL;
                    }
                }
            }
            return $result;
        }


        // GET ONE TASK (/tasks/id)
        public function get_one($id) {

            // check setter id : as it's in url, if not true : 404
            if($this->task->setId($id) !== true) {
                $result = 404;
            }
            // else valid value
            else {
                // check if $id exists in db
                $is_existing_id = $this->task->is_existing("id");

                // if it exists : query method in model
                if($is_existing_id === true) {
                    // set values to the object
                    if($this->task->read_one()) {
                    
                        // get values to array $data
                        $data = [   "id" => $this->task->getId(), 
                                    "user_id" => $this->task->getUser_id(), 
                                    "title" => $this->task->getTitle(),
                                    "description" => $this->task->getDescription(),
                                    "creation_date" => $this->task->getCreation_date(),
                                    "status" => $this->task->getStatus(),
                                    "url" => $this->url ."/". $this->task->getId(),
                                ];

                        $result = ["result" => $data];
                    }
                    else
                        $result = ["message" => "Task not found"];
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


        // POST TASK    (/tasks)
        public function post($data) {

            // $data->description : facultative
            if(isset($data) && isset($data->user_id) && !empty($data->user_id) && isset($data->title) && !empty($data->title) && isset($data->description)) {
                
                // check setters : if not true set message
                if($this->task->setUser_id($data->user_id) !== true) {
                    $result = ["message" => "Invalid user id"];
                }
                else if($this->task->setTitle($data->title) !== true) {
                    $result = ["message" => "Invalid title"];
                }
                else if($this->task->setDescription($data->description) !== true) {
                    $result = ["message" => "Invalid description"];
                }
                // else valid values
                else {
                    // check if user id exists in db
                    $user = new \models\User;
                    
                    if($user->setId($data->user_id) !== true) {
                        $result = ["message" => "Invalid user id"];
                    }
                    else {
                        // check if user_id exists in db user
                        $is_existing_user_id = $user->is_existing("id");

                        // if it exists : create task
                        if($is_existing_user_id === true) {
                            // get last inserted id returned
                            $id = $this->task->create();

                            if($id && $this->task->setId($id)) {
                                $data = [   "id" => $this->task->getId(), 
                                            "user_id" => $this->task->getUser_id(), 
                                            "title" => $this->task->getTitle(),
                                            "description" => $this->task->getDescription(),
                                            "creation_date" => date("d/m/Y"),           // default value in db
                                            "status" => 0,                              // default value in db
                                            "url" => $this->url ."/". $this->task->getId(),
                                        ];

                                $result = ["result" => $data];
                            }
                            else
                                $result = ["message" => "The task couldn't be added"];
                        } 
                        // else the user doesn't exist in db : message
                        else if($is_existing_user_id === false) {
                            $result = ["message" => "User not found"];
                        }
                        // else message
                        else 
                            $result = ["message" => $is_existing_user_id];
                    }
                }
            }
            else 
                $result = ["message" => "Missing informations"];

            return $result;
        }


        // PUT TASK     (/tasks/id)
        public function put($data) {

            // $data->description : facultative
            if(isset($data) && isset($data->id) && !empty($data->id) && isset($data->user_id) && !empty($data->user_id) && isset($data->title) && !empty($data->title) && isset($data->description) && isset($data->status) && (!empty($data->status) || strlen($data->status) > 0)) {

                // check setters : if not true set message (for id = 404)
                if($this->task->setId($data->id) !== true) {
                    $result = 404;
                }
                else if($this->task->setUser_id($data->user_id) !== true) {
                    $result = ["message" => "Invalid user id"];
                }
                else if($this->task->setTitle($data->title) !== true) {
                    $result = ["message" => "Invalid title"];
                }
                else if($this->task->setDescription($data->description) !== true) {
                    $result = ["message" => "Invalid description"];
                }
                else if($this->task->setStatus($data->status) !== true) {
                    $result = ["message" => "Invalid status"];
                }
                // else valid values
                else {
                    // check if $data->id exists in db
                    $is_existing_id = $this->task->is_existing("id");
    
                    // if $data->id exists
                    if($is_existing_id === true) {

                        // check if user id exists in db
                        $user = new \models\User;
                        
                        if($user->setId($data->user_id) !== true) {
                            $result = ["message" => "Invalid user id"];
                        }
                        else {
                            // check if user id exists in db user
                            $is_existing_user_id = $user->is_existing("id");
    
                            // if it exists : create task
                            if($is_existing_user_id === true) {

                                // query method in model : return result (executed ? true : false)
                                if($this->task->update()) {

                                    // get values updated to array $data
                                    $data = [   "id" => $this->task->getId(), 
                                                "user_id" => $this->task->getUser_id(), 
                                                "title" => $this->task->getTitle(),
                                                "description" => $this->task->getDescription(),
                                                "creation_date" => $this->task->getCreation_date(),
                                                "status" => $this->task->getStatus(),
                                                "url" => $this->url ."/". $this->task->getId(),
                                            ];

                                    $result = ["result" => $data];
                                }
                                else
                                    $result = ["message" => "The task couldn't be updated"];
                            } 
                            // else the user id doesn't exist in db : message
                            else if($is_existing_user_id === false) {
                                $result = ["message" => "User not found"];
                            }
                            // else message
                            else 
                                $result = ["message" => $is_existing_user_id];
                        }
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


        // DELETE TASK  (/tasks/id)
        public function delete($id) {

            // check setter id : as it's in url, if not true : 404
            if($this->task->setId($id) !== true) {
                $result = 404;
            }
            // else valid value
            else {
                // check if $id exists in db
                $is_existing_id = $this->task->is_existing("id");

                // if it exists
                if($is_existing_id === true) {
                    // query method in model
                    $delete = $this->task->delete();

                    // check return
                    $result = $delete ? ["result" => true] : ["message" => "This task couldn't be deleted"];
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
