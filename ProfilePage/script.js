// ── 0. Auth guard ──
if (localStorage.getItem("loggedIn") !== "true") {
    Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'You need to be logged in to view your profile.',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#C8714A',
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then(function () {
        window.location.href = '../AuthPage/login.html';
    });
}

// ── 1. Load navbar profile picture ──
const pfpKey = "userPFP_" + (localStorage.getItem("userEmail") || "");
const savedPfp = localStorage.getItem(pfpKey);
if (savedPfp) {
    document.getElementById("navbarPfp").src = savedPfp;
}

// ── 2. Category CSS class mapping same as before (the pill color )──
const CATEGORY_CLASS = {
    technology: "cat-technology",
    lifestyle: "cat-lifestyle",
    travel: "cat-travel",
    food: "cat-food",
    business: "cat-business",
    health: "cat-health",
    education: "cat-education",
    entertainment: "cat-entertainment",
    finance: "cat-finance",
    games: "cat-games",
    training: "cat-training",
    other: "cat-other",
};

function getCatClass(cat) {
    return CATEGORY_CLASS[(cat || "").toLowerCase()] || "cat-default";
}

function formatDate(isoString) {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function truncate(text, max = 100) {
    if (!text) return "";
    return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

// ── 3. Build a story card for the profile page ──
function buildProfileCard(blog, realIndex) { // this function will be used if the myblogs is not empty to build them 
    const catClass = getCatClass(blog.category);
    const imgHtml = blog.image
        ? `<img src="${blog.image}" alt="${blog.title}" class="storyCardImg"
               onerror="this.outerHTML='<div class=\\'storyCardImgPlaceholder\\'>📄</div>'">`
        : `<div class="storyCardImgPlaceholder">📄</div>`;

    const pendingBadge = !blog.isApproved
        ? `<span class="storyCardPendingBadge"><i class="fa-solid fa-clock"></i> Pending</span>`
        : "";

    return `
        <div class="storyCard" onclick="window.location.href='../singleblogPage/singleBlog.html?id=${realIndex}'" style="cursor:pointer;">
            <div class="storyCardImgWrapper">
                ${imgHtml}
                <span class="storyCardBadge ${catClass}">${blog.category || "General"}</span>
                ${pendingBadge}
            </div>
            <div class="storyCardBody">
                <p class="storyCardDate">${formatDate(blog.createdAt)}</p>
                <h3 class="storyCardTitle">${blog.title || "Untitled"}</h3>
                <p class="storyCardExcerpt">${truncate(blog.content, 100)}</p>
            </div>
            <div class="storyCardActions" onclick="event.stopPropagation()">
                <button class="cardActionBtn editBtn" onclick="window.location.href='../createBlogPage/create.html?editIndex=${realIndex}'">
                    <i class="fa-solid fa-pen"></i> Edit
                </button>
                <button class="cardActionBtn deleteBtn" onclick="deleteBlog(${realIndex})">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        </div>`;
}

// ── 4. Render the user's blogs ──
function renderMyBlogs() {
    const loggedUserEmail = localStorage.getItem("userEmail"); // get the current user email (to compare)
    const grid = document.getElementById("profileStoriesGrid"); // use it if there is actually blogs created by this user 
    const empty = document.getElementById("profileEmpty"); //use if if empty

    let allBlogs = []; // craete an empty array
    try {
        const raw = localStorage.getItem("blogs"); // get the existing blogs (all of them)
        if (raw) { // if there is actually blogs (in the local storage)
            const parsed = JSON.parse(raw); // parse it for the js to understand it 
            if (Array.isArray(parsed)) allBlogs = parsed;
        }
    } catch (e) {
        console.error("Error reading blogs:", e); // saftey check 
    }

    // filter to only this user's blogs (newest first)
    const myBlogs = allBlogs // copy the existing all blogs in the myblogs  
        .map((blog, index) => ({ blog, index }))  // transforms each item into an object that includes:
        // the blog itself
        // its original position in the array
        .filter(({ blog }) => blog.authorEmail === loggedUserEmail) // keeps only blogs written by the current user (this is build in function) 
        .reverse(); // newest first 

    // update blog count stat
    document.getElementById("blogCountDisplay").textContent = myBlogs.length; // the lenght of the myblog array is the blogs count created by the user 

    if (!myBlogs.length) { // this is the condition that the myblogs is emppty -> the user didnt create any
        grid.style.display = "none";
        empty.style.display = "flex";
        return;
    }

    // this is the else condition -> building the user's blogs 
    // using the grid

    grid.style.display = "grid";
    empty.style.display = "none";
    grid.innerHTML = ""; // set the HTML grid 
    myBlogs.forEach(function ({ blog, index }) { // for each item in myblogs array -> take the blog object and its index 
        grid.innerHTML += buildProfileCard(blog, index); // -> building using the buildProfilCard Function
    });
}



// ── 5. Delete a blog by its real index in the full blogs array ─ using the sweet alert library ─
function deleteBlog(realIndex) {
    Swal.fire({
        title: 'Delete this story?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DC2626',
        cancelButtonColor: '#DDD0C5',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel'
    }).then(function (result) {
        if (result.isConfirmed) {
            let allBlogs = [];
            try {
                const raw = localStorage.getItem("blogs");
                if (raw) allBlogs = JSON.parse(raw);
            } catch (e) { }

            allBlogs.splice(realIndex, 1);
            localStorage.setItem("blogs", JSON.stringify(allBlogs));

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                showConfirmButton: false,
                timer: 1200,
                timerProgressBar: true
            }).then(() => renderMyBlogs());
        }
    });
}



// ── 6. Load all profile data on page load ──
window.addEventListener("load", function () {
    document.getElementById("footerYear").textContent = new Date().getFullYear();

    // Name & email
    const savedName = localStorage.getItem("userName");
    const savedEmail = localStorage.getItem("userEmail");
    if (savedName) document.getElementById("profileName").textContent = savedName;
    if (savedEmail) document.getElementById("profileEmail").textContent = savedEmail;

    // Profile avatar in the hero
    const savedCardPfp = localStorage.getItem(pfpKey);
    if (savedCardPfp) document.getElementById("profilePfpImg").src = savedCardPfp;

    // Bio
    const savedBio = localStorage.getItem("userBio");
    if (savedBio) document.getElementById("bioText").textContent = savedBio;

    // Render the user's stories
    renderMyBlogs();
});

// ── 7. Profile picture upload ──
const pfpInput = document.getElementById("pfpUpload");
pfpInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            localStorage.setItem("userPFP", e.target.result);
            window.location.reload();
        };
        reader.readAsDataURL(file);
    }
});

// ── 8. Edit Bio ──
function editBio() {
    const currentBio = localStorage.getItem("userBio") || "";
    Swal.fire({
        title: "Edit Bio",
        input: "textarea",
        inputLabel: "Tell us about yourself",
        inputValue: currentBio,
        inputPlaceholder: "Write something about yourself...",
        inputAttributes: { maxlength: 300 },
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#C8714A",
        cancelButtonColor: "#DDD0C5",
        inputValidator: (value) => {
            if (value.length > 300) return "Bio must be under 300 characters!";
        }
    }).then(function (result) {
        if (result.isConfirmed) {
            const newBio = result.value.trim() || "No bio yet.";
            localStorage.setItem("userBio", newBio);
            document.getElementById("bioText").textContent = newBio;
            Swal.fire({ icon: "success", title: "Bio updated!", showConfirmButton: false, timer: 1400, timerProgressBar: true });
        }
    });
}

// ── 9. Logout ──
document.getElementById("logoutBtn").addEventListener("click", function () {
    Swal.fire({
        title: 'Log out?',
        text: 'You will be returned to the login page.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#C8714A',
        cancelButtonColor: '#DDD0C5',
        confirmButtonText: 'Yes, log out',
        cancelButtonText: 'Cancel'
    }).then(function (result) {
        if (result.isConfirmed) {
            localStorage.removeItem("loggedIn");
            window.location.href = '../AuthPage/login.html';
        }
    });
});
