// ── 0. Auth guard — show popup and redirect if not logged in ──
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

// ── 1. Load saved profile picture from localStorage
const savedPfp = localStorage.getItem("userPFP");
if (savedPfp) {
    document.getElementById("navbarPfp").src = savedPfp;
}

// ── 2. Load user data from localStorage (saved at sign up) ──
window.addEventListener("load", function () {
// get the year dynamically for footer
    document.getElementById("footerYear").textContent = new Date().getFullYear();

    // ── Load name and email ──
    const savedName  = localStorage.getItem("userName");
    const savedEmail = localStorage.getItem("userEmail");

    if (savedName)  document.querySelector(".userName h2").textContent  = savedName;
    if (savedEmail) document.querySelector(".emailRow span").textContent = savedEmail;

    // ── Load profile picture into the card too ──
    const savedCardPfp = localStorage.getItem("userPFP");
    if (savedCardPfp) document.querySelector(".pfpImg").src = savedCardPfp;

    // ── Load saved bio ──
    const savedBio = localStorage.getItem("userBio");
    if (savedBio) document.getElementById("bioText").textContent = savedBio;

    // ── 3. Dynamic blog count from localStorage ──
    let blogCount = 0;
    try {
        const raw = localStorage.getItem("blogs");
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) blogCount = parsed.length;
        }
    } catch (e) {
        console.error("Error reading blogs from localStorage:", e);
    }
    document.querySelector(".blogSection h4 span").textContent = blogCount;

});

// ── 4. Profile picture upload — silent page reload after save ──
const pfpInput = document.getElementById('pfpUpload');
const pfpImg   = document.querySelector('.pfpImg');

pfpInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            localStorage.setItem("userPFP", imageData);
            // Save first, then silently reload — user sees the new PFP immediately
            window.location.reload();
        };
        reader.readAsDataURL(file);
    }
});

// ── 5. Edit Bio with SweetAlert2 ──
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

            Swal.fire({
                icon: "success",
                title: "Bio updated!",
                showConfirmButton: false,
                timer: 1400,
                timerProgressBar: true
            });
        }
    });
}

// ── 6. Logout button ──
const logoutBtn = document.getElementById('logoutBtn');
const isLoggedIn = localStorage.getItem("loggedIn") === "true";
if (!isLoggedIn) {
    logoutBtn.textContent = "Login";
    logoutBtn.addEventListener('click', function () {
        window.location.href = '../AuthPage/login.html';
    });
} else {
    logoutBtn.addEventListener('click', function () {
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
}