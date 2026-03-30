

// ── LOGIN VALIDATION ──
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();


        // here i will implemt the new way for input validation -> using regex 
        // declare the regex -> got them from google 
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // valid email 
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // one lowecase , one uppercase , one symbol , one number , lenght at least 8 char



        if (!email || !password) { // here we check if anyone is empty -> then using the sweet alert to alert the user - same as before 
            e.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'Missing fields',
                text: 'Please enter both your email and password.',
                confirmButtonColor: '#C8714A'
            });
            return;
        }



        // we use the function test will return a boolean value according to the email value that passes to it 
        // for example if we wrote const is valid = emailRegex.text(email) -> if the email the user input is correct it will it will return true 
        if (!emailRegex.test(email)) {
            e.preventDefault(); // same -> prevernt the defult value of the website which is reload it and send the credential to the server 
            Swal.fire({ // same as before using the sweet alert 
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address (e.g. name@example.com).',
                confirmButtonColor: '#C8714A'
            });
            return;
        }

        if (!passwordRegex.test(password)) { // same -> test function
            e.preventDefault(); // same as before -> dont send the credential to the server 
            Swal.fire({
                icon: 'error',
                title: 'Weak Password',
                text: 'Password must have 8+ characters, uppercase, lowercase, number, and symbol. ',
                confirmButtonColor: '#C8714A'
            });
            return;
        }


        // this is the old way -> without using regex
        // if (!email || !password) {
        //     e.preventDefault();
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Missing fields',
        //         text: 'Please enter both your email and password.',
        //         confirmButtonColor: '#C8714A'
        //     });
        //     return;
        // }

        // Mark user as logged in

        localStorage.setItem("loggedIn", "true");
    });
}


// ── SIGN UP VALIDATION + SAVE USER DATA ──
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function (e) {

        const name = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const pass = document.getElementById('password').value;
        const confirm = document.getElementById('confirm-password').value;

        // now we will implement the new way to do validation -> using regex 

        // defining the regex 
        // ── Regexes ──
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^.{8,}$/;
        const nameRegex = /^[a-zA-Z]+\s[a-zA-Z]+\s[a-zA-Z]+$/;
        const phoneRegex = /^(07[789]\d{7}|(\+9627[789]\d{7}))$/;

        if (!name || !email || !pass || !confirm || !phoneNumber) { // here we check if anyone is empty -> then using the sweet alert to alert the user - same as before 
            e.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'Missing fields',
                text: 'Please enter both your email and password and phone number',
                confirmButtonColor: '#C8714A'
            });
            return;
        }

        // same as the login ones 
        if (!emailRegex.test(email)) {
            e.preventDefault(); // same -> prevernt the defult value of the website which is reload it and send the credential to the server 
            Swal.fire({ // same as before using the sweet alert 
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address (e.g. name@example.com).',
                confirmButtonColor: '#C8714A'
            });
            return;
        }

        if (!passwordRegex.test(pass)) { // same -> test function
            e.preventDefault(); // same as before -> dont send the credential to the server 
            Swal.fire({
                icon: 'error',
                title: 'Weak Password',
                text: 'Password must be at least 8 characters long.',
                confirmButtonColor: '#C8714A'
            });
            return;
        }

        // 5) Passwords match
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

        // this is for the phone validation
        if (!phoneRegex.test(phoneNumber)) {
            e.preventDefault(); // same -> prevernt the defult value of the website which is reload it and send the credential to the server 
            Swal.fire({ // same as before using the sweet alert 
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Please enter a valid Jordanian Number (e.g. 0791234567 or +962791234567).',
                confirmButtonColor: '#C8714A'
            });
            return;
        }

        // this is for the name validation
        if (!nameRegex.test(name)) {
            e.preventDefault(); // same -> prevernt the defult value of the website which is reload it and send the credential to the server 
            Swal.fire({ // same as before using the sweet alert 
                icon: 'error',
                title: 'Invalid name',
                text: 'Please enter your full name: First, Middle, and Last name.',
                confirmButtonColor: '#C8714A'
            });
            return;
        }







        // this is the old way to do the validation -> without regex 
        // if (!name || !email || !pass || !confirm) {
        //     e.preventDefault();
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Missing fields',
        //         text: 'Please fill in all fields.',
        //         confirmButtonColor: '#C8714A'
        //     });
        //     return;
        // }

        // if (pass !== confirm) {
        //     e.preventDefault();
        //     Swal.fire({
        //         icon: 'error',
        //         title: "Passwords don't match",
        //         text: 'Make sure both password fields are identical.',
        //         confirmButtonColor: '#C8714A'
        //     });
        //     return;
        // }


        // ── Save user data to localStorage - didnt change that 
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("loggedIn", "true");
        // password saved too (plain text — acceptable for this local project)
        localStorage.setItem("userPassword", pass);
    });
}