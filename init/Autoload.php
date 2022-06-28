<?php
    
    class Autoload {
        
        public static function auto_require($className) {
            $path_to_file = dirname(__DIR__) . "/" . str_replace("\\", "/", $className . ".php");

            if(file_exists($path_to_file)) {
                require $path_to_file;
            }
        }
    }

    spl_autoload_register(array("Autoload", "auto_require"));
?>
