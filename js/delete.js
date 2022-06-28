
// DELETE resource for each .btn_delete clicked

// as .btn_delete is not initially in the DOM, need to create an observer with the callback function addListener()
// -> main.js



// FUNCTION delete_one
const delete_one = (btn_event) => {
    const ID = btn_event.target.closest("[data-id]").dataset.id;
    const RESOURCES = btn_event.target.closest("[data-resources]").dataset.resources;
    const RESOURCE = RESOURCES.slice(0, -1);

    // confirm by user before sending request
    let text = RESOURCES == "users" ? "\nAll tasks \"done\" associated with this one will also be deleted. \n\nPS : You're able to delete an user only if there is no task \"not done\" or \"in progress\" associated with this one." : "";
    
    if(confirm("Are you sure you want to delete this " + RESOURCE + " ?" + text)) {

        // Http Request
        let http_request = new XMLHttpRequest();
        
        http_request.open("DELETE", url_base() + "/" + RESOURCES + "/" + ID, true);
        http_request.send();
        
        http_request.onreadystatechange = () => {
            // if server has received the request made by the client & a response is ready with status 204 no-content = deleted with success
            if(http_request.readyState == 4 && http_request.status == 204) {

            // confirm message with overlay
                // create overlay
                if(!document.getElementById("overlay")) {
                    let div = document.createElement("div");
                    div.id = "overlay";
                    div.classList.add("position-fixed", "d-none", "top-0", "start-0", "bottom-0", "end-0", "w-100", "h-100", "bg-dark", "bg-opacity-75");
                    document.getElementById("result").append(div);
                }

                // create div message in overlay
                if(document.getElementById("overlay") && !document.getElementById("delete_message")) {
                    let div = document.createElement("div");
                    div.id = "delete_message";
                    div.classList.add("position-absolute", "top-50", "start-50", "translate-middle", "alert", "alert-success", "text-center");
                    div.style.width = "max-content";
                    div.style.maxWidth = "75%";
                    document.getElementById("overlay").append(div);
                }

                // display them
                if(document.getElementById("overlay") && document.getElementById("delete_message")) {
                    document.getElementById("delete_message").innerHTML = "<i class='fas fa-check text-success me-2'></i>" + RESOURCE.charAt(0).toUpperCase() + RESOURCE.slice(1) + " deleted";

                    let overlay = document.getElementById("overlay");
                    if(overlay.classList.contains("d-none"))  overlay.classList.remove("d-none");
                    overlay.classList.add("d-block");
                }

                // remove overlay with message after 1.5 seconds and display all resources
                setTimeout(() => { 
                    let overlay = document.getElementById("overlay");
                    overlay.style.opacity = 0;
                    overlay.style.transition = "opacity 500ms linear";
                    setTimeout(() => { overlay.remove() }, 500);

                    // choose which method display after delete action (get_all() or get_user_tasks()...)
                    if(btn_event.target.closest("#user_tasks") && btn_event.target.closest("table")) {
                        // if btn_event is in #user_tasks : remove row deleted
                        if(btn_event.target.closest("table").rows.length <= 1) {
                            btn_event.target.closest("#user_tasks").innerHTML = "<div class='text-center my-5 fs-5'>No task associated with this user</div>";
                        }
                        else 
                            btn_event.target.closest("tr").remove();
                    }
                    // else get_all()
                    else {
                        // display all by keeping the current_page if pagination
                        let current_page =  typeof enable_pagination === "undefined" || enable_pagination == false ? 0 : 
                                            btn_event.target.closest(".pagination_container") ? btn_event.target.closest(".pagination_container").querySelector(".pagination .active button").value : 1;
                        get_all(RESOURCES, Number(current_page));
                    }
                }, 1500);
            }
            
            // if server has received the request made by the client & a response is ready to be sent (message)
            else if(http_request.readyState == 4 && http_request.status == 200) {

                // parse() method to convert JSON string to JSON object
                const _JSON = JSON.parse(http_request.responseText);
    
                // if message
                if(_JSON.message) {
                    alert(_JSON.message);
                }
    
                // clear data
                clear_data(_JSON);
            }

            // else if server returns status 404 or 405 (not allowed)
            else if(http_request.readyState == 4 && (http_request.status == 404 || http_request.status == 405)) {
                // set alert()
                error_response(http_request);
            }
        }
    }
}
