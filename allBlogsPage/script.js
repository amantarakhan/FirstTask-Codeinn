// ── 1. Load saved profile picture from localStorage
const savedPfp = localStorage.getItem("userPFP");
if (savedPfp) {
    const navPfp = document.getElementById("navbarPfp");
    if (navPfp) navPfp.src = savedPfp;
}

// ── 2. Category → CSS class mapping ──
const CATEGORY_CLASS = {
    technology:    "cat-technology",
    lifestyle:     "cat-lifestyle",
    travel:        "cat-travel",
    food:          "cat-food",
    business:      "cat-business",
    health:        "cat-health",
    education:     "cat-education",
    entertainment: "cat-entertainment",
    finance:       "cat-finance",
    games:         "cat-games",
    training:      "cat-training",
    other:         "cat-other",
};

// Takes a category string, lowercases it, looks it up in the mapping object.
// Falls back to "cat-default" if not found.
function getCatClass(category) {
    return CATEGORY_CLASS[(category || "").toLowerCase()] || "cat-default";
}

// ── 3. Format date → "Mar 18, 2026" ──
function formatDate(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── 4. Truncate text to max characters ──
function truncate(text, max = 100) {
    if (!text) return "";
    return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

// ── 5. Navigate to single blog page ──
function goToBlog(index) {
    window.location.href = `../singleblogPage/singleBlog.html?id=${index}`;
}

// ── 6. Build a single story card ──
function buildStoryCard(blog, realIndex) {
    const catClass = getCatClass(blog.category);

    // If there is an image URL, create an <img> tag. If not, create a placeholder div.
    const imgHtml = blog.image
        ? `<img src="${blog.image}" alt="${blog.title}" class="storyCardImg"
               onerror="this.outerHTML='<div class=\\'storyCardImgPlaceholder\\'>📄</div>'">`
        : `<div class="storyCardImgPlaceholder">📄</div>`;

    return `
        <a class="storyCard" onclick="goToBlog(${realIndex}); return false;" href="#">
            <div class="storyCardImgWrapper">
                ${imgHtml}
                <span class="storyCardBadge ${catClass}">${blog.category || "General"}</span>
            </div>
            <div class="storyCardBody">
                <p class="storyCardDate">${formatDate(blog.createdAt)}</p>
                <h3 class="storyCardTitle">${blog.title || "Untitled"}</h3>
                <p class="storyCardExcerpt">${truncate(blog.content, 100)}</p>
                <span class="storyCardReadMore">Read Feature →</span>
            </div>
        </a>`;
}

// ── 7. Render all story cards ──
function renderAllBlogs(blogs) {
    const grid  = document.getElementById("storiesGrid");
    const empty = document.getElementById("allBlogsEmpty");

    if (!blogs.length) {
        // Empty state: hide the grid, show the "no blogs" message
        grid.style.display  = "none";
        empty.style.display = "flex";
        return;
    }

    // Has blogs: show the grid, hide the empty message
    grid.style.display  = "grid";
    empty.style.display = "none";

    // Newest first — reverse a copy so the original array stays intact
    const reversed = [...blogs].reverse();

    grid.innerHTML = reversed.map((blog, i) => {
        // Because the array is reversed, the real localStorage index goes backwards
        const realIndex = blogs.length - 1 - i;
        return buildStoryCard(blog, realIndex);
    }).join("");
}


// same function that i use in the home page 
function detectCategory(text) {
    text = text.toLowerCase();

    if (text.includes("tech") || text.includes("ai") || text.includes("software")|| text.includes("dev")|| text.includes("app") || text.includes("digital")|| text.includes("code")|| text.includes("robot") || text.includes("gadget")) return "technology";
    if (text.includes("food") || text.includes("recipe") || text.includes("cook")|| text.includes("chef")|| text.includes("restaurant")|| text.includes("diet")|| text.includes("meal")|| text.includes("bake")|| text.includes("drink")|| text.includes("taste")) return "food";
    if (text.includes("health")|| text.includes("medical")|| text.includes("wellness")|| text.includes("doctor")|| text.includes("mental")|| text.includes("fitness")|| text.includes("yoga")|| text.includes("clinic") || text.includes("symptoms") ) return "health";
    if (text.includes("travel")|| text.includes("trip")|| text.includes("destination")|| text.includes("hotel")|| text.includes("flight")|| text.includes("vecation")|| text.includes("tour")|| text.includes("adventure") || text.includes("map")) return "travel";
    if (text.includes("business") || text.includes("work") || text.includes("startup")|| text.includes("marketing")|| text.includes("strategy")|| text.includes("management")|| text.includes("career")|| text.includes("industry")|| text.includes("CEO")) return "business";
    if (text.includes("home") || text.includes("routine") || text.includes("decor")|| text.includes("productivity")|| text.includes("habits")|| text.includes("family")|| text.includes("minimalism")) return "lifestyle";
    if (text.includes("learn") || text.includes("study")|| text.includes("course")|| text.includes("university")|| text.includes("school")|| text.includes("student")|| text.includes("lesson")) return "education";
    if (text.includes("movie") || text.includes("music")|| text.includes("celebrity")|| text.includes("show")|| text.includes("concert")|| text.includes("film")|| text.includes("theatre")|| text.includes("art")) return "entertainment";
    if (text.includes("money") || text.includes("invest")|| text.includes("stock") || text.includes("crypto")||text.includes("budget") || text.includes("bank")|| text.includes("tax") || text.includes("economy")|| text.includes("profit")) return "finance";
    if (text.includes("gaming") || text.includes("playstation")|| text.includes("xbox")|| text.includes("nintendo")|| text.includes("rpg")|| text.includes("multiplayer")|| text.includes("pc")|| text.includes("player")) return "games";
    if (text.includes("workout") || text.includes("gym")|| text.includes("exercise")|| text.includes("coach") || text.includes("sill")|| text.includes("practice")|| text.includes("tutorial")|| text.includes("workshop")) return "training";
    return "other"; // if it doent match any of the above catagories
}


// ── 8. Init — wait for the full page to load ──

window.addEventListener("load", async function getData() {
    let allblogs = []; // same as before -> we declared a empty array to store the blogs in it 
    const url = "https://newsapi.org/v2/everything?q=tesla&from=2026-02-28&sortBy=publishedAt&apiKey=c0d2e8bf7d604a3bab0df21bf95e5269";
    try {
        const response = await this.fetch(url);
        if (!response.ok) {
            throw new Error("Failed ro fetch blogs - error :( ")
        }
        const data = await response.json();
        // this will return an array stored in data variable 
        // the format the data in the API have and my current format is not the same so we have to map it to be the same ; 
        allblogs = data.articles.map(item => ({
            // each item in the artical (the data in the API) will be in the below format 
            title: item.title || "no title ",
            content: item.content || item.description || "no description",
            image: item.urlToImage, // the empty case us already handled 
            createdAt: item.publishedAt,
            // the catagory we have to call the above function here 
            category: detectCategory(item.title + "" + item.description),
        })
        );
        console.log(allblogs); // this is for just print the result in the console
    }
    catch (e) {
        console.log("ERROR FETCHING BLOGS", e);

    }
    // call the bove functions above functions
    renderAllBlogs(allblogs); 
    document.getElementById("footerYear").textContent = new Date().getFullYear(); // this stays the same -> formation the footer year 

}); 