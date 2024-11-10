document.addEventListener('DOMContentLoaded', function() {
    // Resalta la sección activa en la navegación cuando el usuario hace clic
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Alerta de sitio en construcción al hacer clic en el texto
    const constructionAlert = document.querySelector('.sitio-construccion');
    constructionAlert.addEventListener('click', () => {
        alert('Este sitio está en construcción.');
    });
});

// Función para realizar la búsqueda de encuestas
function buscarEncuesta() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Limpiar resultados anteriores

    fetch(`http://localhost:3000/buscar?termino=${query}`)
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
