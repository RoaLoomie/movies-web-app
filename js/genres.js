import {API_KEY} from './config/config.js'

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `${API_KEY}`
  }
};

document.addEventListener('DOMContentLoaded', function () {
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.querySelector('body').insertAdjacentHTML('afterbegin', data);
        loadGenres()
      
    })
   .catch(err => console.error('Error al cargar el header:', err));
});

const genreList = document.querySelector('.genres-container');

function loadGenres(){
  fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    .then(res => res.json())
    .then(data => {
      data.genres.forEach(genre => {
        const genreCard = document.createElement('div');
        genreCard.classList.add('genre-card')

        const genrePoster = document.createElement('div');
        genrePoster.classList.add('genre-poster')

        const link = document.createElement('a');
        link.href = `#${genre.id}`
        link.textContent = genre.name;

        fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genre.id}&language=en-US&page=1`, options)
          .then(res => res.json())
          .then(movieData =>{
            let genreImage = 'default.jpg';

            if (movieData && movieData.results && movieData.results.length > 0) {
              genreImage = movieData.results[3].poster_path; // Tomar la imagen de la primera película
            }
            const genreImageElement = document.createElement('img');
            genreImageElement.src = `https://image.tmdb.org/t/p/w300${genreImage}`;
            genreImageElement.alt = genre.name;
            genreImageElement.classList.add('genre-image');

            genrePoster.appendChild(genreImageElement)
            genreCard.appendChild(genrePoster);
            genreCard.appendChild(link);
          })  
          .catch(err => console.log(err))
          genreList.appendChild(genreCard);
          genreList.addEventListener('click', (event) => {
            const genreId = event.target.href.split('#')[1]
            if (genreId){
                currentGenreId = genreId;
                currentPage = 1;
                getMoviesByGenre(genreId, currentPage)
            }
        });
      });
    })
    .catch(err => console.error(err));
  }

let currentPage = 1;
let moviesPerPage = 20;
let totalResults = 0;
let currentGenreId = null;

const movieList = document.querySelector('.movies-container')

function getMoviesByGenre(genreId, page) {
    fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=${page}`, options)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        genreList.innerHTML = '';
        movieList.innerHTML = '';
        totalResults = data.total_results

        data.results.forEach((movie) =>{
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-card');
            const posterContainer = document.createElement('div');
            posterContainer.classList.add('poster-movie');
            const movieDetails = document.createElement('div');
            movieDetails.classList.add('movie-details');

            const title = document.createElement('h2');
            const poster = document.createElement('img');
            const releaseData = document.createElement('p')
            const favorite = document.createElement('i')
            favorite.classList.add('fa-regular', 'fa-heart')

            poster.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
            poster.alt = movie.title;
    
            title.textContent = movie.title;
            releaseData.textContent = movie.release_date;
          
            posterContainer.appendChild(poster)
            movieDetails.appendChild(title)
            movieDetails.appendChild(releaseData)
            movieDetails.appendChild(favorite)
            movieItem.appendChild(posterContainer)
            movieItem.appendChild(movieDetails)
            movieList.appendChild(movieItem)
       }) 
       const paginationContainer = document.getElementById('pagination');
       if (paginationContainer) {
          paginationContainer.style.display = 'flex'; 
          pagination.classList.toggle('show')
          updatePaginationButtons();
       }
    })
    .catch(err => console.error(err))
}


function updatePaginationButtons(){
  const totalPages = Math.ceil(totalResults / moviesPerPage);
  document.getElementById('prevBtn').disabled = currentPage === 1;
  document.getElementById('nextBtn').disabled = currentPage === totalPages;
}
function changePage(direction){
  currentPage += direction;
  if (currentPage < 1) {
    currentPage = 1; 
}
  getMoviesByGenre(currentGenreId, currentPage)
}

document.getElementById('prevBtn').addEventListener('click', () => changePage(-1));
document.getElementById('nextBtn').addEventListener('click', () => changePage(1));

