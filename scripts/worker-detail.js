document.addEventListener('DOMContentLoaded', function() {
    const professionalDetails = document.getElementById('professional-details');
    const orderNowButton = document.getElementById('order-now');
    const params = new URLSearchParams(window.location.search);
    const professionalId = params.get('id');

    // Function to fetch professional details
    function fetchProfessionalDetails(id) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '../data/workers.json', true);
        xhr.onload = function() {
            if (this.status === 200) {
                const professionals = JSON.parse(this.responseText);
                const professional = professionals.find(p => p.id === id);
                if (professional) {
                    displayProfessionalDetails(professional);
                } else {
                    console.error('Professional not found');
                    professionalDetails.innerHTML = '<p>Professional details not available.</p>';
                }
            } else {
                console.error('Error fetching professional details:', xhr.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Network error occurred');
        };
        xhr.send();
    }

    // Function to display professional details
    function displayProfessionalDetails(professional) {
        professionalDetails.innerHTML = `
            <img src="${professional.imageUrl}" alt="Profile Image">
            <h2>${professional.name}</h2>
            <p>Profession: ${professional.profession}</p>
            <p>Experience: ${professional.experience}</p>
            <p>Rating: ${professional.reviews} / 5</p>
            <p>Rate: $${professional.price}/${professional.priceUnit}</p>
            <p>Availability: ${professional.availability}</p>
            <p>${professional.bio}</p>
            <!-- Add any other details you want to include -->
        `;
    }

    // Event listener for 'Order Now' button
    orderNowButton.addEventListener('click', function() {
        const userLoggedIn = localStorage.getItem('userData');
        if (userLoggedIn) {
            alert('Proceeding to order...');
            // Add additional logic for the ordering process
        } else {
            window.location.href = 'register.html';
        }
    });

    fetchProfessionalDetails(professionalId);
});
