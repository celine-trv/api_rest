<?php
    namespace models;

    Class Task {

        // DATABASE
        private $db;
        private $table = "api_task";


        // TASK PROPERTIES
        private $id;
        private $user_id;
        private $title;
        private $description;
        private $creation_date;
        private $status;


        // CONSTRUCTOR
        public function __construct() {
            // db
            $database = new \init\Database;
            $this->db = $database->connect();
        }


        // SETTERS & GETTERS
        // id
        public function setId($id) {
            // Clean data (xss)
            $id = htmlspecialchars(strip_tags(trim($id)));

            // Checking value
            if($id > 0 && is_numeric($id) && !is_float($id)) {
                $this->id = (int) $id;
                return true;
            }
        }

        public function getId() {
            return $this->id;
        }


        // user_id
        public function setUser_id($user_id) {
            // Clean data (xss)
            $user_id = htmlspecialchars(strip_tags(trim($user_id)));

            // Checking value
            if($user_id > 0 && is_numeric($user_id) && !is_float($user_id)) {
                $this->user_id = (int) $user_id;
                return true;
            }
        }

        public function getUser_id() {
            return $this->user_id;
        }
        

        // title
        public function setTitle($title) {
            // Clean data (xss)
            $title = htmlspecialchars(strip_tags(trim($title)));

            // Checking value
            if(is_string($title) && iconv_strlen($title) >= 2 && iconv_strlen($title) <= 255) {
                $this->title = $title;
                return true;
            }
        }

        public function getTitle() {
            return $this->title;
        }
        

        // description
        public function setDescription($description) {
            // Clean data (xss)
            $description = htmlspecialchars(strip_tags(trim($description)));

            // Checking value
            if(is_string($description) && iconv_strlen($description) <= 10000) {
                $this->description = $description;
                return true;
            }
        }

        public function getDescription() {
            return $this->description;
        }


        // creation_date : no more checking because default value sets in db (current timestamp) when creation and no change after
        public function setCreation_date($creation_date) {
            // Clean data (xss)
            $this->creation_date = htmlspecialchars(strip_tags(trim($creation_date)));
            return true;
        }

        public function getCreation_date() {
            return $this->creation_date;
        }
    

        // status
        public function setStatus($status) {
            // Clean data (xss)
            $status = htmlspecialchars(strip_tags(trim($status)));
    
            // Checking value
            if(is_numeric($status) && preg_match("#^[0-9]{1}$#", $status)) {
                $this->status = (int) $status;
                return true;
            }
        }
    
        public function getStatus() {
            return $this->status;
        }



        // FIELDS
        public function fields() {
            // Create query
            $sql = "DESC " . $this->table;

            // Prepare statement
            $stmt = $this->db->prepare($sql);

            // Execute query
            if($stmt->execute()) {
                $desc = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                $fields = array();
    
                foreach($desc as $v) {
                    $fields[] = $v["Field"];
                }
                return $fields;
            }

            // no data : return false
            return false;
        }


        // ROW COUNT OF A FIELD VALUE
        public function row_count_field($field) {
            if(property_exists($this, $field)) {
                // Create query
                $sql = "SELECT ". $field ." FROM ". $this->table ." WHERE ". $field ." = :". $field;

                // Prepare statement
                $stmt = $this->db->prepare($sql);

                // Bind value
                if(is_int($this->$field) || is_numeric($this->$field) && !is_float($this->$field)) $pdo_param = \PDO::PARAM_INT;
                else $pdo_param = \PDO::PARAM_STR;
                $stmt->bindValue(":". $field, $this->$field, $pdo_param);

                // Execute select query
                if($stmt->execute()) {
                    return $stmt->rowCount();
                }
            }
            else return "Field : \"". $field ."\" doesn't exists";
        }


        // CHECK IF A VALUE EXISTS IN DB
        public function is_existing($field) {
            // get the select query
            $row_count_field = $this->row_count_field($field);

            // check number of rows returned
            if(is_int($row_count_field)) {
                // if > 0 : $field exists
                if($row_count_field > 0) {
                    return true;
                }
                // else $field doesn't exist
                else
                    return false;
            }
            else return $row_count_field;
        }


        // READ ALL TASK    (/tasks)
        public function read_all() {
            // Create query
            $sql = "SELECT *, DATE_FORMAT(creation_date, '%d.%m.%Y') AS creation_date FROM " . $this->table;

            // Prepare statement
            $stmt = $this->db->prepare($sql);
        
            // Execute query
            if($stmt->execute()) {
                return $stmt->fetchAll(\PDO::FETCH_ASSOC);
            }

            // no data : return false
            return false;
        }


        // READ ONE TASK    (/tasks/id)
        public function read_one() {
            // Create query
            $sql = "SELECT *, DATE_FORMAT(creation_date, '%d.%m.%Y') AS creation_date FROM " . $this->table . " WHERE id = :id";
      
            // Prepare statement
            $stmt = $this->db->prepare($sql);

            // Bind id
            $stmt->bindValue(":id", $this->id, \PDO::PARAM_INT);
        
            // Execute query
            if($stmt->execute() && $stmt->rowCount() == 1) {
                // Fetch
                $row = $stmt->fetch(\PDO::FETCH_ASSOC);
      
                // Set properties
                if(is_array($row)) {
                    $this->id = $row["id"];
                    $this->user_id = $row["user_id"];
                    $this->title = $row["title"];
                    $this->description = $row["description"];
                    $this->creation_date = $row["creation_date"];
                    $this->status = $row["status"];

                    return true;
                }
            }

            // no data : return false
            return false;
        }


        // CREATE TASK      (/tasks)
        public function create() {
            // Create query (other fields have default values in db)
            $sql = "INSERT INTO " . $this->table . " (user_id, title, description) VALUES (:user_id, :title, :description)";
  
            // Prepare statement
            $stmt = $this->db->prepare($sql);
  
            // Bind values
            $stmt->bindValue(":user_id", $this->user_id, \PDO::PARAM_INT);
            $stmt->bindValue(":title", $this->title, \PDO::PARAM_STR);
            $stmt->bindValue(":description", $this->description, \PDO::PARAM_STR);
  
            // Execute query
            if($stmt->execute()) {
                return $this->db->lastInsertId();
            }

            // no data : return false
            return false;
        }


        // UPDATE TASK      (/tasks/id)
        public function update() {
            // Create query
            $sql = "UPDATE " . $this->table . " SET user_id = :user_id, title = :title, description = :description, status = :status WHERE id = :id";
  
            // Prepare statement
            $stmt = $this->db->prepare($sql);
  
            // Bind values
            $stmt->bindValue(":id", $this->id, \PDO::PARAM_INT);
            $stmt->bindValue(":user_id", $this->user_id, \PDO::PARAM_INT);
            $stmt->bindValue(":title", $this->title, \PDO::PARAM_STR);
            $stmt->bindValue(":description", $this->description, \PDO::PARAM_STR);
            $stmt->bindValue(":status", $this->status, \PDO::PARAM_INT);
  
            // Execute query
            if($stmt->execute()) {
                return $this->read_one();
            }

            // no data : return false
            return false;
        }


        // DELETE TASK      (/tasks/id)
        public function delete() {
            // Create query
            $sql = "DELETE FROM " . $this->table . " WHERE id = :id";

            // Prepare statement
            $stmt = $this->db->prepare($sql);

            // Bind value
            $stmt->bindValue(":id", $this->id, \PDO::PARAM_INT);

            // Execute query
            if($stmt->execute()) {
                return true;
            }

            // no data : return false
            return false;
        }
    }
?>
