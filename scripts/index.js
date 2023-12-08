document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.image-slider .slider-content');
    let currentSlide = 0;
    const interval = 5000; // 5 seconds

    function nextSlide() {
        slides[currentSlide].style.opacity = 0;
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].style.opacity = 1;
    }

    slides[currentSlide].style.opacity = 1;
    setInterval(nextSlide, interval);
});

const professionalsList = document.getElementById("professional-list");
const filterForm = document.getElementById("filter-form");
const professionSelect = document.getElementById("profession");
const logoutButton = document.getElementById('logout-btn');
    const currentUser = JSON.parse(localStorage.getItem('CurrentUser'));

    logoutButton.style.display = 'block';

    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('CurrentUser');
        alert('You have been logged out.');
        window.location.href = 'home.html'; 
    });

    

function loadProfessionals() {
    let professionals = localStorage.getItem("professionals");
    if (professionals) {
        professionals = JSON.parse(professionals);
        filterOptions(professionals);
        renderProfessionals(professionals);
    } else {
        fetchProfessionals();
    }
}

function fetchProfessionals() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "../data/workers.json", true);
    xhr.onload = function () {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText);
            fetchRandomUserImages(data)  // Pass the entire data array
                .then(userImages => {
                    const updatedProfessionals = data.map((professional, index) => ({
                        ...professional,
                        imageUrl: userImages[index]
                    }));
                    localStorage.setItem("professionals", JSON.stringify(updatedProfessionals));
                    filterOptions(updatedProfessionals);
                    renderProfessionals(updatedProfessionals);
                })
                .catch(error => {
                    console.error("Error fetching user images:", error);
                    renderProfessionals(data); 
                });
        } else {
            console.error("Error fetching data:", xhr.statusText);
        }
    };
    xhr.onerror = function () {
        console.error("Request error...");
    };
    xhr.send();
}

function filterOptions(professionals) {
    const professionSet = new Set(professionals.map((p) => p.profession));
    professionSelect.innerHTML = '<option value="">Any</option>';
    professionSet.forEach((profession) => {
        const option = document.createElement("option");
        option.value = profession;
        option.textContent = profession;
        professionSelect.appendChild(option);
    });
}

function renderProfessionals(professionals) {
    professionalsList.innerHTML = "";
    professionals.forEach(professional => {
        const professionalCard = createProfessionalCard(professional, professional.imageUrl);
        professionalsList.appendChild(professionalCard);
    });
}

function fetchRandomUserImages(professionals) {
    return Promise.all(professionals.map(professional => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `https://randomuser.me/api/?gender=${professional.gender}`, true);
            xhr.onload = function () {
                if (this.status === 200) {
                    const userData = JSON.parse(this.responseText);
                    resolve(userData.results[0].picture.large);
                } else {
                    reject("Failed to fetch user image");
                }
            };
            xhr.onerror = function () {
                reject("Network error occurred");
            };
            xhr.send();
        });
    }));
}


function createProfessionalCard(professional, imageUrl = "../media/image.jpg") {
    const card = document.createElement("div");
    card.className = "professional-card";
    card.innerHTML = `
        <img class="imgUser" src="${imageUrl}" alt="Profile Image">
        <h3>${professional.name}</h3>
        <p><i class="fa-solid fa-user-tie"></i> Profession: ${professional.profession}</p>
        <p>Experience: ${professional.experience}</p>
        <p><i class="fa-solid fa-star"></i> Rating: ${professional.reviews} / 5</p>
        <p>Rate: $${professional.price}/${professional.priceUnit}</p>
        <p>Availability: ${professional.availability}</p>
        <button onclick="viewProfessionalDetails('${professional.id}')">View Details</button>
    `;
    return card;
}

function filterProfessionals(event) {
    event.preventDefault();
    const selectedProfession = professionSelect.value;
    let professionals = JSON.parse(localStorage.getItem("professionals")) || [];
    const filteredData = selectedProfession ? 
        professionals.filter(professional => professional.profession === selectedProfession) : 
        professionals;
    renderProfessionals(filteredData);
}

filterForm.addEventListener("submit", filterProfessionals);

window.viewProfessionalDetails = function (professionalId) {
    window.location.href = `worker.html?id=${professionalId}`;
};

loadProfessionals();

