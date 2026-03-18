// ── Load saved profile picture from localStorage - didnt change it - same as before ──
const savedPfp = localStorage.getItem("userPFP"); // saved in local storage 
if (savedPfp) {
    document.getElementById("navbarPfp").src = savedPfp;
}

// ── Handle Create Blog Form ──
window.addEventListener("load", function () {
    const blogForm = document.getElementById("blogForm");
    
    if (!blogForm) return;

    const fileInput = document.getElementById("headerUpload");
    const fileNameDisplay = document.getElementById("fileName");
    const feedback = document.getElementById("formFeedback");
    const publishButton = blogForm.querySelector(".publishButton");

    // ── Handle File Upload Display ──
    fileInput.addEventListener("change", function (e) {
        if (this.files && this.files[0]) {
            fileNameDisplay.textContent = "✓ " + this.files[0].name;
            fileNameDisplay.style.color = "#4A7C59";
        } else {
            fileNameDisplay.textContent = "";
        }
    });

    // ── Handle Form Submission ──
    blogForm.addEventListener("submit", function (e) { // Listen for when user clicks "Publish Story"
        e.preventDefault();
        e.stopPropagation();

        // Disable button while processing
        publishButton.disabled = true;
        publishButton.textContent = "Publishing...";
        feedback.textContent = "";
        feedback.className = "formFeedback";

        // ── Get form values using their IDs ──
        const blogTitle = document.getElementById("blogTitle").value.trim();
        const imageUrl = document.getElementById("imageUrl").value.trim();
        const category = document.getElementById("category").value;
        const content = document.getElementById("content").value.trim();

        // ── Validate required fields ──
        if (!blogTitle || !category || !content) { // if (title is empty OR category is empty OR content is empty) 
            feedback.textContent = "✗ Please fill in all required fields.";
            feedback.classList.add("error");
            publishButton.disabled = false;
            publishButton.textContent = "Publish Story";
            return;
        }

        try { // using try and a catch for simple error handling 
            // ── Create blog object as required in the task ──
            const blog = {
                title: blogTitle,
                image: imageUrl,
                category: category,
                content: content,
                createdAt: new Date().toISOString()
            };

            // ── Get existing blogs from localStorage (if any) ──
            let blogs = []; // Create empty array
            const existingBlogs = localStorage.getItem("blogs"); // Get saved blogs from storage
            
            if (existingBlogs) { // Check if blogs exist
                try {
                    blogs = JSON.parse(existingBlogs); // Convert text → JavaScript array
                    // Ensure it's an array
                    if (!Array.isArray(blogs)) { // Verify it's actually an array
                        blogs = []; // get it 
                    } 
                } catch (e) { // if any error happen use empty array
                    console.error("Error parsing existing blogs:", e);
                    blogs = []; // this is the empty array 
                }
            }

            // ── Push new blog to array ──
            blogs.push(blog);

            // ── Save updated array back to localStorage ──
            localStorage.setItem("blogs", JSON.stringify(blogs));

            // ── Success feedback ──
            feedback.textContent = "✓ Blog published successfully! Your story is now live.";
            feedback.classList.add("success");

            // ── Clear form ──
            blogForm.reset();
            fileNameDisplay.textContent = "";

            // Optional: Redirect after a short delay
            setTimeout(() => {
                // Uncomment the line below if you want to redirect after publishing
                // window.location.href = "home.html";
            }, 1500);

        } catch (error) {
            console.error("Error publishing blog:", error);
            feedback.textContent = "✗ Something went wrong. Please try again.";
            feedback.classList.add("error");
        }

        // ── Re-enable button ──
        publishButton.disabled = false;
        publishButton.textContent = "Publish Story";
    });
});