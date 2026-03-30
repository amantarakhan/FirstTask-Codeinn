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

    // ── Handle Form Submission ──
    blogForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        e.stopPropagation();

        publishButton.disabled = true;
        publishButton.textContent = "Publishing...";
        feedback.textContent = "";
        feedback.className = "formFeedback";

        const blogTitle    = document.getElementById("blogTitle").value.trim();
        const imageUrl     = document.getElementById("imageUrl").value.trim();
        const uploadedFile = fileInput.files[0];
        const category     = document.getElementById("category").value;
        const content      = document.getElementById("content").value.trim();

        if (!blogTitle || !category || !content || (!imageUrl && !uploadedFile)) {
            feedback.textContent = "✗ Please fill in all required fields. Choose image: URL or Upload.";
            feedback.classList.add("error");
            publishButton.disabled = false;
            publishButton.textContent = "Publish Story";
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
});