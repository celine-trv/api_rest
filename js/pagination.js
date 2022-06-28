
// PAGINATION (option) : divide all results to display into several pages (to enable/disable it just change the boolean value of the var 'enable_pagination' below and be sure to add this script file before the others)

// as btns in nav_pagination are not initially in the DOM, need to create an observer with the callback function addListener()
// -> main.js
let enable_pagination = true;


// FUNCTION paginate
const paginate = (array, current_page, per_page = 6) => {
	const total_pages = Math.ceil(array.length / per_page);
    const page = current_page > total_pages ? total_pages : current_page;
	const offset = per_page * (page - 1);
	const paginated_items = array.slice(offset, per_page * page);

	return {
        current_page: page,
		prev_page: page - 1 ? page - 1 : null,
		next_page: (total_pages > page) ? page + 1 : null,
		total: array.length,
		total_pages: total_pages,
		data: paginated_items,
	}
}


// FUNCTION add_nav_pagination
const add_nav_pagination = (pagination_config) => {
    let html = "";

    if(pagination_config.total_pages > 1) {
        let page = pagination_config.current_page;
        let window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        let amplitude = 2;          // define number of button(s) displayed before and after the active one

        // nav
        html += "<nav aria-label='pages navigation'>";
        html +=    "<ul class='pagination justify-content-center" + (window_width <= 430 ? " pagination-sm" : "") + "'>";
        html +=        "<li class='page-item" + (page === 1 ? " disabled" : "") + "'>";
        html +=            "<button type='button' class='page-link' id='first_page' " + (page === 1 ? "tabindex='-1' aria-disabled='true'" : "") + "aria-label='First'>";
        html +=                "<span aria-hidden='true'>&laquo;</span>";
        html +=            "</button>";
        html +=        "</li>";

        // add ellipsis points (...) if there is another page before the number displayed
        if(page > (1 + amplitude)) {
            html +=    "<li class='page-item disabled'>";
            html +=        "<span class='page-link'>...</span>";
            html +=    "</li>";
        }

        for(let i = 1; i <= pagination_config.total_pages; i++) {
            if((i >= page - amplitude) && (i <= page + amplitude)) {
                html += "<li class='page-item"+ (i === page ? " active opacity-75' aria-current='page" : "") +"'>";
                html +=    "<button type='button' class='page-link nth_page' value='"+ i +"'>"+ i +"</button>";
                html += "</li>";
            }
        }

        // add ellipsis points (...) if there is another page after the number displayed
        if(page < (pagination_config.total_pages - amplitude)) {
            html +=    "<li class='page-item disabled'>";
            html +=        "<span class='page-link'>...</span>";
            html +=    "</li>";
        }

        html +=        "<li class='page-item" + (page === pagination_config.total_pages ? " disabled" : "") + "'>";
        html +=            "<button type='button' class='page-link' id='last_page' data-last_page='" + pagination_config.total_pages + "'" + (page === pagination_config.total_pages ? " tabindex='-1' aria-disabled='true'" : "") + " aria-label='Last'>";
        html +=                "<span aria-hidden='true'>&raquo;</span>";
        html +=            "</button>";
        html +=        "</li>";
        html +=    "</ul>";
        html += "</nav>";
    }
    return html;
}


// FUNCTION first_page
const first_page = (btn_event) => {
    const RESOURCES = btn_event.target.closest(".pagination_container").querySelector("[data-resources]").dataset.resources || btn_event.target.closest("[data-resources]").dataset.resources;
    let first_page = 1;

    get_all(RESOURCES, first_page);
}


// FUNCTION nth_page
const nth_page = (btn_event) => {
    const RESOURCES = btn_event.target.closest(".pagination_container").querySelector("[data-resources]").dataset.resources || btn_event.target.closest("[data-resources]").dataset.resources;
    let nth_page = Number(btn_event.target.value);
    nth_page = nth_page != 0 && Number.isInteger(nth_page) && parseFloat(nth_page) == parseInt(nth_page) ? parseInt(nth_page) : 0;

    get_all(RESOURCES, nth_page);
}


// FUNCTION last_page
const last_page = (btn_event) => {
    const RESOURCES = btn_event.target.closest(".pagination_container").querySelector("[data-resources]").dataset.resources || btn_event.target.closest("[data-resources]").dataset.resources;
    let last_page = Number(btn_event.target.dataset.last_page) || Number(btn_event.target.parentNode.dataset.last_page);
    last_page = last_page != 0 && Number.isInteger(last_page) && parseFloat(last_page) == parseInt(last_page) ? parseInt(last_page) : 0;

    get_all(RESOURCES, last_page);
}


// nav size according to screen size
window.addEventListener("resize", () => {
    let window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if(window_width <= 430) {
        document.querySelectorAll(".pagination").forEach(el => {
            el.classList.add("pagination-sm");
        })
    }
    else {
        document.querySelectorAll(".pagination").forEach(el => {
            el.classList.remove("pagination-sm");
        })
    }
})
