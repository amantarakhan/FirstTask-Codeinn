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

// ── 8. Init — wait for the full page to load ──
window.addEventListener("load", function () {
    let allBlogs = [];

    try {
        const raw = localStorage.getItem("blogs");
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) allBlogs = parsed;
        }
    } catch (e) {
        console.error("Error reading blogs from localStorage:", e);
    }

    renderAllBlogs(allBlogs);
});