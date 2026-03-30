// ── 1. Load saved profile picture ──
const savedPfp = localStorage.getItem("userPFP");
if (savedPfp) {
    document.getElementById("navbarPfp").src = savedPfp;
}

// ── 2. Helpers ──
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

function getCatClass(category) {
    return CATEGORY_CLASS[(category || "").toLowerCase()] || "cat-default";
}

function formatDate(isoString) { 
    // format the date to be Mar 29, 2026 like this format 
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── 3. Get ?id from URL ──
function getBlogIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    return id !== null ? parseInt(id, 10) : null;
}

// ── 4. Split long content into paragraphs ──
// If the user typed newlines we respect them  otherwise we split on sentence endings
function buildParagraphs(content) {
    if (!content) return "<p>No content available.</p>";

    // Split on existing newlines first
    let chunks = content.split(/\n{2,}/);          // double newlines → new paragraph
    if (chunks.length === 1) {
        // No double newlines — try splitting on single newlines
        chunks = content.split(/\n/);
    }
    if (chunks.length === 1 && content.length > 600) {
        // Long single block — auto-split roughly every ~300 chars at sentence boundary
        chunks = [];
        let remaining = content;
        while (remaining.length > 300) {
            // Find next sentence end after 250 chars
            const cutIdx = remaining.search(/(?<=[.!?])\s+(?=[A-Z])/s);
            if (cutIdx > 0 && cutIdx < 600) {
                chunks.push(remaining.slice(0, cutIdx).trim());
                remaining = remaining.slice(cutIdx).trim();
            } else {
                break;
            }
        }
        if (remaining) chunks.push(remaining.trim());
    }

    return chunks
        .map(c => c.trim())
        .filter(Boolean)
        .map(c => `<p>${c}</p>`)
        .join("");
}

// ── 5. Render the blog ──
function renderBlog(blog) {
    const article  = document.getElementById("singleBlogArticle");
    const notFound = document.getElementById("notFound");

    article.style.display  = "";
    notFound.style.display = "none";

    // Update page title
    document.title = `${blog.title} — Briefly`;

    // ── Hero image ──
    const heroEl = document.getElementById("singleHeroImg");
    if (blog.image) {
        heroEl.innerHTML = `<img src="${blog.image}" alt="${blog.title}"
            onerror="this.outerHTML='<div class=\\'singleHeroPlaceholder\\'>📄</div>'">`;
    } else {
        heroEl.innerHTML = `<div class="singleHeroPlaceholder">📄</div>`;
    }

    // ── Title ──
    document.getElementById("singleTitle").textContent = blog.title || "Untitled";

    // ── Category pill ──
    const catEl = document.getElementById("singleCategory");
    const catClass = getCatClass(blog.category);
    catEl.textContent = blog.category || "General";
    catEl.className   = `singleCategoryPill ${catClass}`;

    // ── Date ──
    const dateEl = document.getElementById("singleDate");
    dateEl.textContent = blog.createdAt
        ? `Published on ${formatDate(blog.createdAt)}`
        : "";

    // ── Full content ──
    document.getElementById("singleContent").innerHTML = buildParagraphs(blog.content);

    // ── Bottom tags (category + any extra tags stored on the blog) ──
    const tagsEl = document.getElementById("singleTags");
    const tagList = [];

    // Always add the main category as a tag
    if (blog.category) tagList.push(blog.category);

    // If the blog object has extra tags, add them too
    if (Array.isArray(blog.tags)) {
        blog.tags.forEach(t => {
            if (t && !tagList.includes(t)) tagList.push(t);
        });
    }

    tagsEl.innerHTML = tagList
        .map(t => `<span class="singleTag">${t}</span>`)
        .join("");
}

// ── 6. Show not-found state ──
function showNotFound() {
    document.getElementById("singleBlogArticle").style.display = "none";
    document.getElementById("notFound").style.display = "flex";
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



// ── 7. Init ──
window.addEventListener("load", async function getData() {
    const id = getBlogIdFromURL();

    if (id === null || isNaN(id)) {
        showNotFound();
        return;
    }

     let blogs = []; // same as before -> we declared a empty array to store the blogs in it 
    const url = "https://newsapi.org/v2/everything?q=tesla&from=2026-02-28&sortBy=publishedAt&apiKey=c0d2e8bf7d604a3bab0df21bf95e5269";
    try {
        const response = await this.fetch(url);
        if (!response.ok) {
            throw new Error("Failed ro fetch blogs - error :( ")
        }
        const data = await response.json();
        // this will return an array stored in data variable 
        // the format the data in the API have and my current format is not the same so we have to map it to be the same ; 
        blogs = data.articles.map(item => ({
            // each item in the artical (the data in the API) will be in the below format 
            title: item.title || "no title ",
            content:  item.description || "no description",
            image: item.urlToImage, // the empty case us already handled 
            createdAt: item.publishedAt,
            // the catagory we have to call the above function here 
            category: detectCategory(item.title + "" + item.description),
        })
        );


        console.log(blogs); // this is for just print the result in the console
        // ← NEW: pick the blog by ID
        const blog = blogs.find((b, index) => index === id);
        if (blog) {
            renderBlog(blog);
        } else {
            showNotFound();
        }
    }
    catch (e) {
        console.log("ERROR FETCHING BLOGS", e);
        showNotFound();

    }
    
    document.getElementById("footerYear").textContent = new Date().getFullYear(); // this stays the same -> formation the footer year 

});