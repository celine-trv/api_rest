
// POST a new resource for each .btn_submit_add clicked

// as .btn_submit_add is not initially in the DOM, need to create an observer with the callback function addListener()
// -> main.js



// FUNCTION post
const post = (btn_event) => {
    const RESOURCES = btn_event.target.closest("[data-resources]").dataset.resources;

    form_submit(btn_event, "post", RESOURCES);
}
