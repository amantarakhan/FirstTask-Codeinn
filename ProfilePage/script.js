// ── 1. Load saved profile picture from localStorage
const savedPfp = localStorage.getItem("userPFP");
if (savedPfp) {
    document.getElementById("navbarPfp").src = savedPfp;
}

// ── 2. Load user data from localStorage (saved at sign up) ──
window.addEventListener("load", function () {

    // ── Load name and email ──
    const savedName  = localStorage.getItem("userName");
    const savedEmail = localStorage.getItem("userEmail");

    if (savedName)  document.querySelector(".userName h2").textContent  = savedName;
    if (savedEmail) document.querySelector(".emailRow span").textContent = savedEmail;

    // ── Load profile picture into the card too ──
    const savedCardPfp = localStorage.getItem("userPFP");
    if (savedCardPfp) document.querySelector(".pfpImg").src = savedCardPfp;

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

// ── 4. Profile picture upload ──
const pfpInput = document.getElementById('pfpUpload');
const pfpImg   = document.querySelector('.pfpImg');

pfpInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            pfpImg.src = imageData;
            localStorage.setItem("userPFP", imageData);
            // also update navbar pfp immediately
            document.getElementById("navbarPfp").src = imageData;
        };
        reader.readAsDataURL(file);
    }
});

// ── 5. Logout button — show "Login" if user is not logged in ──
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