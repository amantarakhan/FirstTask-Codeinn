// ── Load saved profile picture from localStorage - didnt change it - same as before ──
const savedPfp = localStorage.getItem("userPFP"); // saved in local storage 
if (savedPfp) {
    document.getElementById("navbarPfp").src = savedPfp;
}



// ── Handle Create Blog Form ──
window.addEventListener("load", function () {
    const blogForm = document.getElementById("blogForm");

    if (!blogForm) return;

    const imageUrlInput = document.getElementById("imageUrl");
    const fileInput = document.getElementById("headerUpload");
    const fileNameDisplay = document.getElementById("fileName");
    const feedback = document.getElementById("formFeedback");
    const publishButton = blogForm.querySelector(".publishButton");

    // ── When user enters URL, clear file upload ──
    imageUrlInput.addEventListener("input", function () {
        if (this.value.trim()) { // If user typed something in URL field
            fileInput.value = ""; // Clear any uploaded file
            fileNameDisplay.textContent = ""; // Clear filename display
        }
    });

    // ── When user uploads file, clear URL field ──
    fileInput.addEventListener("change", function () {
        if (this.files && this.files[0]) { // If user selected a file
            imageUrlInput.value = ""; // Clear URL field
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
    blogForm.addEventListener("submit", async function (e) { // Listen for when user clicks "Publish Story"
        //stops the browser’s default behavior for that event. like you are saying : Hey browser, don’t do what you normally do for this action. 
        // normally this is the dedult behavior when a user submit a form : The page reloads -> Data is sent to the server 
        // when we stop this behaviour -> the page wont reload and the data can be handled using JavaScript
        e.preventDefault();

        //stops the event from bubbling up (or down) the DOM tree.
        // In JavaScript, events bubble up from child → parent. 
        // means =  Don’t trigger parent elements (it only controls Who else gets notified that this event happened?) 
        // used here so the container never knows the form was submitted.
        // It’s only useful when:There are parent elements listening to the same event
        e.stopPropagation();

        // Disable button while processing
        publishButton.disabled = true;
        publishButton.textContent = "Publishing...";
        feedback.textContent = "";
        feedback.className = "formFeedback";

        // ── Get form values using their IDs ──
        const blogTitle = document.getElementById("blogTitle").value.trim();
        const imageUrl = document.getElementById("imageUrl").value.trim();
        const uploadedFile = fileInput.files[0]; // Get uploaded file if exists
        const category = document.getElementById("category").value;
        const content = document.getElementById("content").value.trim();

        // ── Validate required fields ──
        // if (title is empty OR category is empty OR content is empty OR no image (URL or file))
        if (!blogTitle || !category || !content || (!imageUrl && !uploadedFile)) {
            feedback.textContent = "✗ Please fill in all required fields. Choose image: URL or Upload.";
            feedback.classList.add("error");
            publishButton.disabled = false;
            publishButton.textContent = "Publish Story";
            return;
        }

        try { // using try and a catch for simple error handling 
            // ── Get image data - either from URL or uploaded file ──
            let imageData = imageUrl; // Start with URL if provided

            // If file uploaded, convert it to base64
            if (uploadedFile) {
                imageData = await fileToBase64(uploadedFile); //way to convert any data into a text format 

                // base64 : 
                // /Base64 lets you: turn a file into a string so you can store it, send it, or display it easily 
                // the uploaded file is a binary data so in order to save it into the local storage we convert it into text using the base64 
            }

            // ── Create blog object as required in the task ──
            const blog = {
                title: blogTitle,
                image: imageData, // Either URL or base64 file data
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