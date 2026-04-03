// ── Category → CSS class mapping ──
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

function getCatClass(cat) {
    return CATEGORY_CLASS[(cat || "").toLowerCase()] || "cat-default";
}

function formatDate(isoString) {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function truncate(text, max = 120) {
    if (!text) return "";
    return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

// ── Build one pending blog card ──
function buildPendingCard(blog, realIndex) {
    const catClass = getCatClass(blog.category);
    const imgHtml = blog.image
        ? `<img src="${blog.image}" alt="${blog.title}" class="blogCardImg">`
        : `<div class="blogCardImgPlaceholder">📄</div>`;

    return `
        <div class="blogCard">
            <div class="blogCardImgWrapper">
                ${imgHtml}
            </div>
            <div class="blogCardBody">
                <span class="blogCardCategory ${catClass}">${blog.category || "General"}</span>
                <h3 class="blogCardTitle">${blog.title || "Untitled"}</h3>
                <p class="blogCardExcerpt">${truncate(blog.content)}</p>
                <div class="blogCardFooter">
                    <span><i class="fa-solid fa-user"></i> ${blog.authorEmail || "Unknown"}</span>
                    <span>${formatDate(blog.createdAt)}</span>
                </div>
                <div class="cardActionRow">
                    <button class="approveBtn" onclick="approveBlog(${realIndex})">
                        <i class="fa-solid fa-check"></i> Approve
                    </button>
                    <button class="rejectBtn" onclick="rejectBlog(${realIndex})">
                        <i class="fa-solid fa-xmark"></i> Reject
                    </button>
                </div>
            </div>
        </div>`;
}

// ── Render all pending blogs ──
function renderPendingBlogs() {
    const grid  = document.getElementById("pendingBlogsGrid");
    const empty = document.getElementById("adminEmpty");

    let allBlogs = [];
    try {
        const raw = localStorage.getItem("blogs");
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) allBlogs = parsed;
        }
    } catch (e) {
        console.error("Error reading blogs:", e);
    }

    // pair each blog with its real index before filtering - all the same as its in tha all blogs function only the filter is different
    const pending = allBlogs
        .map((blog, index) => ({ blog, index }))
        .filter(({ blog }) => blog.isApproved === false);

    if (!pending.length) {
        grid.style.display  = "none";
        empty.style.display = "flex";
        return;
    }

    grid.style.display  = "grid";
    empty.style.display = "none";
    grid.innerHTML = "";
    pending.forEach(({ blog, index }) => {
        grid.innerHTML += buildPendingCard(blog, index);
    });
}

// ── Approve: set isApproved = true and re-render ──
function approveBlog(realIndex) {
    let allBlogs = [];
    try {
        const raw = localStorage.getItem("blogs");
        if (raw) allBlogs = JSON.parse(raw);
    } catch (e) {}

    allBlogs[realIndex].isApproved = true;
    localStorage.setItem("blogs", JSON.stringify(allBlogs));

    Swal.fire({
        icon: "success",
        title: "Blog Approved!",
        text: "The blog is now visible to all users.",
        confirmButtonColor: "#C8714A",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
    }).then(() => renderPendingBlogs());
}

// ── Reject: remove the blog entirely and re-render ──
function rejectBlog(realIndex) {
    Swal.fire({
        title: "Reject this blog?",
        text: "It will be permanently deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DC2626",
        cancelButtonColor: "#DDD0C5",
        confirmButtonText: "Yes, reject it",
        cancelButtonText: "Cancel",
    }).then(function (result) {
        if (result.isConfirmed) {
            let allBlogs = [];
            try {
                const raw = localStorage.getItem("blogs");
                if (raw) allBlogs = JSON.parse(raw);
            } catch (e) {}

            allBlogs.splice(realIndex, 1);
            localStorage.setItem("blogs", JSON.stringify(allBlogs));

            Swal.fire({
                icon: "info",
                title: "Blog Rejected",
                showConfirmButton: false,
                timer: 1400,
                timerProgressBar: true,
            }).then(() => renderPendingBlogs());
        }
    });
}

// ── Init ──
window.addEventListener("load", function () {
    document.getElementById("footerYear").textContent = new Date().getFullYear();
    renderPendingBlogs();
});
