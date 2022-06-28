
// BASE URL without a possible "/" at the end
const url_base = () => {
    return document.location.href.replace(/\/$/, "")
};


// MUTATION OBSERVER
// as buttons are not initially in the DOM, need to create an observer with this callback function to add event listener
const addListener = (mutations) => {
    // get each mutation when DOM changes occur
    mutations.forEach(mutation => {
        // for each node added
        mutation.addedNodes.forEach(node => {
            
            // for each .btn_get_one : add event listener
            if(node.classList.contains("btn_get_one")) {
                node.addEventListener("click", (btn_event) => get_one(btn_event));
            }
            else {
                node.querySelectorAll(".btn_get_one").forEach(btn_get_one => {
                    btn_get_one.addEventListener("click", (btn_event) => get_one(btn_event));
                });
            }
            
            // for each .btn_edit : add event listener
            if(node.classList.contains("btn_edit")) {
                node.addEventListener("click", (btn_event) => put(btn_event));
            }
            else {
                node.querySelectorAll(".btn_edit").forEach(btn_edit => {
                    btn_edit.addEventListener("click", (btn_event) => put(btn_event));
                });
            }
            
            // for each .btn_delete : add event listener
            if(node.classList.contains("btn_delete")) {
                node.addEventListener("click", (btn_event) => delete_one(btn_event));
            }
            else {
                node.querySelectorAll(".btn_delete").forEach(btn_delete => {
                    btn_delete.addEventListener("click", (btn_event) => delete_one(btn_event));
                });
            }
            
            // for each .btn_submit_add : add event listener
            if(node.classList.contains("btn_submit_add")) {
                node.addEventListener("click", (btn_event) => post(btn_event));
            }
            else {
                node.querySelectorAll(".btn_submit_add").forEach(btn_submit_add => {
                    btn_submit_add.addEventListener("click", (btn_event) => post(btn_event));
                });
            }

            // for each .btn_user_tasks : add event listener
            if(node.classList.contains("btn_user_tasks")) {
                node.addEventListener("click", (btn_event) => get_user_tasks(btn_event));
            }
            else {
                node.querySelectorAll(".btn_user_tasks").forEach(btn_user_tasks => {
                    btn_user_tasks.addEventListener("click", (btn_event) => get_user_tasks(btn_event));
                });
            }

            // for each .autocomplete : add event listener
            if(node.classList.contains("autocomplete")) {
                node.addEventListener("input", (input_event) => autocomplete(input_event));
            }
            else {
                node.querySelectorAll(".autocomplete").forEach(autocomplete_input => {
                    autocomplete_input.addEventListener("input", (input_event) => autocomplete(input_event));
                });
            }

            // for each btn nav_pagination : add event listener
            // go to first_page
            if(node.id == "first_page") {
                node.addEventListener("click", (btn_event) => first_page(btn_event));
            }
            else if(node.querySelector("#first_page")) {
                node.querySelector("#first_page").addEventListener("click", (btn_event) => first_page(btn_event));
            }
            // go to last_page
            if(node.id == "last_page") {
                node.addEventListener("click", (btn_event) => last_page(btn_event));
            }
            else if(node.querySelector("#last_page")) {
                node.querySelector("#last_page").addEventListener("click", (btn_event) => last_page(btn_event));
            }
            // go to nth_page
            if(node.classList.contains("nth_page")) {
                node.addEventListener("click", (btn_event) => nth_page(btn_event));
            }
            else {
                node.querySelectorAll(".nth_page").forEach(btn_nth_page => {
                    btn_nth_page.addEventListener("click", (btn_event) => nth_page(btn_event));
                });
            }
        });
    });
}

// new MutationObserver object
let mutationObserver = new MutationObserver(addListener);

// Start observing changes in a root DOM element (#result & #form_modal) for configured mutations
mutationObserver.observe(document.getElementById("result"), { childList: true });
mutationObserver.observe(document.getElementById("form_modal"), { childList: true });
// mutationObserver.observe(document.getElementById("form_modal"), {
//     attributes: true,
//     characterData: true,
//     childList: true,
//     subtree: true,
//     attributeOldValue: true,
//     characterDataOldValue: true
// });

// Later, you can stop observing
// mutationObserver.disconnect();



// CLEAR DATA
const clear_data = (obj) => {
    // action according to the type of obj
    if(Array.isArray(obj)) {
        obj.length = 0;
        obj = undefined;
    }
    else if(typeof obj == "object") {
        for(let key in obj) {
            delete obj[key];
        }
        obj = undefined;
    }
    else {
        obj = undefined;
    }
}


// ERROR RESPONSE (ex: 404 or 405) : set alert()
const error_response = (http_request) => {

    // check if the response header contents json
    if(http_request.getResponseHeader("Content-Type") == "application/json") {
    
        const _JSON = JSON.parse(http_request.responseText);

        if(_JSON.message) {
            alert(_JSON.message);
        }
        else 
            alert("Not found ! Try again");
    
        // clear data
        clear_data(_JSON);
    }
    // or if the response is text
    else {
        // remove possible html tags
        let response = http_request.responseText.replace(/<[^\/>]*>/g, "");
        response = response.replace(/<\/[^>]*>/g, "\n");
        alert(response);
    
        // clear data
        clear_data(response);
    }
}


// SCROLL TO THE TOP
const scroll_top = () => {
    // create button
    if(!document.getElementById("scroll_top")) {
        let btn = document.createElement("button");
        btn.id = "scroll_top";
        btn.classList.add("fas", "fa-arrow-up", "position-fixed", "bottom-0", "end-0", "border", "border-primary", "rounded", "p-2", "bg-primary", "bg-opacity-50", "text-reset", "m-3", "m-md-5");
        btn.style.width = "40px";
        btn.style.height = "40px";
        document.querySelector(".container").append(btn);
    }
    let btn_scroll_top = document.getElementById("scroll_top");

    // hide button if position of scrollY < height of window & scroll event
    btn_scroll_top.hidden = (window.scrollY < (window.innerHeight || document.documentElement.clientHeight));
    window.addEventListener("scroll", () => {
        btn_scroll_top.hidden = (window.scrollY < (window.innerHeight || document.documentElement.clientHeight));
    })

    // opacity adjustment depending on window size (overlay) and mouseover / mouseout
    let window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let btn_opacity = window_width < 768 ? 0.3 : 1;
    btn_scroll_top.style.opacity = btn_opacity;

    window.addEventListener("resize", () => {
        window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        btn_opacity = window_width < 768 ? 0.3 : 1;
        btn_scroll_top.style.opacity = btn_opacity;
    })

    btn_scroll_top.addEventListener("mouseover", (btn) => {
        btn.target.style.opacity = 1;
    })
    btn_scroll_top.addEventListener("mouseout", (btn) => {
        btn.target.style.opacity = btn_opacity;
    })

    // scrollTo the top when button clicked
    btn_scroll_top.addEventListener("click", (btn) => {
        window.scrollTo(0, 0);
        btn.target.style.opacity = btn_opacity;
    })
}
scroll_top();
