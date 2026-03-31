// ── 1. Load saved profile picture from localStorage ──
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

function getCatClass(category) {
    return CATEGORY_CLASS[(category || "").toLowerCase()] || "cat-default";
}

// ── 3. Format date ──
function formatDate(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── 4. Truncate text ──
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

    if (!grid || !empty) return;

    if (!blogs.length) {
        grid.style.display  = "none";
        empty.style.display = "flex";
        return;
    }

    grid.style.display  = "grid";
    empty.style.display = "none";

    // Newest first
    const reversed = [...blogs].reverse();

    grid.innerHTML = reversed.map((blog, i) => {
        const realIndex = blogs.length - 1 - i;
        return buildStoryCard(blog, realIndex);
    }).join("");
}

// ── 8. Init — Back to simple LocalStorage ──
window.addEventListener("load", function() {
    let allBlogsFromStorage = [];

    try {
        // 1. Pull the data
        const raw = localStorage.getItem("blogs");
        
        // 2. Parse the data
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                allBlogsFromStorage = parsed;
            }
        }
    } catch (e) {
        console.error("Error reading blogs:", e);
    }

    // 3. REMOVED FILTER: We are now passing the full array directly
    // This ensures all your existing blogs show up regardless of "approval" status.
    renderAllBlogs(allBlogsFromStorage);

    // 4. Footer
    const footerYear = document.getElementById("footerYear");
    if (footerYear) footerYear.textContent = new Date().getFullYear();
});

/*
// --- VERSION B: API FETCHING (COMMENTED OUT) ---
async function getDataFromAPI() {
    let apiBlogs = [];
    const url = "https://newsapi.org/v2/everything?q=tesla&from=2026-02-28&sortBy=publishedAt&apiKey=c0d2e8bf7d604a3bab0df21bf95e5269";
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        apiBlogs = data.articles.map(item => ({
            title: item.title || "no title",
            content: item.content || item.description || "no description",
            image: item.urlToImage,
            createdAt: item.publishedAt,
            category: detectCategory(item.title + " " + item.description),
            isApproved: true
        }));
        renderAllBlogs(apiBlogs);
    } catch (e) {
        console.log("ERROR FETCHING BLOGS", e);
    }
}
*/