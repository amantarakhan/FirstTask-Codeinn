// ── 1. Load saved profile picture from localStorage
const savedPfp = localStorage.getItem("userPFP");
if (savedPfp) {
    document.getElementById("navbarPfp").src = savedPfp;
}

// ── 2. Category → CSS class + color mapping ──
const CATEGORY_CLASS = {
    technology: "cat-technology",
    lifestyle: "cat-lifestyle",
    travel: "cat-travel",
    food: "cat-food",
    business: "cat-business",
    health: "cat-health",
    education: "cat-education",
    entertainment: "cat-entertainment",
    other: "cat-other",
};

function getCatClass(category) {
    return CATEGORY_CLASS[(category || "").toLowerCase()] || "cat-default";
}

// ── 3. Format date → "Mar 18, 2026"
function formatDate(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── 4. Truncate text to 100 chars
function truncate(text, max = 100) {
    if (!text) return "";
    return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

// ── 5. Build image HTML for a card ──
function buildImgTag(image, cssClass, height) {
    if (image) {
        return `<img src="${image}" class="${cssClass}">`;
    }
    return `<div class="${cssClass}Placeholder">📄</div>`;
}

// ── 6. Navigate to single blog page ──
function goToBlog(index) {
    window.location.href = `../singleblogPage/singleBlog.html?id=${index}`;
}

// ── 7. Render LATEST UPDATES (2 most recent cards) ──
function renderLatest(blogs) {
    const grid = document.getElementById("latestGrid");
    const empty = document.getElementById("latestEmpty");

    if (!blogs.length) {
        grid.style.display = "none";
        empty.style.display = "flex";
        return;
    }

    grid.style.display = "";
    empty.style.display = "none";

    const latest = blogs.slice(-2).reverse();

    grid.innerHTML = latest.map((blog, i) => {
        const realIndex = blogs.length - 1 - i;
        const cat = blog.category || "Other";
        const catClass = getCatClass(cat);

       // In renderLatest, replace the imgHtml + card structure:

const imgHtml = blog.image
    ? `<img src="${blog.image}" alt="${blog.title}" class="latestCardImg">`
    : `<div class="latestCardImgPlaceholder">📄</div>`;

return `
<a class="latestCard" onclick="goToBlog(${realIndex}); return false;" href="#">
    <div class="latestCardImgWrapper">          <!-- ✅ add this wrapper -->
        ${imgHtml}
        <span class="blogCardCatBadge ${catClass}">${cat}</span>   <!-- ✅ move badge here -->
    </div>
    <div class="latestCardBody">
        <h3 class="latestCardTitle">${blog.title}</h3>
        <p class="latestCardExcerpt">${truncate(blog.content, 120)}</p>
        <div class="latestCardMeta">
            <span>${formatDate(blog.createdAt)}</span>
            <span>${Math.ceil((blog.content || "").length / 800)} min read</span>
        </div>
    </div>
</a>`;
    }).join("");
}

// ── 8. Render BLOG CARDS GRID (4 oldest blogs) ──
function renderBlogCards(blogs) {
    const grid = document.getElementById("blogsGrid");
    const empty = document.getElementById("blogsEmpty");
    const seeAllWrap = document.getElementById("seeAllWrapper");

    if (!blogs.length) {
        grid.style.display = "none";
        empty.style.display = "flex";
        seeAllWrap.style.display = "none";
        return;
    }

    grid.style.display = "";
    empty.style.display = "none";
    seeAllWrap.style.display = "flex";

    // Show 4 OLDEST blogs (first 4 in the array = oldest)
    const oldest = blogs.slice(0, 4);

    grid.innerHTML = oldest.map((blog, i) => {
        const realIndex = i; // oldest blogs keep their original index
        const catClass = getCatClass(blog.category);
        const imgHtml = blog.image
            ? `<img src="${blog.image}" alt="${blog.title}" class="blogCardImg" onerror="this.outerHTML='<div class=\\'blogCardImgPlaceholder\\'>📄</div>'">`
            : `<div class="blogCardImgPlaceholder">📄</div>`;

        return `
        <a class="blogCard" onclick="goToBlog(${realIndex}); return false;" href="#">
            <div class="blogCardImgWrapper">
                ${imgHtml}
                <span class="blogCardCatBadge ${catClass}">${blog.category || "General"}</span>
            </div>
            <div class="blogCardBody">
                <h3 class="blogCardTitle">${blog.title}</h3>
                <p class="blogCardExcerpt">${truncate(blog.content, 100)}</p>
                <span class="blogCardDate">${formatDate(blog.createdAt)}</span>
            </div>
        </a>`;
    }).join("");
}

// this function we was using it before -> when fetching data from the local storage 
// ── 9. Init ──
// window.addEventListener("load", function () {
//     let blogs = [];

//     try {
//         const raw    = localStorage.getItem("blogs");
//         const parsed = JSON.parse(raw);
//         if (raw && Array.isArray(parsed)) blogs = parsed;
//     } catch (e) {
//         console.error("Error reading blogs from localStorage:", e);
//     }

//     renderLatest(blogs);
//     renderBlogCards(blogs);

//     document.getElementById("footerYear").textContent = new Date().getFullYear();
// });


// now we will use the new way -> fetching data from the API 

// window.addEventListener means that only run the getData function when the page fully loaded 
// window -> represent the whole browser function 
// addEventListener("load", -> means listen to the load event 
// when the 'load' event fires ? -when HTML + CSS + images are fully loaded (everything is ready) 

// why dont run just declare async function getData() -> this might run before the page is ready -> so the resukt may be null






// this is a helper funtion for the catagry 
// why ? cuz the API data doesnt have a direct catagory value so i try to match it using the title + description
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


window.addEventListener("load", async function getData() {
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
            content: item.content || item.description || "no description",
            image: item.urlToImage, // the empty case us already handled 
            createdAt: item.publishedAt,
            // the catagory we have to call the above function here 
            category: detectCategory(item.title + "" + item.description),
        })
        );


        console.log(blogs); // this is for just print the result in the console
    }
    catch (e) {
        console.log("ERROR FETCHING BLOGS", e);

    }
    // call the bove functions above functions
    renderLatest(blogs);
    renderBlogCards(blogs);

    document.getElementById("footerYear").textContent = new Date().getFullYear(); // this stays the same -> formation the footer year 

}); 