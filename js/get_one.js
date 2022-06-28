
// GET ONE resource for each .btn_get_one clicked

// as .btn_get_one is not initially in the DOM, need to create an observer with the callback function addListener()
// -> main.js



// FUNCTION get_one
const get_one = (btn_event) => {
    const ID = btn_event.target.closest("[data-id]").dataset.id;
    const RESOURCES = btn_event.target.closest("[data-resources]").dataset.resources;

    // Http Request
    let http_request = new XMLHttpRequest();
    
    http_request.open("GET", url_base() + "/" + RESOURCES + "/" + ID, true);
    http_request.send();
    
    http_request.onreadystatechange = () => {
        // if server has received the request made by the client & a response is ready to be sent
        if(http_request.readyState == 4 && http_request.status == 200) {

            // parse() method to convert JSON string to JSON object
            const _JSON = JSON.parse(http_request.responseText);

            // display
            let html = "";

            // if message
            if(_JSON.message) {
                // display it
                html += "<div class='text-center my-4 fs-5'>"+ _JSON.message +"</div>";
            }
            // else display result
            else {
                html += display_one(RESOURCES, _JSON);
            }

            // innerHTML
            document.getElementById("result").innerHTML = html;

            // clear data
            clear_data(_JSON);
        }

        // else if server returns status 404
        else if(http_request.readyState == 4 && http_request.status == 404) {
            // set alert()
            error_response(http_request);
        }
    }
}


// FUNCTION display_one
const display_one = (resources, json) => {
    const RESOURCE = resources.slice(0, -1);
    let html = "";

    // check json properties & display result
    if(json.hasOwnProperty("id") && (json.hasOwnProperty("name") && json.hasOwnProperty("email") || json.hasOwnProperty("title") && json.hasOwnProperty("description") && json.hasOwnProperty("creation_date") && json.hasOwnProperty("status") && json.hasOwnProperty("user_id"))) {

        // dynamic title
        html += "<h2 class='text-center my-4 fs-4 fw-bold'>"+ RESOURCE +" "+ json.id +"</h2>";
        
        html += "<div class='card col-11 col-sm-10 col-xl-9 col-xxl-8 mx-auto' data-resources='"+ resources +"' data-id='"+ json.id +"'>";
        html +=     "<div class='card-body'>";

        switch(RESOURCE) {
            case "user":
                html += "<div class='row row-cols-auto justify-content-between align-items-center mx-auto'>";
                html +=     "<div class='col p-0 me-2'>";
                html +=         "<h3 class='card-title fw-bold'>"+ json.name +"</h3>";
                html +=         "<p class='card-text'>"+ json.email +"</p>";
                html +=     "</div>";
                html +=     "<div class='col p-0 my-1'>";
                html +=         "<button type='button' class='btn_user_tasks col border border-primary rounded p-2 bg-primary bg-opacity-50 text-reset me-1 me-sm-2' data-resources2='tasks'>Tasks of user</button>";
                html +=         "<button type='button' class='btn_edit    fas fa-edit      fa-lg fs-4 bg-transparent text-primary opacity-75 border-0 px-0 py-1 p-sm-1 ms-3 me-2' data-bs-toggle='modal' data-bs-target='#modal_form'></button>";
                html +=         "<button type='button' class='btn_delete  fas fa-trash-alt fa-lg fs-4 bg-transparent text-primary opacity-75 border-0 px-0 py-1 p-sm-1 ms-2'></button>";
                html +=     "</div>";
                html += "</div>";
            break;

            case "task":
                html += "<h3 class='card-title fw-bold'>"+ json.title.replace(/\n/g, "<br>") +"</h3>";
                html += "<div class='d-flex justify-content-between align-items-center'>";
                html +=     "<p class='card-text text-secondary'>"+ json.creation_date +"</p>";
                html +=     "<div>";
                html +=         "<button type='button' class='btn_edit    fas fa-edit      fa-lg fs-5 bg-transparent text-primary opacity-75 border-0 px-0 py-1 p-sm-1 mx-2 mx-sm-3' data-bs-toggle='modal' data-bs-target='#modal_form'></button>";
                html +=         "<button type='button' class='btn_delete  fas fa-trash-alt fa-lg fs-5 bg-transparent text-primary opacity-75 border-0 px-0 py-1 p-sm-1 ms-2 ms-sm-3'></button>";
                html +=     "</div>";
                html += "</div>";
                html += "<div class='d-flex justify-content-between mt-1'>";
                html +=     json.status == 0 ? "<p class='card-text text-danger'>waiting...</p>" : json.status == 1 ? "<p class='card-text text-success'>done !</p>" : json.status == 2 ? "<p class='card-text text-warning'>in progress...</p>" : "";
                html +=     "<a class='btn_get_one card-text fst-italic' data-resources='users' data-id='" + json.user_id + "' style='cursor: pointer;'> user : "+ json.user_id +"</a>";
                html += "</div>";
                html += json.description.length > 0 ? "<p class='card-text mt-3'>"+ json.description.replace(/\n/g, "<br>") +"</p>" : "";
            break;

            default:
                html += "<p>Resource display is not defined</p>";
        }
        html +=     "</div>";
        html += "</div>";
    }
    return html;
}
