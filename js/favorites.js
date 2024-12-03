document.addEventListener('DOMContentLoaded', function(){
    fetch('header.html')
        .then(res => res.text())
        .then(data => {
            document.querySelector('body').insertAdjacentHTML('afterbegin', data);
        })
        .catch(err => console.error('Error al cargar el header:', err));
})

window.addEventListener('load', () =>{
    const listFavorites = document.querySelector('.list-favorites');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    console.log(favorites)

    if (favorites.legth === 0){
        listFavorites.innerHTML = `<p>No tienes favoritos</p>`;
    }else{
        favorites.forEach(movie => {
            const movieElement = document.createElement('div')
            movieElement.classList.add('card-favorite');
            console.log(movie.title)
            movieElement.innerHTML = `<h3>${movie.title}</h3>
            `
            listFavorites.appendChild(movieElement)
        })
    }
})