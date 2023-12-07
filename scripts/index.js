document.addEventListener('DOMContentLoaded', function() {
    const professionalsList = document.getElementById('professional-list');
    const filterForm = document.getElementById('filter-form');
    const professionSelect = document.getElementById('profession');

    function loadProfessionals() {
        let professionals = localStorage.getItem('professionals');
        if (professionals) {
            professionals = JSON.parse(professionals);
            populateFilterOptions(professionals);
            renderProfessionals(professionals);
        } else {
            fetchProfessionals();
        }
    }

    function fetchProfessionals() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '../data/workers.json', true);
        xhr.onload = function() {
            if (this.status === 200) {
                const data = JSON.parse(this.responseText);
                localStorage.setItem('professionals', this.responseText);
                populateFilterOptions(data);
                renderProfessionals(data);
            } else {
                console.error('Error fetching data:', xhr.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Request error...');
        };
        xhr.send();
    }

    function populateFilterOptions(professionals) {
        const professionSet = new Set(professionals.map(p => p.profession));
        professionSelect.innerHTML = '<option value="">Any</option>';
        professionSet.forEach(profession => {
            const option = document.createElement('option');
            option.value = profession;
            option.textContent = profession;
            professionSelect.appendChild(option);
        });
    }    


    function renderProfessionals(professionals) {
        fetchRandomUserImages(professionals.length)
            .then(userImages => {
                professionalsList.innerHTML = '';
                professionals.forEach((professional, index) => {
                    const imageUrl = userImages[index];
                    const professionalCard = createProfessionalCard(professional, imageUrl);
                    professionalsList.appendChild(professionalCard);
                });
            })
            .catch(error => {
                console.error('Error fetching user images:', error);
                // Fallback: Render professionals without images
                professionalsList.innerHTML = '';
                professionals.forEach(professional => {
                    const professionalCard = createProfessionalCard(professional);
                    professionalsList.appendChild(professionalCard);
                });
            });
    }

   function fetchRandomUserImages(count) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://randomuser.me/api/?results=${count}`, true);
        xhr.onload = function() {
            if (this.status === 200) {
                const usersData = JSON.parse(this.responseText);
                const userImages = usersData.results.map(user => user.picture.large);
                resolve(userImages);
            } else {
                reject('Failed to fetch user images');
            }
        };
        xhr.onerror = function() {
            reject('Network error occurred');
        };
        xhr.send();
    });
}

function createProfessionalCard(professional, imageUrl = '../media/image.jpg') {
    const card = document.createElement('div');
    card.className = 'professional-card';
    card.innerHTML = `
        <img class="imgUser" src="${imageUrl}" alt="Profile Image" class="profile-image">
        <h3>${professional.name}</h3>
        <p>Profession: ${professional.profession}</p>
        <p>Experience: ${professional.experience}</p>
        <p>Rating: ${professional.reviews} / 5</p>
        <p>Rate: $${professional.price}/${professional.priceUnit}</p>
        <p>Availability: ${professional.availability}</p>
        <button onclick="viewProfessionalDetails('${professional.id}')">View Details</button>
    `;
    return card;
}
    
    function filterProfessionals(event) {
        event.preventDefault();
        const selectedProfession = professionSelect.value;
        const professionals = JSON.parse(localStorage.getItem('professionals')) || [];
        const filteredData = selectedProfession ?
            professionals.filter(professional => professional.profession === selectedProfession) : 
            professionals;
        renderProfessionals(filteredData);
    }

    filterForm.addEventListener('submit', filterProfessionals);

    window.viewProfessionalDetails = function(professionalId) {
        window.location.href = `worker.html?id=${professionalId}`;
    };
    

    loadProfessionals();
});
