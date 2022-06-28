
// GET_ALL RESOURCES for each .resources button clicked
document.querySelectorAll(".resources button").forEach(btn => {
    const RESOURCES = btn.dataset.resources;
    btn.addEventListener("click", () => get_all(RESOURCES, (typeof enable_pagination !== "undefined" ? Number(enable_pagination) : 0)));
});


// FUNCTION get_all
const get_all = (resources, page = 0) => {
    const RESOURCE = resources.slice(0, -1);

    // Http Request
    let http_request = new XMLHttpRequest();
    
    http_request.open("GET", url_base() + "/" + resources, true);
    http_request.send();
    
    http_request.onreadystatechange = () => {
        // if server has received the request made by the client & a response is ready to be sent
        if(http_request.readyState == 4 && http_request.status == 200) {

            // parse() method to convert JSON string to JSON object
            const _JSON = JSON.parse(http_request.responseText);
            
            // json is ordered by id, for ease and better UX re-order it
            // by name for users
            if(Array.isArray(_JSON) && _JSON[0].hasOwnProperty("name")) {
                _JSON.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            }
            // by status for tasks (first : 2-in_progress, second : 0-not_done, last : 1-done)
            else if(Array.isArray(_JSON) && _JSON[0].hasOwnProperty("status")) {
                _JSON.sort((a, b) => ((a.status == 2) ? -1 : (b.status == 2) ? 1 : (a.status - b.status)));
            }

            // display
            let html = "";
            
            // dynamic title
            html += "<h2 class='text-center my-4 fs-4 fw-bold'>List of " + resources + (resources == "users" ? "<br><small class='fw-normal fst-italic fs-6 text'>(fictional names, randomly generated)</small>" : "") + "</h2>";
            // Button trigger modal with form to add a new resource
            html += "<button type='button' class='btn_add border border-primary rounded p-2 mb-4 bg-primary bg-opacity-50 text-reset d-block mx-auto' data-bs-toggle='modal' data-bs-target='#modal_form'>Add a new " + RESOURCE + "</button>";

            // if message
            if(_JSON.message) {
                // display it
                html += "<div class='text-center my-5 fs-5'>" + _JSON.message + "</div>";
            }
            // else display result
            else {
                html += display_all(resources, _JSON, page);
            }

            // innerHTML
            document.getElementById("result").innerHTML = html;
            
            // set form_modal to add a new resource
            form_content("add", resources, _JSON);

            // clear data
            clear_data(_JSON);
        }
    }
}


// FUNCTION display_all
const display_all = (resources, json, page = 0) => {
    const RESOURCE = resources.slice(0, -1);
    let _html = "";

    // pagination option
    let pagination = page != 0 && Number.isInteger(page) && parseFloat(page) == parseInt(page);
    let pagination_config = null;

    if(pagination === true) {
        // initialize it
        pagination_config = paginate(json, page);

        // data to display
        json = pagination_config.data;

        // div .pagination_container
        _html += "<div class='pagination_container'>";
    }
    
    // check json properties & display result
    if(Array.isArray(json) && json[0].hasOwnProperty("id") && (json[0].hasOwnProperty("name") && json[0].hasOwnProperty("email") || json[0].hasOwnProperty("title") && json[0].hasOwnProperty("description") && json[0].hasOwnProperty("creation_date") && json[0].hasOwnProperty("status") && json[0].hasOwnProperty("user_id"))) {

        // table with results
        _html += "<table class='table table-responsive'>";

        // for each resources of json
        for(let value of json) {
            // <tr>
            _html += "<tr class='" + RESOURCE + "' data-resources='" + resources + "' data-id='" + value.id + "'>";

            switch(resources) {
                case "users":
                    // list of users
                    _html += "<td class='py-3 align-middle'>";
                    _html +=     "<h3 class='fw-bold'>" + value.name + "</h3>";
                    _html +=     "<p>" + value.email + "</p>";
                    _html += "</td>";
                    _html += "<td class='td-btns text-end ps-2 align-middle'>";
                    _html +=     "<button type='button' class='btn_get_one fas fa-eye       fa-lg fs-4 bg-transparent text-primary opacity-75 border-0 p-0       p-sm-1 mb-2 me-2 me-sm-3 me-lg-4'></button>";
                    _html +=     "<button type='button' class='btn_edit    fas fa-edit      fa-lg fs-4 bg-transparent text-primary opacity-75 border-0 px-0 py-1 p-sm-1 my-2 mx-2 mx-sm-3 mx-lg-4' data-bs-toggle='modal' data-bs-target='#modal_form'></button>";
                    _html +=     "<button type='button' class='btn_delete  fas fa-trash-alt fa-lg fs-4 bg-transparent text-primary opacity-75 border-0 px-0 py-1 p-sm-1 mt-2 ms-2 ms-sm-3 ms-lg-4'></button>";
                    _html += "</td>";
                break;

                case "tasks":
                    // list of tasks
                    _html += "<td>";
                    _html +=     value.status == 0 ? "<i class='fas fa-times text-danger'></i>" : value.status == 1 ? "<i class='fas fa-check text-success'></i>" : value.status == 2 ? "<i class='fas fa-hourglass-half text-warning'></i>" : "";
                    _html += "</td>";
                    _html += "<td class='py-3" + (value.status == 1 ? " opacity-50'>" : "'>");
                    _html +=     "<h3 class='fw-bold'>" + value.title + "</h3>";
                    _html +=     "<p class='text-secondary my-1'>" + value.creation_date + "</p>";
                    _html +=     "<p>" + (value.description.length > 250 ? value.description.substring(0, 250) + "..." : value.description) + "</p>";
                    _html += "</td>";
                    _html += "<td class='td-btns d-flex flex-column flex-sm-row justify-content-sm-end text-end ps-2'>";
                    _html +=     "<button type='button' class='btn_get_one fas fa-eye       fa-lg fs-4 bg-transparent text-primary opacity-75 border-0 p-0       p-sm-1 mb-2         me-sm-1              me-lg-2 me-xl-3 me-xxl-4 align-self-end' style='transform: translateY(15%);'></button>";
                    _html +=     "<button type='button' class='btn_edit    fas fa-edit      fa-lg fs-4 bg-transparent text-primary opacity-75 border-0 px-0 py-1 p-sm-1 mb-2 ms-sm-2 me-sm-1              mx-lg-2 mx-xl-3 mx-xxl-4' style='transform: translateY(15%);' data-bs-toggle='modal' data-bs-target='#modal_form'></button>";
                    _html +=     "<button type='button' class='btn_delete  fas fa-trash-alt fa-lg fs-4 bg-transparent text-primary opacity-75 border-0 px-0 py-1 p-sm-1 mb-1 ms-sm-2         me-1 me-sm-0 ms-lg-2 ms-xl-3 ms-xxl-4' style='transform: translateY(15%);'></button>";
                    _html += "</td>";
                break;

                default:
                    _html += "<td>Resource display not defined</td>";
            }
            _html += "</tr>";
        }
        _html += "</table>";

        // if pagination
        if(pagination === true) {
            // add nav pagination
            _html += add_nav_pagination(pagination_config);

            // end of div .pagination_container
            _html += "</div>";
        }
    }
    return _html;
}
