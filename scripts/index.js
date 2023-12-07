document.addEventListener('DOMContentLoaded', function() {
    const professionalsList = document.getElementById('professional-list');
    const filterForm = document.getElementById('filter-form');
    const professionSelect = document.getElementById('profession');

    function loadProfessionals() {
        let professionals = localStorage.getItem('professionals');
        if (professionals) {
            professionals = JSON.parse(professionals);
            fetchRandomUserImages(professionals);  
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
                fetchRandomUserImages(data);  
            } else {
                console.error('Error fetching data:', xhr.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Request error...');
        };
        xhr.send();
    }

    function fetchRandomUserImages(professionals) {
        const numberOfProfessionals = professionals.length;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://randomuser.me/api/?results=${numberOfProfessionals}`, true);
        xhr.onload = function() {
            if (this.status === 200) {
                const usersData = JSON.parse(this.responseText);
                const userImages = usersData.results.map(user => user.picture.large);
                renderProfessionals(professionals, userImages);
            } else {
                console.error('Error fetching random user images:', xhr.statusText);
                renderProfessionals(professionals, []);
            }
        };
        xhr.onerror = function() {
            console.error('Request error...');
            renderProfessionals(professionals, []);
        };
        xhr.send();
    }
    
    function renderProfessionals(professionals, userImages) {
        professionalsList.innerHTML = '';
        professionals.forEach((professional, index) => {
            const imageUrl = userImages[index] || 'path/to/default/image.jpg'; // Fallback to default image
            const professionalCard = createProfessionalCard(professional, imageUrl);
            professionalsList.appendChild(professionalCard);
        });
    }

    function createProfessionalCard(professional, imageUrl) {
        const card = document.createElement('div');
        card.className = 'professional-card';
    
        const defaultImage = imageUrl || 'path/to/default/image.jpg'; 
    
        card.innerHTML = `
            <img class="imgUser" src="${defaultImage}" alt="Profile Image" class="profile-image">
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
        alert(`View details for professional ID: ${professionalId}`);
    };

    loadProfessionals();
});
