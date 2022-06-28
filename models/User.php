<?php
    namespace models;

    Class User {

        // DATABASE
        private $db;
        private $table = "api_user";
        private $joined_table = "api_task";

        // USER PROPERTIES
        private $id;
        private $name;
        private $email;


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
        

        // name
        public function setName($name) {
            // Clean data (xss)
            $name = htmlspecialchars(strip_tags(trim($name)));

            // Checking value
            if(preg_match("#^[a-zA-Zàâäéèêëêîïôöûüùç '-]{2,255}$#", $name) && iconv_strlen($name) >= 2 && iconv_strlen($name) <= 255) {
                $this->name = ucwords($name);
                return true;
            }
        }

        public function getName() {
            return $this->name;
        }
        

        // email
        public function setEmail($email) {
            // Clean data (xss)
            $email = htmlspecialchars(strip_tags(trim($email)));

            // Checking value
            if(is_string($email) && iconv_strlen($email) <= 255 && filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->email = mb_strtolower($email);
                return true;
            }
        }

        public function getEmail() {
            return $this->email;
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


        // READ ALL USERS    (/users)
        public function read_all() {
            // Create query
            $sql = "SELECT * FROM " . $this->table;
      
            // Prepare statement
            $stmt = $this->db->prepare($sql);
        
            // Execute query
            if($stmt->execute()) {
                return $stmt->fetchAll(\PDO::FETCH_ASSOC);
            }

            // no data : return false
            return false;
        }


        // READ ONE USER    (/users/id)
        public function read_one() {
            // Create query
            $sql = "SELECT * FROM " . $this->table . " WHERE id = :id";
      
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
                    $this->name = $row["name"];
                    $this->email = $row["email"];

                    return true;
                }
            }

            // no data : return false
            return false;
        }


        // CREATE USER      (/users)
        public function create() {
            // Create query
            $sql = "INSERT INTO " . $this->table . " (name, email) VALUES (:name, :email)";

            // Prepare statement
            $stmt = $this->db->prepare($sql);

            // Bind values
            $stmt->bindValue(":name", $this->name, \PDO::PARAM_STR);
            $stmt->bindValue(":email", $this->email, \PDO::PARAM_STR);

            // Execute query
            if($stmt->execute()) {
                return $this->db->lastInsertId();
            }

            // no data : return false
            return false;
        }


        // UPDATE USER      (/users/id)
        public function update() {
            // Create query
            $sql = "UPDATE " . $this->table . " SET name = :name, email = :email WHERE id = :id";

            // Prepare statement
            $stmt = $this->db->prepare($sql);

            // Bind values
            $stmt->bindValue(":name", $this->name, \PDO::PARAM_STR);
            $stmt->bindValue(":email", $this->email, \PDO::PARAM_STR);
            $stmt->bindValue(":id", $this->id, \PDO::PARAM_INT);

            // Execute query
            if($stmt->execute()) {
                return true;
            }

            // no data : return false
            return false;
        }


        // DELETE USER      (/users/id)     only if tasks associated have status = 1 (done)
        public function delete() {
            // Create select query to check status of tasks associated with this user
            $sql = "SELECT * FROM " . $this->joined_table . " WHERE user_id = :id AND status != 1";

            // Prepare statement
            $stmt = $this->db->prepare($sql);

            // Bind value
            $stmt->bindValue(":id", $this->id, \PDO::PARAM_INT);

            // Execute select query
            if($stmt->execute()) {
                // if no row affected by the select query (only status == 1) : delete user and his tasks status 1
                if($stmt->rowCount() == 0) {
                    // Create delete query
                    $sql = "DELETE u, t FROM " . $this->table . " u
                    LEFT JOIN " . $this->joined_table . " t
                    ON u.id = t.user_id 
                    WHERE u.id = :id";

                    // Prepare statement
                    $stmt = $this->db->prepare($sql);
        
                    // Bind value
                    $stmt->bindValue(":id", $this->id, \PDO::PARAM_INT);

                    // Execute delete query
                    if($stmt->execute()) {
                        return true;
                    }
                }
                // else delete not allowed
                else {
                    return 405;
                }
            }
            // no data : return false
            return false;
        }
    }
?>
