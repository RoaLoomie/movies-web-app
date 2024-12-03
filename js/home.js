document.addEventListener('DOMContentLoaded', function () {
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        document.querySelector('body').insertAdjacentHTML('afterbegin', data);
      })
      .catch(err => console.error('Error al cargar el header:', err));
  });
  