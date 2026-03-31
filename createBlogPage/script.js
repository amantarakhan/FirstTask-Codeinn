// ── 0. Auth guard — show popup and redirect if not logged in ──
if (localStorage.getItem("loggedIn") !== "true") {
    Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'You need to be logged in to create a blog.',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#C8714A',
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then(function () {
        window.location.href = '../AuthPage/login.html';
    });
}

// ── Load saved profile picture from localStorage ──
const savedPfp = localStorage.getItem("userPFP");
if (savedPfp) {
    document.getElementById("navbarPfp").src = savedPfp;
}

// ── Handle Create Blog Form ──
window.addEventListener("load", function () {

    // get the year dynamically for footer
    document.getElementById("footerYear").textContent = new Date().getFullYear();

    const blogForm = document.getElementById("blogForm");

    if (!blogForm) return;

    const imageUrlInput = document.getElementById("imageUrl");
    const fileInput = document.getElementById("headerUpload");
    const fileNameDisplay = document.getElementById("fileName");
    const feedback = document.getElementById("formFeedback");
    const publishButton = blogForm.querySelector(".publishButton");

    // ── When user enters URL, clear file upload ──
    imageUrlInput.addEventListener("input", function () {
        if (this.value.trim()) {
            fileInput.value = "";
            fileNameDisplay.textContent = "";
        }
    });

    // ── When user uploads file, clear URL field ──
    fileInput.addEventListener("change", function () {
        if (this.files && this.files[0]) {
            imageUrlInput.value = "";
            fileNameDisplay.textContent = "✓ " + this.files[0].name;
            fileNameDisplay.style.color = "#4A7C59";
        } else {
            fileNameDisplay.textContent = "";
        }
    });

    // ── Convert uploaded file to base64 ──
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // ✅ ── Live Validation Function (FIX) ──
    function validateFormLive() {
        const blogTitle = document.getElementById("blogTitle").value.trim();
        const imageUrl = document.getElementById("imageUrl").value.trim();
        const uploadedFile = fileInput.files[0];
        const category = document.getElementById("category").value;
        const content = document.getElementById("content").value.trim();

        const titleRegex = /^[a-zA-Z0-9][a-zA-Z0-9\s.,!?'-]{4,99}$/;
        const contentRegex = /^[\s\S]{50,5000}$/;

        const isValid =
            blogTitle &&
            category &&
            content &&
            (imageUrl || uploadedFile) &&
            titleRegex.test(blogTitle) &&
            contentRegex.test(content);

        publishButton.disabled = !isValid;
    }

    // ✅ ── Attach live validation to inputs (FIX) ──
    [
        document.getElementById("blogTitle"),
        imageUrlInput,
        document.getElementById("category"),
        document.getElementById("content"),
        fileInput
    ].forEach(input => {
        input.addEventListener("input", validateFormLive);
        input.addEventListener("change", validateFormLive);
    });

    // ── Handle Form Submission ──
    blogForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        e.stopPropagation();

        publishButton.disabled = true;
        publishButton.textContent = "Publishing...";
        feedback.textContent = "";
        feedback.className = "formFeedback";

        const blogTitle = document.getElementById("blogTitle").value.trim();
        const imageUrl = document.getElementById("imageUrl").value.trim();
        const uploadedFile = fileInput.files[0];
        const category = document.getElementById("category").value;
        const content = document.getElementById("content").value.trim();

        // after we got all the inputs 
        // define the regex 

        const titleRegex = /^[a-zA-Z0-9][a-zA-Z0-9\s.,!?'-]{4,99}$/;
        const imageRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
        const contentRegex = /^[\s\S]{50,5000}$/;

        if (!blogTitle || !category || !content || (!imageUrl && !uploadedFile)) {
            feedback.textContent = "✗ Please fill in all required fields. Choose image: URL or Upload.";
            feedback.classList.add("error");
            publishButton.disabled = false;
            publishButton.textContent = "Publish Story";
            return;
        }

        if (!titleRegex.test(blogTitle)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Title',
                text: blogTitle.length < 5
                    ? 'Title is too short. Must be at least 5 characters.'
                    : blogTitle.length > 100
                        ? 'Title is too long. Must be under 100 characters.'
                        : "Title must start with a letter or number, and only contain basic punctuation (. , ! ? ' -)",
                confirmButtonColor: '#C8714A'
            });
            publishButton.disabled = false; // ✅ FIX
            publishButton.textContent = "Publish Story"; // ✅ FIX
            return;
        }

        // 3) Image validation  
        if (uploadedFile) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
            if (!allowedTypes.includes(uploadedFile.type)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid File Type',
                    text: 'Uploaded file must be an image (.jpg, .jpeg, .png, .gif, .webp, or .svg).',
                    confirmButtonColor: '#C8714A'
                });
                publishButton.disabled = false;
                publishButton.textContent = "Publish Story";
                return;
            }
        } else if (imageUrl) {
            if (!imageRegex.test(imageUrl)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Image URL',
                    text: !imageUrl.startsWith('http')
                        ? 'URL must start with http:// or https://'
                        : 'URL must point to a valid image file (.jpg, .jpeg, .png, .gif, .webp, or .svg)',
                    confirmButtonColor: '#C8714A'
                });
                publishButton.disabled = false;
                publishButton.textContent = "Publish Story";
                return;
            }
        }

        if (!contentRegex.test(content)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Content',
                text: content.length < 50
                    ? `Content is too short. Write at least 50 characters. (You have ${content.length}.)`
                    : `Content is too long. Maximum is 5000 characters. (You have ${content.length}.)`,
                confirmButtonColor: '#C8714A'
            });
            publishButton.disabled = false; // ✅ FIX
            publishButton.textContent = "Publish Story"; // ✅ FIX
            return;
        }

        try {
            let imageData = imageUrl;

            if (uploadedFile) {
                imageData = await fileToBase64(uploadedFile);
            }

            const blog = {
                title: blogTitle,
                image: imageData,
                category: category,
                content: content,
                createdAt: new Date().toISOString()
            };

            let blogs = [];
            const existingBlogs = localStorage.getItem("blogs");

            if (existingBlogs) {
                try {
                    blogs = JSON.parse(existingBlogs);
                    if (!Array.isArray(blogs)) blogs = [];
                } catch (e) {
                    console.error("Error parsing existing blogs:", e);
                    blogs = [];
                }
            }

            blogs.push(blog);
            localStorage.setItem("blogs", JSON.stringify(blogs));

            Swal.fire({
                icon: 'success',
                title: 'Blog published!',
                text: 'Your story is now live.',
                confirmButtonColor: '#C8714A',
                timer: 3000,
                timerProgressBar: true
            });

            blogForm.reset();
            fileNameDisplay.textContent = "";

        } catch (error) {
            console.error("Error publishing blog:", error);
            Swal.fire({
                icon: 'error',
                title: 'Could not publish',
                text: 'Something went wrong. Please try again.',
                confirmButtonColor: '#C8714A'
            });
        }

        publishButton.disabled = false;
        publishButton.textContent = "Publish Story";
    });

    // ✅ Initialize button state
    validateFormLive();
});