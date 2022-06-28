
// POST or PUT a resource for each .btn_submit clicked (.btn_submit_add or .btn_submit_edit)

// as .btn_submit is not initially in the DOM, need to create an observer with the callback function addListener()
// -> main.js



// FUNCTION form_submit
const form_submit = (btn_event, action, resources, id = null) => {
    const RESOURCE = resources.slice(0, -1);

    // preventDefault
    document.getElementById("form_modal").addEventListener("submit", (e) => { e.preventDefault() });

    // object to send data
    let data = { "id" : id };
    
    // set properties and values (of form) in the obj
    for(let form_element of btn_event.target.closest("form").querySelectorAll("[name]:not(meta)")) {
        let name = form_element.getAttribute("name");

        if(form_element.localName == "select") {
            data[name] = form_element.options[form_element.selectedIndex].value;
        }
        else {
            data[name] = form_element.value;
        }
    }

    // Http Request
    let http_request = new XMLHttpRequest();
    
    if(action == "post") {
        http_request.open("POST", url_base() + "/" + resources, true);
    }
    else if(action == "put" && data.id) {
        http_request.open("PUT", url_base() + "/" + resources + "/" + data.id, true);
    }
    else {
        alert("Request not defined");
    }
    http_request.send(JSON.stringify(data));
    
    http_request.onreadystatechange = () => {
        // if server has received the request & new resource has been created ("post" -> 201) OR a response is ready to be sent ("put" -> 200)
        if(http_request.readyState == 4 && (action == "post" && http_request.status == 201 || action == "put" && http_request.status == 200)) {

            // parse() method to convert JSON string to JSON object
            const _JSON = JSON.parse(http_request.responseText); 

            // if message
            if(action == "put" && _JSON.message) {
                // display message in modal-body
                form_msg(_JSON.message);
            }
            // else success action
            else {
                // empty form input
                document.querySelectorAll(".form-control").forEach(input => {
                    input.value = "";
                    input.classList.remove("border", "border-success");
                })
                // // remove form
                // document.getElementById("form_modal").innerHTML = "";
                
                // confirm message in modal-body
                let message = RESOURCE.charAt(0).toUpperCase() + RESOURCE.slice(1) + (action == "post" ? " created" : action == "put" ? " updated" : "");
                form_msg(message, success = true);

                // close modal after 1.5 second
                setTimeout(() => { bootstrap.Modal.getInstance(document.getElementById("modal_form")).hide(); }, 1500);

                // display result
                document.getElementById("result").innerHTML = display_one(resources, _JSON);
            }
    
            // clear data
            clear_data(_JSON);
        }
            
        // if server has received the request made by the client & a response is ready to be sent (message)
        else if(http_request.readyState == 4 && (action == "post" && http_request.status == 200)) {

            // parse() method to convert JSON string to JSON object
            const _JSON = JSON.parse(http_request.responseText);

            // if message
            if(_JSON.message) {
                // display message in modal-body
                form_msg(_JSON.message);
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


// FUNCTION form_msg to display message on the top of the form
const form_msg = (message, success = false) => {
    // if #form_message element doesn't exist : create and add msg
    if(!document.getElementById("form_message")) {
        let div = document.createElement("div");
        div.id = "form_message";
        div.classList.add("mx-auto", "text-center", "py-2", "alert");
        success === true ? div.classList.add("alert-success") : div.classList.add("alert-danger");
        div.style.width = "max-content";
        div.style.maxWidth = "75%";
        div.innerHTML = success === true ? ("<i class='fas fa-check text-success me-2'></i>" + message) : ("<i class='fas fa-exclamation-triangle alert-danger me-2'></i>" + message);
        document.querySelector("#modal_form .modal-body").prepend(div);
    }
    // else : just add msg
    else {
        let div = document.getElementById("form_message");
        if(div.classList.contains("alert-success")) div.classList.remove("alert-success");
        if(div.classList.contains("alert-danger")) div.classList.remove("alert-danger");
        success === true ? div.classList.add("alert-success") : div.classList.add("alert-danger");
        div.innerHTML = success === true ? ("<i class='fas fa-check text-success me-2'></i>" + message) : ("<i class='fas fa-exclamation-triangle alert-danger me-2'></i>" + message);
    }
}


// remove #form_message if there is one when modal closes
document.getElementById("modal_form").addEventListener("hidden.bs.modal", () => {
    if(document.getElementById("form_message")) 
        document.getElementById("form_message").remove();
});
