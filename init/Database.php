<?php
    namespace init;

    class Database {
        
        // DATABASE PARAMS
        private $sgbd = "mysql";
        private $host = "";
        private $db_name = "api_rest";
        private $username = "";
        private $password = "";
        private $options = array(\PDO::ATTR_EMULATE_PREPARES => false, \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION, \PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");
        private $conn;


        // DATABASE CONNECT
        public function connect() {
            $this->conn = null;

            try {
                $this->conn = new \PDO($this->sgbd . ":host=" . $this->host .";dbname=" . $this->db_name . ";charset=utf8", $this->username, $this->password, $this->options);
            }
            catch(\PDOException $e) {
                echo "<strong>ERROR : </strong>" . $e->getMessage();
            }
                
            return $this->conn;
        }
    }
?>
