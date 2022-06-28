
// FORM_CONTENT defines form elements
// used to add or update a new resource (POST & PUT)




// FUNCTION form_content
const form_content = (action, resources, json) => {
    const RESOURCE = resources.slice(0, -1);
    let form = "";

    // set title according to action
    document.getElementById("modal_form").querySelector("#modal_form-title").innerHTML = action == "edit" ? "Edit " + RESOURCE : "Add a new " + RESOURCE;

    for(let value of Array.isArray(json) ? Object.keys(json[0]) : Object.keys(json)) {
        // nothing for values define in db and for message or url properties returned
        if(value != "id" && value != "creation_date" && value != "status" && value != "message" && value.search("url") == -1) {
            form += "<div class='mb-3'>";
            form +=     "<label for='"+ value +"' class='form-label'>";
            form +=         value.charAt(0).toUpperCase() + value.slice(1) + (value != "description" ? "<small class='text-danger'> *</small>" : "");
            form +=     "</label>";

            // if "description" : <textarea>
            if(value == "description") {
                form += "<textarea rows='4' name='"+ value +"' id='"+ value +"' class='form-control' placeholder='(optional)' aria-label='"+ value.charAt(0).toUpperCase() + value.slice(1) +"'></textarea>";
            }
            // else : input
            else {
                form += "<input type='";
                form += value == "email" ? "email" : "text" ;
                form += "' name='"+ value +"' id='"+ value +"' class='form-control' placeholder='"+ value +"' aria-label='"+ value.charAt(0).toUpperCase() + value.slice(1) +"'>";
            }
            form += "</div>";
        }
        // for status, add <select> just if action == "edit"
        else if(value == "status" && action == "edit") {
            form += "<div class='mb-3'>";
            form +=     "<label for='"+ value +"' class='form-label'>";
            form +=         value.charAt(0).toUpperCase() + value.slice(1) + (value != "description" ? "<small class='text-danger'> *</small>" : "");
            form +=     "</label>";
            
            form +=     "<select name='"+ value +"' id='"+ value +"' class='form-select' aria-label='"+ value.charAt(0).toUpperCase() + value.slice(1) +"'>";
            form +=         "<option class='text-danger' value='0'>Waiting...</option>";
            form +=         "<option class='text-success' value='1'>Done !</option>";
            form +=         "<option class='text-warning' value='2'>In progress...</option>";
            form +=     "</select>";
            form += "</div>";
        }
    }
    // form += "<div class='text-end'><small class='fst-italic'><span class='text-danger'>*</span> required</small></div>"
    form += "<button type='submit' class='btn_submit btn_submit_"+ action +" border border-primary rounded p-2 mt-3 d-block mx-auto bg-primary bg-opacity-50 text-reset' data-resources='"+ resources +"'>";
    form +=     action.charAt(0).toUpperCase() + action.slice(1) + " " + RESOURCE;
    form += "</button>";

    // innerHTML
    document.getElementById("form_modal").innerHTML = form;
 
    // add .autocomplete class in order to have autofill for user_id input : as the input is not initially in the DOM, need to create an observer with the callback function addListener()
    // -> main.js
    if(document.getElementById("user_id")) {
        // need to have resource name to add autocomplete, so set it in a dataset
        let input = document.getElementById("user_id");
        input.dataset.autocomplete_resources = "users";

        if(input.dataset.autocomplete_resources) {
            input.classList.add("autocomplete");
            input.setAttribute("placeholder", "write user name to get id");

            // add precision for label
            let small = document.createElement("small");
            small.classList.add("fst-italic");
            small.innerHTML = " (or write the name)";
            input.parentNode.querySelector("[for='user_id']").append(small);
        }
    }
}



// FUNCTION autocomplete (datalist)
const autocomplete = (input_event) => {
    let input = input_event.target;
    let autocomplete_resources = input.dataset.autocomplete_resources;
    let id_datalist = autocomplete_resources + "_list";

    // if <datalist> doesn't yet exist
    if(!document.getElementById(id_datalist)) {
        // create a div parent element for input + datalist
        let div = document.createElement("div");
        input.parentNode.insertBefore(div, input);
        div.appendChild(input);
        input.focus();

        // create <datalist>
        let create_datalist = document.createElement("datalist");
        create_datalist.id = id_datalist;
        input.after(create_datalist);
    }
    let datalist = document.getElementById(id_datalist);
    
    // clear any previously loaded options in the datalist
    datalist.innerHTML = "";
    input.classList.remove("border", "border-danger");

    // add input attributes
    input.setAttribute("list", id_datalist);
    input.setAttribute("autocomplete", "off");

    // request from 2 characters min or 1 if it's an integer (id)
    if(input.value.length >= 2 || input.value.length == 1 && !isNaN(input.value)) { 
        // Http Request
        let http_request = new XMLHttpRequest();
        
        http_request.open("GET", url_base() + "/" + autocomplete_resources +"?search=" + input.value, true);
        http_request.send();
        
        http_request.onreadystatechange = () => {
            // if server has received the request made by the client & a response is ready to be sent
            if(http_request.readyState == 4 && http_request.status == 200) {

                // parse() method to convert JSON string to JSON object
                const _JSON = JSON.parse(http_request.responseText);

                // if json is an array
                if(Array.isArray(_JSON)) {
                    //  for each searched resources of json
                    for(let val of _JSON) {
                        // create a new <option> element
                        let option = document.createElement("option");
                        option.value = val.id;
                        option.label = val.name;

                        // add the option to <datalist> (10 max)
                        if(datalist.childElementCount <= 10)
                            datalist.append(option);
                    }
                }

                // border color if json is empty (no matching value)
                _JSON.length > 0 ? input.classList.remove("border", "border-danger") : input.classList.add("border", "border-danger");
                

            // UX : with <datalist>, input value = option:selected value (no text or label taken into account) so displaying the name when focus
                // recovering matching object in a const
                const MATCHING_OBJ = Array.isArray(_JSON) && _JSON.length === 1 ? _JSON[0] : null;

                if(MATCHING_OBJ) {
                    // put value of object in input & make the field readonly to preserve the value
                    input.value = MATCHING_OBJ.name;
                    input.setAttribute("readonly", "on");
                    if(document.activeElement == input) document.activeElement.blur(); 
                    
                    // possibility to reactivate it if clicked
                    if(input.getAttribute("readonly") == "on") {
                        input.style.background = "initial";
                        if(input.classList.contains("border-danger")) input.classList.remove("border-danger");
                        input.classList.add("border", "border-success");

                        // add btn_close which will clear value and reactivate input
                        if(!document.getElementById("btn_close_" + input.id)) {
                            let btn = document.createElement("button");
                            btn.id = "btn_close_" + input.id;
                            btn.classList.add("btn-close", "py-2");
                            btn.setAttribute("type", "button");
                            btn.setAttribute("aria-label", "Close");
                            input.after(btn);

                            // btn_close position
                            input.parentElement.style.position = "relative";
                            btn.style.position = "absolute";
                            btn.style.right = window.getComputedStyle(input, null).getPropertyValue("padding-right");
                            btn.style.top = (input.offsetHeight / 2) + "px";
                            btn.style.transform = "translateY(-50%)";
                        }

                        // when btn_close clicked : clear value and reactivate input
                        if(document.getElementById("btn_close_" + input.id)) {
                            document.getElementById("btn_close_" + input.id).addEventListener("click", () => { 
                                input.removeAttribute("readonly"); 
                                input.classList.remove("border", "border-success");
                                datalist.innerHTML = "";
                                input.value = "";
                                document.getElementById("btn_close_" + input.id).remove();
                                input.focus();
                                return;
                            });
                        }
                    }
                    
                    // when form is submitted : change input value by id
                    // note that there is an error if click or submit event is used because it is executed after post() function which is executed when click event on the same btn_submit
                    // even if function is called before in main.js or if this file is before post.js in script tag
                    // so have to use mousedown event in order to have the good expected value (int id) and execute this imperatively before click and post() function
                    input.closest("form").querySelector(".btn_submit").addEventListener("mousedown", () => {
                        if(input.value == MATCHING_OBJ.name) {
                            input.value = MATCHING_OBJ.id;
                        }

                        // clear data
                        clear_data(MATCHING_OBJ);
                    });
                }

                // clear data
                clear_data(_JSON);
            }
        }
    }
}
