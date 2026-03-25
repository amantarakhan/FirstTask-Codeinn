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
// If the user typed newlines we respect them; otherwise we split on sentence endings
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

// ── 7. Init ──
window.addEventListener("load", function () {
    const id = getBlogIdFromURL();

    if (id === null || isNaN(id)) {
        showNotFound();
        return;
    }

    let blogs = [];
    try {
        const raw    = localStorage.getItem("blogs");
        const parsed = JSON.parse(raw);
        if (raw && Array.isArray(parsed)) blogs = parsed;
    } catch (e) {
        console.error("Error reading blogs from localStorage:", e);
    }

    const blog = blogs[id];

    if (!blog) {
        showNotFound();
        return;
    }

    renderBlog(blog);
});