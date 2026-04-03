// ── 1. Category → CSS class mapping ──
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

// ── 2. Format date ──
function formatDate(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── 3. Truncate text ──
function truncate(text, max = 100) {
    if (!text) return "";
    return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

// ── 4. Navigate to single blog page ──
function goToBlog(index) {
    window.location.href = `../singleblogPage/singleBlog.html?id=${index}`;
}

// ── 5. Build a single story card ──
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

// ── 8. All blogs from localStorage (shared state without any filter) ──
let allBlogs = [];

// ── 9. Apply all active filters + sort, then render ──
function applyFiltersAndRender() { // central function 


    //     Order of operations inside applyFiltersAndRender
    // allBlogs (full array)
    //   → filter by category   (if not "all")
    //   → filter by search text (if input is not empty)
    //   → sort by date
    //   → render to #storiesGrid  (or show empty state)
    const grid = document.getElementById("storiesGrid");
    const empty = document.getElementById("allBlogsEmpty");


    const searchText = document.getElementById("searchInput").value.trim().toLowerCase();
    const activePill = document.querySelector(".filterPill.active");
    const activeCategory = activePill ? activePill.dataset.cat : "all";
    const sortOrder = document.getElementById("sortSelect").value;

    // pair each blog with its real localStorage index before any filtering
    let results = allBlogs.map((blog, index) => ({ blog, index }));

    // filter by category pill
    if (activeCategory !== "all") { // changed the cat -> not ALL 
        results = results.filter(({ blog }) =>
            (blog.category || "").toLowerCase() === activeCategory //keeps only exact category matches.
        );
    }

    // filter by search text (title or content)
    //Keeps only blogs where the title or content contains the typed text (case-insensitive).
    if (searchText) {
        results = results.filter(({ blog }) =>
            (blog.title || "").toLowerCase().includes(searchText) ||
            (blog.content || "").toLowerCase().includes(searchText)
        );
    }

    // sort by date
    results.sort((a, b) => {
        const dateA = new Date(a.blog.createdAt || 0);
        const dateB = new Date(b.blog.createdAt || 0);
        return sortOrder === "oldest" ? dateA - dateB : dateB - dateA;
    });

    if (!results.length) {
        grid.style.display = "none";
        empty.style.display = "flex";
        return;
    }

    grid.style.display = "grid";
    empty.style.display = "none";
    grid.innerHTML = "";
    results.forEach(({ blog, index }) => {
        grid.innerHTML += buildStoryCard(blog, index);
    });
}

// ── 10. Init ──
window.addEventListener("load", function () {
    document.getElementById("footerYear").textContent = new Date().getFullYear();

    // load only approved blogs from localStorage
    try {
        const raw = localStorage.getItem("blogs");
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) allBlogs = parsed.filter(b => b.isApproved === true);
        }
    } catch (e) {
        console.error("Error reading blogs:", e);
    }

    const searchInput = document.getElementById("searchInput"); // the user search input value 
    const searchClearBtn = document.getElementById("searchClearBtn"); // the x that appears when the user write anything
    const sortSelect = document.getElementById("sortSelect"); // the newest / earliest value 
    const filterPills = document.querySelectorAll(".filterPill"); // the selected category

    // Run this function every time the user types something in the input  (lisinter aka watcher in the search input) 
    searchInput.addEventListener("input", function () {
        searchClearBtn.style.display = this.value ? "flex" : "none"; // the input has text → show button / empty → hide button
        applyFiltersAndRender(); // call the fucntion above 
    });

    // clear button — resets search and re-renders
    searchClearBtn.addEventListener("click", function () {
        searchInput.value = "";
        this.style.display = "none";
        searchInput.focus();
        applyFiltersAndRender();
    });

    // sort select — re-render on change
    sortSelect.addEventListener("change", applyFiltersAndRender); // this listen on the oldest / newest filter 

    // category pills — toggle active and re-render
    filterPills.forEach(function (pill) { // loop on all pills
        pill.addEventListener("click", function () { //When ANY pill is clicked → this function runs
            filterPills.forEach(p => p.classList.remove("active")); //Remove "active" from all pills
            this.classList.add("active"); // add active on the pill selected 
            applyFiltersAndRender(); // call the above function
        });
    });

    // initial render
    applyFiltersAndRender();
});
