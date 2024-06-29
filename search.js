const API_KEY = '993b7186';

document.getElementById('search-button').addEventListener('click', fetchMovies);
document.getElementById('clr-filters-btn').addEventListener('click', clearFilters);
document.getElementById('movie-title').addEventListener('input', fetchRecommendations);

function fetchMovies() {
    const title = document.getElementById('movie-title').value;
    const year = document.getElementById('release-year').value;

    let url = `http://www.omdbapi.com/?i=tt3896198&apikey=${API_KEY}`;
    if (title) url += `&t=${title}`;
    if (year) url += `&y=${year}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data);
            if (data.Response === 'True') {
                clearRecommendations();
                displayMovies([data]);
            } else {
                displayError(data.Error);
            }
        })
        .catch(error => {
            displayError(error.message);
        });
}

function fetchRecommendations() {
    const title = document.getElementById('movie-title').value;
    if (!title) {
        clearRecommendations();
        return;
    }

    const url = `http://www.omdbapi.com/?s=${title}&apikey=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Recommendations Response:", data);
            if (data.Response === 'True') {
                displayRecommendations(data.Search);
            } else {
                clearRecommendations();
            }
        })
        .catch(error => {
            console.error("Recommendations fetch error:", error);
            clearRecommendations();
        });
}

function fetchPoster(movie) {
    let posterUrl = `https://img.omdbapi.com/?t=${movie.Title}&apikey=${API_KEY}`; 

    fetch(posterUrl)
        .then(response => response.json())
        .then(posterData => {
            if (posterData.Response === 'True') {
                movie.Poster = posterData.Poster;
            }
            displayMovies([movie]);
        })
        .catch(error => {
            console.error("Poster fetch error:", error);
            displayMovies([movie]); 
        });
}

function displayMovies(movies) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';

    movies.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.classList.add('movie-item');
        listItem.innerHTML = `
            
            
            <div class="movie-info">
            <h2>${movie.Title} (${movie.Year})</h2>  
            <p>TYPE : ${movie.Type}</p>
            <p>ACTORS : ${movie.Actors}</p>
            <p>GENRE : ${movie.Genre.split(', ').map(genre => `<span class="genre">${genre}</span>`).join('')}</p>
            <p>LANGUAGE : ${movie.Language}</p>
            <p>PRODUCTION COUNTRY : ${movie.Country}</p>
            <div class="plot-section">
                    <p class="plot-label">PLOT</p>
                    <p class="plot-text">${movie.Plot}</p>
                </div>
            <p>DIRECTOR : ${movie.Director}</p>
            <p>IMDB RATING : ${movie.imdbRating}</p>
            <p>AWARDS : ${movie.Awards}</p>
            </div>
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "images/default.jpg"}" alt="${movie.Title}">
        `;
        movieList.appendChild(listItem);
    });
}

function displayRecommendations(movies) {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '';

    movies.forEach(movie => {
        const listItem = document.createElement('div');
        listItem.classList.add('recommendation-item');
        listItem.innerHTML = `
            <h3>${movie.Title} (${movie.Year})</h3>
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "images/default.jpg"}" alt="${movie.Title}">
        `;
        listItem.addEventListener('click', () => {
            document.getElementById('movie-title').value = movie.Title;
            fetchMovies();
            clearRecommendations();
        });
        recommendationsDiv.appendChild(listItem);
    });
}

function clearRecommendations() {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '';
}

function displayError(message) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = `<li class="error">${message}</li>`;
}

function clearFilters() {
    document.getElementById('movie-title').value = '';
    document.getElementById('release-year').value = '';

    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';
    clearRecommendations();
}