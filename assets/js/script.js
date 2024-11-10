// Elimina la detección de entorno y usa una URL relativa para Vercel
const baseUrl = '';

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    const constructionAlert = document.querySelector('.sitio-construccion');
    constructionAlert.addEventListener('click', () => {
        alert('Este sitio está en construcción.');
    });
});

function buscarEncuesta() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Limpiar resultados anteriores

    fetch(`${baseUrl}/buscar?termino=${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                data.forEach(encuesta => {
                    const p = document.createElement('p');
                    p.textContent = encuesta['Nombre de la encuesta'];
                    resultsDiv.appendChild(p);
                });
            } else {
                resultsDiv.innerHTML = '<p>No se encontraron resultados.</p>';
            }
        })
        .catch(error => {
            console.error('Error al realizar la búsqueda:', error);
            resultsDiv.innerHTML = '<p>Hubo un error en la búsqueda.</p>';
        });
}
