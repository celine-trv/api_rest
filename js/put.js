
// PUT (update) an existing resource for each .btn_edit clicked

// as .btn_edit is not initially in the DOM, need to create an observer with the callback function addListener()
// -> main.js



// FUNCTION put
const put = (btn_event) => {
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
            const JSON_GET = JSON.parse(http_request.responseText);

            // reuse form_modal to edit resources
            form_content("edit", RESOURCES, JSON_GET);

            // when modal will close put form_content back for add_action ("hidden.bs.modal" event)
            document.getElementById("modal_form").addEventListener("hidden.bs.modal", () => { 
                form_content("add", RESOURCES, JSON_GET);
    
                // clear data
                clear_data(JSON_GET);
            })

            // add json values to edit to the form
            for(let form_element of document.getElementById("form_modal").querySelectorAll("[name]:not(meta)")) {
                // name attribute of form elements are json keys (properties)
                let name = form_element.getAttribute("name");
                form_element.value = JSON_GET[name];
            }

            // submit form event (PUT request)
            document.querySelector(".btn_submit_edit").addEventListener("click", (btn_submit) => {
                form_submit(btn_submit, "put", RESOURCES, JSON_GET.id);
            })
        }

        // else if server returns status 404
        else if(http_request.readyState == 4 && http_request.status == 404) {
            // set alert()
            error_response(http_request);
        }
    }
}
