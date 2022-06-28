<?php

// AUTOLOAD + API object
require_once(__DIR__ . "/init/Autoload.php");
$api = new api\Api;


// if $_GET["resource"] : call_api()
if(isset($_GET["resource"])) {
    $api->call_api();
}
// else display html
else {
    ?>

    <!DOCTYPE html>
    <html lang="fr">
        <head>
            <!-- Required meta tags -->
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <meta name="author" content="Celine Trv">
            <meta name="keywords" content="api, rest, restfull api">
            <meta name="description" content="API REST with PHP, POO, MVC, JSON, AJAX, JS">

            <!-- CDN fontawesome -->
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">

            <!-- Bootstrap -->
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

            <!-- CSS -->
            <link rel="stylesheet" href="css/style.css">

            <link rel="icon" type="image/png" href="favicon.png"/>
            <title>API Rest</title>
        </head>

        <body>
            <!-- CONTAINER -->
            <div class="container my-4">
                <h1 class="text-center my-4 fs-2">API Rest</h1>
                
                <div id="content">
                    <!-- buttons to get_all resources -->
                    <ul class="resources row row-cols-auto justify-content-evenly align-items-end mx-auto list-unstyled">

                        <?php foreach($api::RESOURCES as $key => $value): ?>
                            <li class="col text-nowrap d-flex flex-column align-items-center">
                                <div>
                                    <a href="<?= $key.'s'; ?>" target="blank">/<?= $key.'s'; ?></a><br>
                                    <a href="<?= $key.'s'; ?>/1" target="blank">/<?= $key.'s'; ?>/{id}</a><br>
                                    <?php if($key == "user"): ?>
                                        <a href="<?= $key.'s'; ?>/1/tasks" target="blank">/<?= $key.'s'; ?>/{id}/tasks</a><br>
                                        <a href="<?= $key.'s'; ?>/1/tasks/12" target="blank">/<?= $key.'s'; ?>/{id}/tasks/{id}</a><br>
                                    <?php endif; ?>
                                </div>

                                <button type="button" class="border border-primary rounded p-2 bg-primary bg-opacity-50 text-reset mx-2 mt-3 mb-4" data-resources="<?= $key.'s'; ?>">List of <?= $key.'s' ?></button>
                            </li>
                        <?php endforeach; ?>

                    </ul>

                    <!-- Result -->
                    <main id="result"></main>

                    <!-- Modal (btn trigger is added by js when get_all request) -->
                    <div id="modal_form" class="modal fade" tabindex="-1" aria-labelledby="modal_form" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content" id="modal_form_content">
                                <div class="modal-header">
                                    <h4 id="modal_form-title" class="modal-title fs-4"></h4>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                <div class="modal-body">
                                    <form class="w-75 mx-auto" id="form_modal" method="POST"></form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <footer></footer>
            </div>      <!-- END CONTAINER -->

            <!-- Bootstrap -->
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
            <!-- JS -->
            <script src="js/main.js"></script>      <!-- THIS ONE NEED TO BE FIRST js -->
            <script src="js/pagination.js"></script>
            <script src="js/get_all.js"></script>
            <script src="js/get_one.js"></script>
            <script src="js/post.js"></script>
            <script src="js/put.js"></script>
            <script src="js/delete.js"></script>
            <script src="js/user_tasks.js"></script>
            <script src="js/form_content.js"></script>
            <script src="js/form_submit.js"></script>
        </body>
    </html>
            
<?php
    }   // END of ELSE
?>
