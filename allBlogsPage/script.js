// ── 1. Load saved profile picture ──
const savedPfp = localStorage.getItem("userPFP");
if (savedPfp) {
    const navPfp = document.getElementById("navbarPfp");
    if (navPfp) navPfp.src = savedPfp;
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

function truncate(text, max = 100) {
    if (!text) return "";
    return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

function goToBlog(index) {
    window.location.href = `../singleblogPage/singleBlog.html?id=${index}`;
}

// ── 3. Build a single story card ──
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

// ── 4. Pagination state ──
const CARDS_PER_PAGE = 6;
let currentPage = 0;
let allBlogs = [];

function totalPages() {
    return Math.max(1, Math.ceil(allBlogs.length / CARDS_PER_PAGE));
}

// ── 5. Render current page ──
function renderPage() {
    const grid         = document.getElementById("storiesGrid");
    const empty        = document.getElementById("allBlogsEmpty");
    const paginationRow = document.getElementById("paginationRow");

    // No blogs at all → show empty state
    if (allBlogs.length === 0) {
        grid.style.display          = "none";
        empty.style.display         = "flex";
        paginationRow.style.display = "none";
        return;
    }

    // Has blogs → show grid, hide empty
    grid.style.display  = "grid";
    empty.style.display = "none";

    // Newest first
    const reversed = [...allBlogs].reverse();

    const start = currentPage * CARDS_PER_PAGE;
    const slice = reversed.slice(start, start + CARDS_PER_PAGE);

    grid.innerHTML = slice.map((blog, i) => {
        // Map back to original array index so goToBlog works correctly
        const reversedIdx = start + i;
        const realIndex   = allBlogs.length - 1 - reversedIdx;
        return buildStoryCard(blog, realIndex);
    }).join("");

    // Pagination
    const pages = totalPages();
    if (pages > 1) {
        paginationRow.style.display = "flex";
        renderPagination(pages);
    } else {
        paginationRow.style.display = "none";
    }
}

// ── 6. Render pagination controls ──
function renderPagination(pages) {
    const prevBtn  = document.getElementById("prevBtn");
    const nextBtn  = document.getElementById("nextBtn");
    const dotsWrap = document.getElementById("pageDots");

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === pages - 1;

    dotsWrap.innerHTML = Array.from({ length: pages }, (_, i) =>
        `<button class="pageDot ${i === currentPage ? "active" : ""}"
                 onclick="goToPage(${i})" aria-label="Page ${i + 1}"></button>`
    ).join("");
}

// ── 7. Page navigation ──
function goToPage(page) {
    currentPage = page;
    renderPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── 8. Init — everything wired up AFTER the DOM is ready ──
window.addEventListener("load", function () {

    // Wire up pagination buttons safely inside load
    document.getElementById("prevBtn").addEventListener("click", () => {
        if (currentPage > 0) goToPage(currentPage - 1);
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        if (currentPage < totalPages() - 1) goToPage(currentPage + 1);
    });

    // Read blogs from localStorage
    try {
        const raw = localStorage.getItem("blogs");
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                allBlogs = parsed;
            }
        }
    } catch (e) {
        console.error("Error reading blogs from localStorage:", e);
    }

    renderPage();
});