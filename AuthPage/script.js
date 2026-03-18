

//log in validation 
document.querySelector('form').addEventListener('submit', function (e) {
    // got all the data the user input  (email , password )
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) { // the email or the password are empty 
        e.preventDefault(); // prevent the defult behaviour which is reload the page and sent the info to the server 
        Swal.fire({ // USING THE SWEETALERT2 LIBRARY (I COPY THE FUNCTION FROM THE WEBSITE BUT CHANGE THE VALUES)
            icon: 'error',
            title: 'Missing fields',
            text: 'Please enter both your email and password.',
            confirmButtonColor: '#C8714A'
        });
    }
});


//sign in validation 
document.querySelector('form').addEventListener('submit', function (e) {
    // got all the data the user input (name , email , password , password )
    const name = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirm-password').value;

    if (!name || !email || !pass || !confirm) { // any value is empty 
        e.preventDefault(); // prevent the defult behaviour which is reload the page and sent the info to the server 
        Swal.fire({
            icon: 'error',
            title: 'Missing fields',
            text: 'Please fill in all fields.',
            confirmButtonColor: '#C8714A'
        });
        return;
    }

    if (pass !== confirm) { // IF THE PASSWORD THE USER ENTER IN THE FIRST FIELS DOESNT MATCH THE ONE IN THE SEC FIELD 
        e.preventDefault();
        Swal.fire({
            icon: 'error',
            title: 'Passwords don\'t match', // CHANGED THE TITLE AMD THE TEXT 
            text: 'Make sure both password fields are identical.',
            confirmButtonColor: '#C8714A'
        });
    }
});