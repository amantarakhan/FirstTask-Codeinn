// ── 1. Load saved profile picture ──
const savedPfp = localStorage.getItem("userPFP_" + (localStorage.getItem("userEmail") || ""));
if (savedPfp && document.getElementById("navbarPfp")) {
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
    return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(isoString) {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ── 3. Get ?id from URL ──
function getBlogIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    return id !== null ? parseInt(id, 10) : null;
}

// ── 4. Split content into paragraphs ──
function buildParagraphs(content) {
    if (!content) return "<p>No content available.</p>";
    let chunks = content.split(/\n{2,}/);
    if (chunks.length === 1) chunks = content.split(/\n/);

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

// ── 5. Render the blog article ──
function renderBlog(blog) {
    const article  = document.getElementById("singleBlogArticle");
    const notFound = document.getElementById("notFound");
    if (!article || !notFound) return;

    article.style.display  = "";
    notFound.style.display = "none";
    document.title = `${blog.title} — Briefly`;

    const heroEl = document.getElementById("singleHeroImg");
    heroEl.innerHTML = blog.image
        ? `<img src="${blog.image}" alt="${blog.title}" onerror="this.outerHTML='<div class=\\'singleHeroPlaceholder\\'>📄</div>'">`
        : `<div class="singleHeroPlaceholder">📄</div>`;

    document.getElementById("singleTitle").textContent = blog.title || "Untitled";
    const catEl = document.getElementById("singleCategory");
    catEl.textContent = blog.category || "General";
    catEl.className   = `singleCategoryPill ${getCatClass(blog.category)}`;
    document.getElementById("singleDate").textContent = blog.createdAt ? `Published on ${formatDate(blog.createdAt)}` : "";
    document.getElementById("singleContent").innerHTML = buildParagraphs(blog.content);

    const tagsEl  = document.getElementById("singleTags");
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

// ── 6. Comments /// new 

// Render all comments for the current blog using forEach
function renderComments(blogIndex) { // get this specific blog 
    const list         = document.getElementById("commentsList");
    const countEl      = document.getElementById("commentCount");

    let allBlogs = [];
    try {
        const raw = localStorage.getItem("blogs");
        if (raw) allBlogs = JSON.parse(raw);
    } catch (e) {}

    const blog     = allBlogs[blogIndex];
    const comments = (blog && Array.isArray(blog.comments)) ? blog.comments : [];

    countEl.textContent = `(${comments.length})`;

    if (!comments.length) {
        list.innerHTML = `<p class="noCommentsMsg">No comments yet. Be the first!</p>`;
        return;
    }

    const loggedUserName = localStorage.getItem("userName");
    list.innerHTML = "";

    comments.forEach(function (comment) { // for each used to display all the comments 
        const canDelete = comment.user === loggedUserName;
        const deleteBtn = canDelete
            ? `<button class="commentDeleteBtn" onclick="deleteComment(${blogIndex}, ${comment.id})">
                   <i class="fa-solid fa-trash"></i> Delete
               </button>`
            : "";

        list.innerHTML += `
            <div class="commentCard">
                <div class="commentHeader">
                    <span class="commentUser"><i class="fa-solid fa-user"></i> ${comment.user}</span>
                    <span class="commentDate">${formatDateTime(comment.date)}</span>
                    ${deleteBtn}
                </div>
                <p class="commentText">${comment.text}</p>
            </div>`;
    });
}

// Add a new comment and save it to localStorage
function addComment(blogIndex) {
    const input = document.getElementById("commentInput");
    const text  = input.value.trim();

    if (!text) {
        Swal.fire({
            icon: "warning",
            title: "Empty comment",
            text: "Please write something before posting.",
            confirmButtonColor: "#C8714A",
            timer: 2000,
            showConfirmButton: false,
        });
        return;
    }

    const userName = localStorage.getItem("userName") || "Anonymous";

    const newComment = {
        id:   Date.now(),
        user: userName,
        text: text,
        date: new Date().toISOString(),
    };

    let allBlogs = [];
    try {
        const raw = localStorage.getItem("blogs");
        if (raw) allBlogs = JSON.parse(raw);
    } catch (e) {}

    if (!Array.isArray(allBlogs[blogIndex].comments)) {
        allBlogs[blogIndex].comments = [];
    }
    allBlogs[blogIndex].comments.push(newComment);
    localStorage.setItem("blogs", JSON.stringify(allBlogs));

    input.value = "";
    renderComments(blogIndex);
}

// Delete a comment by its id from the blog's comments array
function deleteComment(blogIndex, commentId) {
    Swal.fire({
        title: "Delete comment?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DC2626",
        cancelButtonColor: "#DDD0C5",
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
    }).then(function (result) {
        if (!result.isConfirmed) return;

        let allBlogs = [];
        try {
            const raw = localStorage.getItem("blogs");
            if (raw) allBlogs = JSON.parse(raw);
        } catch (e) {}

        allBlogs[blogIndex].comments = allBlogs[blogIndex].comments.filter(
            c => c.id !== commentId
        );
        localStorage.setItem("blogs", JSON.stringify(allBlogs));

        renderComments(blogIndex);
    });
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
        const raw = localStorage.getItem("blogs");
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
    renderComments(id);

    // show comment form only if logged in
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    document.getElementById("addCommentBox").style.display     = isLoggedIn ? "flex" : "none";
    document.getElementById("commentLoginPrompt").style.display = isLoggedIn ? "none" : "block";

    // wire up the Post Comment button
    document.getElementById("addCommentBtn").addEventListener("click", function () {
        addComment(id);
    });

    const footerYear = document.getElementById("footerYear");
    if (footerYear) footerYear.textContent = new Date().getFullYear();
});
