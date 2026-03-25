// ── 1. Load saved profile picture from localStorage - same code as before i didnt change anything (copy-paste)
const savedPfp = localStorage.getItem("userPFP");
if (savedPfp) {
    document.getElementById("navbarPfp").src = savedPfp;
}



//Summary of the Flow
// Wait for the page to load.
// Look in the browser's storage for blog data.
// Convert that data from a string into a usable list.
// Send that list to the rendering functions to display them on the screen.



// how it works : 
// takes raw data stored in the browser's memory (localStorage), transforms it into readable text and dates,
// and then "injects" it into the HTML using Template Literals. 



// Before displaying anything, we have "Helper Functions" that clean up the data.

// maps a category name (like "Technology") to a specific CSS class (like cat-technology) -> this will allow me to diasplay each catagory with a different color 
// ── 2. Category → CSS class + color mapping ──
// this is a Mapping Object 
// It links a category name (like "Technology") to a CSS class name you wrote in your .css file
const CATEGORY_CLASS = {
    technology: "cat-technology",
    lifestyle: "cat-lifestyle",
    travel: "cat-travel",
    food: "cat-food",
    business: "cat-business",
    health: "cat-health",
    education: "cat-education",
    entertainment: "cat-entertainment",
    other: "cat-other",
};

//This function takes the text "Technology", makes it lowercase, and looks it up in the object. (the above)  
// If it doesn't find a match, it returns cat-default as a safety net.
function getCatClass(category) {
    return CATEGORY_CLASS[(category || "").toLowerCase()] || "cat-default";
}


// ── 3. Format date → "Mar 18, 2026" -> 
// Instead of showing a messy computer timestamp, it uses toLocaleDateString to turn it into "Mar 18, 2026"
function formatDate(isoString) {
    if (!isoString) return ""; //checks if the input is empty, null, or undefined. If it is, the function stops immediately and returns an empty string
    const d = new Date(isoString); //the code takes your string (the ISO string) and feeds it into JavaScript's built-in Date constructor.
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    // United States English formatting (Month/Day/Year). 
    //month as a three-letter abbreviation
    //day as a number
    //full four-digit year
}

// ── 4. Truncate text to 100 chars -> 
//ensures that  blog cards stay uniform. If a user writes a 1000-word blog, this function cuts it off at 100 characters so it doesn't break the grid layout.
function truncate(text, max = 100) {
    if (!text) return ""; // same saftey check as above 
    return text.length > max ? text.slice(0, max).trimEnd() + "…" : text; // if else 
    // If the text is longer than 100, cut it and add '...'; otherwise, leave it alone
}


// ── 5. Build image HTML for a card ──
function buildImgTag(image, cssClass, height) {
    if (image) { // The Success Path -> image URL is provided, the function returns a standard <img> tag. It dynamically inserts the source, a custom CSS class for styling
        return `<img src="${image}"  class="${cssClass}">`;
    }

    return `<div class="${cssClass}Placeholder">📄</div>`; //The Empty Path
}




// ── 6. Navigate to single blog page ──
function goToBlog(index) {
    window.location.href = `../singleblogPage/singleBlog.html?id=${index}`;
    // the (window.location.href) is like tell the browser, "Stop what you're doing and go to this new URL."
    // The index is a unique number representing a specific blog post.
    //?id= part of the URL is a Query Parameter. It's a way to "carry" data from one page to another without using a database
}

// ── 7. Render LATEST UPDATES (2 tall cards) 
// Builder for your "Latest Updates" section


//"Empty State" Check -> hecks if there are actually any blogs to show.
function renderLatest(blogs) {
    const grid = document.getElementById("latestGrid"); //If not empty: It ensures the grid is visible and the empty message is hidden.
    const empty = document.getElementById("latestEmpty"); // If empty: It hides the grid and shows an "Empty" message (likely a "No posts yet" div

    if (!blogs.length) { // Checks if the blogs array (in the local storage ) is empty. 
        //If empty, it hides the grid and shows the "No blogs" message.
        grid.style.display = "none";
        empty.style.display = "flex";
        return; //stops the function immediately
    }

    //If there are blogs, it makes sure the grid is visible and the empty message is hidden.
    grid.style.display = "";
    empty.style.display = "none";

    // Show 2 most recent blogs 
    //slice(-2) grabs the last two items in the array, and reverse() puts the very last one (the newest) first.
    const latest = blogs.slice(-2).reverse();


    // Building the HTML (The Loop)
    grid.innerHTML = latest.map((blog, i) => { //Starts a "Map." This tells JavaScript to take each of those 2 blogs and "map" them into HTML code. 

        const realIndex = blogs.length - 1 - i; // correct index for navigation
        const catClass = getCatClass(blog.category); //Runs a helper function to get a CSS class based on the category

        // If there is an image URL, create an <img> tag. If not, create a <div> with a document emoji.
        const imgHtml = blog.image
            ? `<img src="${blog.image}" alt="${blog.title}" class="latestCardImg">`
            : `<div class="latestCardImgPlaceholder">📄</div>`;

        // Creates a clickable link (<a>) that triggers the goToBlog function 
        // Injects the image, the category , and the title.
        // Uses truncate to cut the blog text off at 120 characters so the cards stay the same size.
        //The Read Time Logic: It counts the characters in the content, divides by 800 (average reading speed), and rounds up (Math.ceil) to get a "min read" estimate.
        return `
        <a class="latestCard" onclick="goToBlog(${realIndex}); return false;" href="#"> 
            ${imgHtml}
            <div class="latestCardBody"> 
                <span class="latestCardCategory ${catClass}">${blog.category || "General"}</span>
                <h3 class="latestCardTitle">${blog.title}</h3>
                <p class="latestCardExcerpt">${truncate(blog.content, 120)}</p>
                <div class="latestCardMeta">
                    <span>${formatDate(blog.createdAt)}</span>
                    <span>${Math.ceil((blog.content || "").length / 800)} min read</span> 
                </div>
            </div>
        </a>`;
    }).join(""); //.join("") takes the two separate HTML cards and merges them into one long string to be placed on the page.
}




// ── 8. Render BLOG CARDS GRID (4 cards)


//nearly identical to renderLatest,
// but it is specialized for the main content grid. 
// It creates 4 cards instead of 2 and uses a slightly different HTML structure (like putting the category badge inside the image wrapper).
function renderBlogCards(blogs) {
    //Grabbing the UI Elements
    const grid = document.getElementById("blogsGrid");
    const empty = document.getElementById("blogsEmpty");
    const seeAllWrap = document.getElementById("seeAllWrapper");

    if (!blogs.length) {
        //"Safety First" Check
        grid.style.display = "none";
        empty.style.display = "flex";
        seeAllWrap.style.display = "none";
        return;
    }

    //Resetting the Visibility
    grid.style.display = "";
    empty.style.display = "none";
    seeAllWrap.style.display = "flex";

    // Show 4 most recent blogs
    const recent = blogs.slice(-4).reverse();

    grid.innerHTML = recent.map((blog, i) => {
        const realIndex = blogs.length - 1 - i;
        const catClass = getCatClass(blog.category);
        const imgHtml = blog.image
            ? `<img src="${blog.image}" alt="${blog.title}" class="blogCardImg" onerror="this.outerHTML='<div class=\\'blogCardImgPlaceholder\\'>📄</div>'">`
            : `<div class="blogCardImgPlaceholder">📄</div>`;

        return `
        <a class="blogCard" onclick="goToBlog(${realIndex}); return false;" href="#">
            <div class="blogCardImgWrapper">
                ${imgHtml}
                <span class="blogCardCatBadge ${catClass}">${blog.category || "General"}</span>
            </div>
            <div class="blogCardBody">
                <h3 class="blogCardTitle">${blog.title}</h3>
                <p class="blogCardExcerpt">${truncate(blog.content, 100)}</p>
                <span class="blogCardDate">${formatDate(blog.createdAt)}</span>
            </div>
        </a>`;
    }).join("");
}

// ── 9. Init ──
window.addEventListener("load", function () { // The Event Listener - ensures the code waits until everything (images, styles, scripts) is fully loaded before trying to do anything.
    let blogs = []; //Creates an empty "bucket" (array) to hold your blog posts

    try {
        const raw = localStorage.getItem("blogs");
        //Translating the Data (Parsing)
        const parsed = JSON.parse(raw);
        if (raw) {// Checks if anything was actually found in storage.
            if (Array.isArray(parsed)) blogs = parsed; //takes the "string" version of your data and turns it back into a real JavaScript list (Array).
        }
    } catch (e) {
        console.error("Error reading blogs from localStorage:", e);
    }


    // Now that we have our data, we call the two Builder functions 
    renderLatest(blogs);
    renderBlogCards(blogs);
});