// ── Contact Form Script ──
// ── 1. Load saved profile picture from localStorage ──
const savedPfp = localStorage.getItem("userPFP");
if (savedPfp) {
    const navPfp = document.getElementById("navbarPfp");
    if (navPfp) navPfp.src = savedPfp;
}

// Make sure the DOM is loaded (your script is at bottom, so optional)
window.addEventListener("load", function () {

    const contactForm = document.getElementById("contactForm"); // ✅ define form
    if (!contactForm) return;

    const sendButton = document.getElementById("sendButton"); // ✅ define button
    const feedback = document.getElementById("formFeedback"); // ✅ define feedback element

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // get elements 
        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("userEmail").value.trim();
        const message = document.getElementById("userMessage").value.trim();

        // ── Regexes ──
        const nameRegex = /^[a-zA-Z]+(\s[a-zA-Z]+)+$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const messageRegex = /^[\s\S]{20,1000}$/;

        // ── Run ALL validation BEFORE disabling the button ──

        // 1) Empty check
        if (!name || !email || !message) {
            feedback.textContent = "✗ Please fill in all fields.";
            feedback.className = "formFeedback error";
            return; // button never got disabled
        }

        // 2) Name
        if (!nameRegex.test(name)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Name',
                text: 'Please enter your first and last name (letters only).',
                confirmButtonColor: '#C8714A'
            });
            return;
        }

        // 3) Email
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address (e.g. name@example.com).',
                confirmButtonColor: '#C8714A'
            });
            return;
        }

        // 4) Message
        if (!messageRegex.test(message)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Message',
                text: message.length < 20
                    ? `Message is too short. Write at least 20 characters. (You have ${message.length}.)`
                    : `Message is too long. Maximum is 1000 characters. (You have ${message.length}.)`,
                confirmButtonColor: '#C8714A'
            });
            return;
        }

        // ── Only disable the button AFTER all validation passes ──
        sendButton.disabled = true;
        sendButton.textContent = "Sending...";
        feedback.textContent = "";
        feedback.className = "formFeedback";

        // ── Send via EmailJS ──
        emailjs.sendForm(
            "service_9giip5o",
            "template_mn4s8uv",
            contactForm
        )
            .then(function () {
                feedback.textContent = "✓ Message sent! We'll get back to you soon.";
                feedback.className = "formFeedback success";
                contactForm.reset();
            })
            .catch(function (error) {
                feedback.textContent = "✗ Something went wrong. Please try again.";
                feedback.className = "formFeedback error";
                console.error("EmailJS error:", error);
            })
            .finally(function () {
                sendButton.disabled = false;
                sendButton.textContent = "Send Message ➜";
            });
    });
});