// ── 1. Load saved profile picture from localStorage ──
const savedPfp = localStorage.getItem("userPFP");

if (savedPfp) {
    document.getElementById("navbarPfp").src = savedPfp;
}


// ── 2. EmailJS — handle contact form submission ──

// wait for the full page to load before looking for the form
window.addEventListener("load", function () {

    const contactForm = document.getElementById("contactForm");

    // if we are not on the contact page, stop here
    if (!contactForm) return;

    const feedback   = document.getElementById("formFeedback");
    const sendButton = contactForm.querySelector(".sendButton");

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault(); // stop the page from reloading
        e.stopPropagation();

        // disable button while sending
        sendButton.disabled = true;
        sendButton.textContent = "Sending...";
        feedback.textContent = "";
        feedback.className = "formFeedback";

        emailjs.sendForm(
            "service_9giip5o",  // your service ID
            "template_mn4s8uv", // your template ID
            contactForm
        )

        // what will be written in the feedback paragraph in the html after pressing in the button -> the css handle the <p> color 
        //success
        .then(function () {
            feedback.textContent = "✓ Message sent! We'll get back to you soon.";
            feedback.classList.add("success");
            contactForm.reset();
        })
        // failure 
        .catch(function (error) {
            feedback.textContent = "✗ Something went wrong. Please try again.";
            feedback.classList.add("error");
            console.error("EmailJS error:", error);
        })

        //reenable the button 
        .finally(function () {
            sendButton.disabled = false;
            sendButton.textContent = "Send Message ➜";
        });
    });

});