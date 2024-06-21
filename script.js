const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image_gallery");
const showMore = document.getElementById('generate-btn');

const APIkey = 'ijHGt6otE47DYYVDhMPvlHjW_6y_7gd7iZ_0kCM23ro';
let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img_card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download_btn");

        const aiGeneratedImg = imgObject.urls.small;
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}

let page = 1;
const generateAiImages = async (userPrompt, userImgQuantity) => {
    let keyword = userPrompt;

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${APIkey}&per_page=${userImgQuantity}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const fetchedData = await response.json();
        const results = fetchedData.results;

        updateImageCard(results);
    } catch (error) {
        console.error('Error fetching images:', error);
    } finally {
        isImageGenerating = false;
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();
    page = 1;

    if (isImageGenerating) return;
    isImageGenerating = true;

    // Get user input and image quantity values from the form
    const userPrompt = e.target.elements[0].value;
    const userImgQuantity = e.target.elements[1].value;
    console.log(userPrompt, userImgQuantity);

    // Creating HTML markup for image cards with loading state
    const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
        `<div class="img_card loading">
            <img src="Images/loader.svg" alt="image">
            <a href="#" class="download_btn">
                <img src="images/download.svg" alt="download icon">
            </a>
        </div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}
// showMore.addEventListener('click', () => {
//     page++;
//     generateAiImages(userPrompt, userImgQuantity);
// })

generateForm.addEventListener("submit", handleFormSubmission);
