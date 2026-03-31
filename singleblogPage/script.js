// ── 1. Load saved profile picture ──
const savedPfp = localStorage.getItem("userPFP");
if (savedPfp && document.getElementById("navbarPfp")) {
    document.getElementById("navbarPfp").src = savedPfp;
}

// ── 2. Helpers (Category, Date, Truncate) ──
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
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── 3. Get ?id from URL ──
function getBlogIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    // Return the id as a number if it exists, otherwise null
    return id !== null ? parseInt(id, 10) : null;
}

// ── 4. Split content into paragraphs ──
function buildParagraphs(content) {
    if (!content) return "<p>No content available.</p>";
    let chunks = content.split(/\n{2,}/); 
    if (chunks.length === 1) chunks = content.split(/\n/);
    
    // Auto-split long blocks logic
    if (chunks.length === 1 && content.length > 600) {
        chunks = [];
        let remaining = content;
        while (remaining.length > 300) {
            const cutIdx = remaining.search(/(?<=[.!?])\s+(?=[A-Z])/s);
            if (cutIdx > 0 && cutIdx < 600) {
                chunks.push(remaining.slice(0, cutIdx).trim());
                remaining = remaining.slice(cutIdx).trim();
            } else break;
        }
        if (remaining) chunks.push(remaining.trim());
    }

    return chunks.map(c => `<p>${c.trim()}</p>`).filter(Boolean).join("");
}

// ── 5. Render the blog ──
function renderBlog(blog) {
    const article  = document.getElementById("singleBlogArticle");
    const notFound = document.getElementById("notFound");

    if (!article || !notFound) return;

    article.style.display  = "";
    notFound.style.display = "none";
    document.title = `${blog.title} — Briefly`;

    // Hero image
    const heroEl = document.getElementById("singleHeroImg");
    heroEl.innerHTML = blog.image 
        ? `<img src="${blog.image}" alt="${blog.title}" onerror="this.outerHTML='<div class=\\'singleHeroPlaceholder\\'>📄</div>'">`
        : `<div class="singleHeroPlaceholder">📄</div>`;

    // Content Text
    document.getElementById("singleTitle").textContent = blog.title || "Untitled";
    const catClass = getCatClass(blog.category);
    const catEl = document.getElementById("singleCategory");
    catEl.textContent = blog.category || "General";
    catEl.className   = `singleCategoryPill ${catClass}`;

    document.getElementById("singleDate").textContent = blog.createdAt ? `Published on ${formatDate(blog.createdAt)}` : "";
    document.getElementById("singleContent").innerHTML = buildParagraphs(blog.content);

    // Tags logic
    const tagsEl = document.getElementById("singleTags");
    const tagList = blog.category ? [blog.category] : [];
    if (Array.isArray(blog.tags)) {
        blog.tags.forEach(t => { if (t && !tagList.includes(t)) tagList.push(t); });
    }
    tagsEl.innerHTML = tagList.map(t => `<span class="singleTag">${t}</span>`).join("");
}

function showNotFound() {
    const article = document.getElementById("singleBlogArticle");
    const notFound = document.getElementById("notFound");
    if (article) article.style.display = "none";
    if (notFound) notFound.style.display = "flex";
}

// ── 6. INITIALIZATION (Working version) ──
window.addEventListener("load", function () {
    const id = getBlogIdFromURL();
    
    // Safety check for ID
    if (id === null || isNaN(id)) {
        showNotFound();
        return;
    }

    let blogs = [];
    
    // --- VERSION A: LOCAL STORAGE (ACTIVE) ---
    try {
        const raw = localStorage.getItem("blogs");
        const parsed = JSON.parse(raw);
        if (raw && Array.isArray(parsed)) {
            blogs = parsed;
        }
    } catch (e) {
        console.error("Error reading blogs from localStorage:", e);
    }

    // Attempt to find the blog by the index provided in the URL
    const blog = blogs[id];

    if (blog) {
        renderBlog(blog);
    } else {
        showNotFound();
    }

    // Update Footer Year
    const footerYear = document.getElementById("footerYear");
    if (footerYear) footerYear.textContent = new Date().getFullYear();
});

/*
// --- VERSION B: API FETCHING (COMMENTED OUT) ---
async function fetchSingleFromAPI() {
    const id = getBlogIdFromURL();
    const url = "https://newsapi.org/v2/everything?q=tesla&apiKey=c0d2e8bf7d604a3bab0df21bf95e5269";
    try {
        const response = await fetch(url);
        const data = await response.json();
        const apiBlogs = data.articles.map(item => ({
            title: item.title,
            content: item.description,
            image: item.urlToImage,
            createdAt: item.publishedAt,
            category: "Technology"
        }));
        if (apiBlogs[id]) {
            renderBlog(apiBlogs[id]);
        } else {
            showNotFound();
        }
    } catch (e) {
        console.error("API Error", e);
        showNotFound();
    }
}
*/