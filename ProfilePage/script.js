
const pfpInput = document.getElementById('pfpUpload');
const pfpImg = document.querySelector('.pfpImg');

pfpInput.addEventListener('change', function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imageData = e.target.result;

            pfpImg.src = imageData;

            // save the image
            localStorage.setItem("userPFP", imageData);
        };

        reader.readAsDataURL(file);
    }
});

// THIS PART TO USE THE SWEETALERT library when user log out (a pop up to confirm) 
document.getElementById('logoutBtn').addEventListener('click', function() {
    Swal.fire({
        title: 'Log out?',
        text: 'You will be returned to the login page.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#C8714A',
        cancelButtonColor: '#DDD0C5',
        confirmButtonText: 'Yes, log out',
        cancelButtonText: 'Cancel'
    }).then(function(result) { // if the user click in the confirm button 
        if (result.isConfirmed) {
            window.location.href = '../AuthPage/login.html';
        }
    });
});