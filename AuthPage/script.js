// ── LOGIN VALIDATION ──
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        const email    = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            e.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'Missing fields',
                text: 'Please enter both your email and password.',
                confirmButtonColor: '#C8714A'
            });
            return;
        }

        // Mark user as logged in
        localStorage.setItem("loggedIn", "true");
    });
}


// ── SIGN UP VALIDATION + SAVE USER DATA ──
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
        const name     = document.getElementById('fullname').value.trim();
        const email    = document.getElementById('email').value.trim();
        const pass     = document.getElementById('password').value;
        const confirm  = document.getElementById('confirm-password').value;

        if (!name || !email || !pass || !confirm) {
            e.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'Missing fields',
                text: 'Please fill in all fields.',
                confirmButtonColor: '#C8714A'
            });
            return;
        }

        if (pass !== confirm) {
            e.preventDefault();
            Swal.fire({
                icon: 'error',
                title: "Passwords don't match",
                text: 'Make sure both password fields are identical.',
                confirmButtonColor: '#C8714A'
            });
            return;
        }

        // ── Save user data to localStorage ──
        localStorage.setItem("userName",  name);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("loggedIn",  "true");
        // password saved too (plain text — acceptable for this local project)
        localStorage.setItem("userPassword", pass);
    });
}