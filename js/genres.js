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
              genreImage = movieData.results[3].poster_path;
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
          
          genreCard.addEventListener('click', (event) => {
            const genreId =genre.id;
            if (genreId){
                currentGenreId = genreId;
                currentPage = 1;
                getMoviesByGenre(currentGenreId, currentPage)
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
const titulo = document.querySelector('.titulo')

function getMoviesByGenre(genreId, page) {
    fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=${page}`, options)
    .then(res => res.json())
    .then(data => {
        titulo.innerHTML = '';
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
            const releaseDate = document.createElement('p')
            const favorite = document.createElement('i')
            favorite.classList.add('fa-regular', 'fa-heart');
            if (favorites.some(fav => {
                return fav.id === movie.id
            })){
              favorite.classList.add('favorite');
          }
            favorite.addEventListener('click', () => addToFavorite(movie, favorite))

            poster.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
            poster.alt = movie.title;
    
            title.textContent = movie.title;
            const releaseData = new Date(movie.release_date);
            const year = releaseData.getFullYear();
            releaseDate.textContent = year
          
            posterContainer.appendChild(poster)
            movieDetails.appendChild(title)
            movieDetails.appendChild(releaseDate)
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



const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
const addToFavorite = (movie, icon) => {
  const index = favorites.findIndex(fav => fav.id === movie.id)
  if (index === -1){
    favorites.push(movie)
    icon.classList.add('favorite')
}else{
  favorites.splice(index, 1)
  icon.classList.remove('favorite'); 
}
 localStorage.setItem('favorites', JSON.stringify(favorites))
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

