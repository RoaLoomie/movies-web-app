import {API_KEY} from '../config/config.js'

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `${API_KEY}`
    }
  };
const genreList = document.querySelector('.genre-list')
const dropdownToggle = document.querySelector('.dropdown-toggle');

dropdownToggle.addEventListener('click', event =>{
  event.preventDefault()
  genreList.classList.toggle('show');
})

fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
  .then(res => res.json())
  .then(data => {
    data.genres.forEach(genre => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${genre.id}`
        link.textContent = genre.name;
        listItem.appendChild(link);
        genreList.appendChild(listItem);
    });
  })
  .then(res => console.log(res))
  .catch(err => console.error(err));

genreList.addEventListener('click', (event) => {
    const genreId = event.target.href.split('#')[1]
    if (genreId){
        currentGenreId = genreId;
        currentPage = 1;
        getMoviesByGenre(genreId, currentPage)
    }
});

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
          updatePaginationButtons();
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

