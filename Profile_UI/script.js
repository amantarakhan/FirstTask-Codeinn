
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
