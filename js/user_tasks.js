
// GET USER TASKS

// as .btn_user_tasks is not initially in the DOM, need to create an observer with the callback function addListener()
// -> main.js



// FUNCTION get_one
const get_user_tasks = (btn_event) => {
    const ID = btn_event.target.closest("[data-id]").dataset.id;
    const RESOURCES = btn_event.target.closest("[data-resources]").dataset.resources;
    const RESOURCES2 = btn_event.target.closest("[data-resources2]").dataset.resources2;
    const RESOURCE = RESOURCES.slice(0, -1);

    // Http Request
    let http_request = new XMLHttpRequest();
    
    http_request.open("GET", url_base() + "/" + RESOURCES + "/" + ID + "/" + RESOURCES2, true);
    http_request.send();
    
    http_request.onreadystatechange = () => {
        // if server has received the request made by the client & a response is ready to be sent
        if(http_request.readyState == 4 && http_request.status == 200) {

            // parse() method to convert JSON string to JSON object
            const _JSON = JSON.parse(http_request.responseText);
            
            // json is ordered by id, for ease and better UX re-order tasks by status (2-in_progress, 0-not_done, 1-done)
            if(Array.isArray(_JSON) && _JSON[0].hasOwnProperty("status")) {
                _JSON.sort((a, b) => ((a.status == 2) ? -1 : (b.status == 2) ? 1 : (a.status - b.status)));
            }

            // display
            let html = "";

            // if message
            if(_JSON.message) {
                html += "<div class='text-center my-5 fs-5'>" + _JSON.message + "</div>";
            }
            // else check properties & result to display
            else if(Array.isArray(_JSON) && _JSON[0].user_id == ID) {
                
                // dynamic title
                html += "<h5 class='text-center my-5 mb-3 fs-5'>" + RESOURCES2 + " of " + RESOURCE + " " + ID + "</h5>";
                // table with results
                html += display_all(RESOURCES2, _JSON);
            }

            // innerHTML (append)
            let div_result_id = RESOURCE + "_" + RESOURCES2;
            if(!document.getElementById(div_result_id)) {
                let div = document.createElement("div");
                div.id = div_result_id;
                // need to add a condition in order to not repeat innerHTML because it loses the event handlers. So if btn_user_tasks is clicked again, innerHTML remove the elements that has events and the new btn added lose the eventlistener...
                if(!div.innerHTML.length) div.innerHTML = html;
                document.getElementById("result").append(div);
            }
            else {
                // need to add a condition in order to not repeat innerHTML because it loses the event handlers. So if btn_user_tasks is clicked again, innerHTML remove the elements that has events and the new btn added lose the eventlistener...
                if(!document.getElementById(div_result_id).innerHTML.length) document.getElementById(div_result_id).innerHTML = html;
            }
    
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
