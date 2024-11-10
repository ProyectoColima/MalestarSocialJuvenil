const baseUrl = '/api';

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Eliminamos el listener de construcción ya que ya no es necesario
});

function buscarEncuesta() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Limpiar resultados anteriores

    fetch(`${baseUrl}/buscar?termino=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const excludeFields = ['ID', 'Fecha de registro', 'Quién registró la encuesta', 'Última actualización'];
                data.forEach(encuesta => {
                    // Crear una tarjeta para cada encuesta
                    const card = document.createElement('div');
                    card.classList.add('card', 'mb-3', 'shadow-sm');

                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    // Crear la tabla
                    const table = document.createElement('table');
                    table.classList.add('table', 'table-striped', 'table-bordered', 'table-hover');

                    const tbody = document.createElement('tbody');

                    for (const key in encuesta) {
                        if (encuesta.hasOwnProperty(key) && !excludeFields.includes(key)) {
                            const tr = document.createElement('tr');
                            
                            const th = document.createElement('th');
                            th.textContent = key;
                            tr.appendChild(th);
                            
                            const td = document.createElement('td');
                            td.textContent = encuesta[key];
                            tr.appendChild(td);
                            
                            tbody.appendChild(tr);
                        }
                    }

                    table.appendChild(tbody);
                    cardBody.appendChild(table);
                    card.appendChild(cardBody);
                    resultsDiv.appendChild(card);
                });
            } else {
                resultsDiv.innerHTML = '<p class="text-center">No se encontraron resultados.</p>';
            }
        })
        .catch(error => {
            console.error('Error al realizar la búsqueda:', error);
            resultsDiv.innerHTML = '<p class="text-center text-danger">Hubo un error en la búsqueda.</p>';
        });
}

// Código para enviar el formulario de contacto
document.getElementById('contactForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;

    try {
        const response = await fetch(`${baseUrl}/sendEmail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, mensaje }),
        });

        const result = await response.json();
        if (result.success) {
            alert('Mensaje enviado con éxito.');
            document.getElementById('contactForm').reset(); // Limpiar formulario
        } else {
            alert('Error al enviar el mensaje. Inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Hubo un error al enviar el mensaje.');
    }
});  
