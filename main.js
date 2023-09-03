// main.js

const apiKey = 'a94584e0'; // Replace with your OMDB API key

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const favoritesList = document.getElementById('favoritesList');

let favorites = [];

// Function to display search results
function displayResults(results) {
    searchResults.innerHTML = '';

    results.forEach((movie) => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');

        resultItem.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title} (${movie.Year})</h3>
            <p>${movie.Plot}</p>
            <button class="add-favorite">Add to Favorites</button>
        `;

        const addFavoriteBtn = resultItem.querySelector('.add-favorite');
        addFavoriteBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent parent click
            addToFavorites(movie);
        });

        // Open movie details when clicking on the result
        resultItem.addEventListener('click', () => displayMovieDetails(movie));

        searchResults.appendChild(resultItem);
    });
}

// Function to add a movie to favorites
function addToFavorites(movie) {
    if (!favorites.includes(movie)) {
        favorites.push(movie);
        updateFavoritesList();
        saveFavoritesToLocalStorage(); // Save favorites to local storage
    }
}

// Function to update the favorites list
function updateFavoritesList() {
    favoritesList.innerHTML = '';

    favorites.forEach((movie) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${movie.Title} (${movie.Year}) <button class="remove-favorite">Remove</button>`;
        const removeBtn = listItem.querySelector('.remove-favorite');
        removeBtn.addEventListener('click', () => removeFromFavorites(movie));
        favoritesList.appendChild(listItem);
    });
}

// Function to remove a movie from favorites
function removeFromFavorites(movie) {
    favorites = favorites.filter((fav) => fav !== movie);
    updateFavoritesList();
    saveFavoritesToLocalStorage(); // Save favorites to local storage
}

// Function to display detailed movie information in a new page
async function displayMovieDetails(movie) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
        const data = await response.json();

        const movieDetailsWindow = window.open('', '_blank');
        if (movieDetailsWindow) {
            movieDetailsWindow.document.write(`
                <html>
                <head>
                    <title>${data.Title}</title>
                    <link rel="stylesheet" href="styles.css">
                </head>
                <body>
                    <h1>${data.Title} (${data.Year})</h1>
                    <img src="${data.Poster}" alt="${data.Title} Poster">
                    <p><strong>Plot:</strong> ${data.Plot}</p>
                    <!-- You can add more movie details here -->
                </body>
                </html>
            `);
            movieDetailsWindow.document.close();
        } else {
            alert('Popup blocked. Please allow popups for this site to view movie details.');
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Function to save favorites to local storage
function saveFavoritesToLocalStorage() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Function to load favorites from local storage
function loadFavoritesFromLocalStorage() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
        favorites = JSON.parse(storedFavorites);
        updateFavoritesList();
    }
}

// Function to search for movies
async function searchMovies() {
    const searchTerm = searchInput.value;
    if (searchTerm) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${apiKey}`);
            const data = await response.json();
            if (data.Search) {
                displayResults(data.Search);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

// Event listener for search input
searchInput.addEventListener('input', searchMovies);

// Load favorites from local storage when the page loads
loadFavoritesFromLocalStorage();

// Initialize the app
updateFavoritesList();
