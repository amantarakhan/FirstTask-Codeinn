


// ── 1. Load saved profile picture from localStorage ──
const savedPfp = localStorage.getItem("userPFP");

if (savedPfp) {
    document.getElementById("navbarPfp").src = savedPfp;
}


// ── 2. EmailJS — handle contact form submission ──
const contactForm = document.getElementById("contactForm");
const feedback    = document.getElementById("formFeedback");
const sendButton  = contactForm.querySelector(".sendButton");

contactForm.addEventListener("submit", function (e) {
    e.preventDefault(); // stop the page from reloading

    // disable button while sending so user cant double-click
    sendButton.disabled  = true;
    sendButton.textContent = "Sending...";
    feedback.textContent = "";
    feedback.className   = "formFeedback";

    emailjs
        .sendForm(
            "service_c6pj0lf",   // replace with your EmailJS service ID
            "template_mn4s8uv",  // replace with your EmailJS template ID
            contactForm          // the form element — emailjs reads name="" attributes
        )
        .then(function () {
            // success
            feedback.textContent = "✓ Message sent! We'll get back to you soon.";
            feedback.classList.add("success");
            contactForm.reset();
        })
        .catch(function (error) {
            // failure
            feedback.textContent = "✗ Something went wrong. Please try again.";
            feedback.classList.add("error");
            console.error("EmailJS error:", error);
        })
        .finally(function () {
            // re-enable button either way
            sendButton.disabled    = false;
            sendButton.textContent = "Send Message ➜";
        });
});