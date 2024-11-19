const contenedor = document.getElementById('principal');
const boton = document.getElementById('mode');
const formulario = document.getElementById('formulario');
const usuarioInput = document.getElementById("usuario");
const contrasenaInput = document.getElementById("contrasenaIngreso");
const mensajeError = document.getElementById('mensajeError');
const cerrarSesionBtn = document.getElementById('cerrarSesion');
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total');
const borrarCarritoBtn = document.getElementById('borrar-carrito');
const confirmarCompraBtn = document.getElementById('confirmar-compra');
const librosSection = document.getElementById('libros');
const listaLibros = document.getElementById('lista-libros');

let usuariosPrefijados = [
    { nombre: "marcelo", contrasena: "perez" },
    { nombre: "juan", contrasena: "lopez" },
    { nombre: "pedro", contrasena: "garcia"}
];

let usuariosNuevos = JSON.parse(localStorage.getItem('usuarios')) || [];
let usuarios = [...usuariosPrefijados, ...usuariosNuevos];

let usuarioActual = null; // Variable para almacenar el usuario actual

const pasarADark = () => {
    localStorage.setItem('mode', 'dark');
    boton.innerText = 'Light Mode';
    contenedor.classList.replace('light', 'dark');
    document.body.className = 'dark';
};

const pasarALight = () => {
    localStorage.setItem('mode', 'light');
    boton.innerText = 'Dark Mode';
    contenedor.classList.replace('dark', 'light');
    document.body.className = 'light';
};

const borrarCampo = () => {
    formulario.reset();
};

const validarIngreso = () => {
    const usuario = usuarioInput.value.trim().toLowerCase();
    const contrasena = contrasenaInput.value.trim();

    if (!usuario || !contrasena) { // Verificar si el usuario o contraseñas no fueron completados
        alert('Debe ingresar un usuario y una contraseña.');
        return;
    }

    let intentos = parseInt(localStorage.getItem('intentos')) || 0;

    const usuarioValido = usuarios.find(user => user.nombre === usuario && user.contrasena === contrasena);
    
    if (usuarioValido) {
        alert('¡Bienvenido ' + usuarioValido.nombre + '!');
        intentos = 0; 
        localStorage.setItem('intentos', intentos);
        mensajeError.textContent = ''; 
        usuarioActual = usuarioValido; // Asignar el usuario actual
        renderizarProductos(productos); //  se cargan productos después de iniciar sesión
        cerrarSesionBtn.style.display = 'inline-block';
    } else {
        intentos++;
        localStorage.setItem('intentos', intentos);
        mensajeError.textContent = 'Usuario y/o contraseña incorrecta.';
        if (intentos >= 3) {
            mensajeError.textContent = 'Ha excedido el número máximo de intentos.';
            document.getElementById('solicitarIngreso').disabled = true; 
        }
    }
};

const registrarUsuario = (event) => {
    event.preventDefault(); 

    const nombre = document.getElementById('nombre').value.trim();
    const contrasena = document.getElementById('contrasenaSuscripcion').value.trim();

    if (!nombre || !contrasena) { // Controla si el nombre o la contraseña están sin completar.
        alert('Debe ingresar un nombre y una contraseña.');
        return;
    }

    usuariosNuevos.push({ nombre, contrasena });
    localStorage.setItem('usuarios', JSON.stringify(usuariosNuevos));

    alert('¡Te has registrado correctamente!');
    borrarCampo();
};

const renderizarProductos = (listaProds) => {
    const contenedorProds = document.getElementById("misprods");
    contenedorProds.innerHTML = ''; 

    for(const prod of listaProds) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.style.width = '18rem';
        card.innerHTML = `
            <img class="card-img-top" src=${prod.foto} alt=${prod.nombre}>
            <div class="card-body">
                <h5 class="card-title">${prod.nombre}</h5>
                <p class="card-text">Precio: $ ${prod.precio}</p>
                <button class="btn btn-primary" onclick="agregarAlCarrito('${prod.nombre}', ${prod.precio})">Añadir al carrito</button>
            </div>
        `;
        contenedorProds.appendChild(card);
    }
};

const agregarAlCarrito = (nombre, precio) => {
    const itemCarrito = document.createElement('li');
    itemCarrito.textContent = `${nombre} - $${precio}`;
    listaCarrito.appendChild(itemCarrito);
    let total = parseFloat(totalCarrito.textContent.split(':')[1].trim().substr(1)); 

    total += parseFloat(precio); 

    totalCarrito.textContent = `Total: $${total.toFixed(2)}`; 

    const historialCarrito = JSON.parse(localStorage.getItem('historialCarrito')) || [];
    historialCarrito.push({ nombre, precio });
    localStorage.setItem('historialCarrito', JSON.stringify(historialCarrito));
};

const borrarCarrito = () => {
    listaCarrito.innerHTML = ''; 
    totalCarrito.textContent = 'Total: $0.00';
    localStorage.removeItem('historialCarrito');
};

const confirmarCompra = () => {
    if (!listaCarrito.firstChild) { // Verificar si al carrito no se cargaron accesorios
        alert('No ha agregado ningún producto al carrito.');
        return;
    }

    Swal.fire({
        title: 'Confirmar compra',
        text: '¿Estás seguro de confirmar la compra?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '¿Desea leer un libro mientras espera la colocación de sus accesorios?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, ver libros',
                cancelButtonText: 'No, continuar'
            }).then((result) => {
                if (result.isConfirmed) {
                    mostrarLibros(); // llamamos a la función para mostrarLibros 
                }
            });
        }
        borrarCarrito();
    });
};

const cerrarSesion = () => {
    localStorage.removeItem('usuarioActual');
    cerrarSesionBtn.style.display = 'none';
};

const cargarHistorialCarrito = () => {
    const historialCarrito = JSON.parse(localStorage.getItem('historialCarrito')) || [];

    historialCarrito.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nombre} - $${item.precio}`;
        listaCarrito.appendChild(li);
    });

    const total = historialCarrito.reduce((acc, curr) => acc + parseFloat(curr.precio), 0);
    totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
};

const cargarModoColor = () => {
    const modoColor = localStorage.getItem('mode');
    if (modoColor === 'dark') {
        pasarADark();
    } else {
        pasarALight();
    }
};

const mostrarLibros = () => {
    fetch('https://hapi-books.p.rapidapi.com/nominees/romance/2020', {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'fee4d31b9amsh74d45860ac7573dp1ccda3jsn1d80b9c63010',
            'X-RapidAPI-Host': 'hapi-books.p.rapidapi.com'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener libros');
        }
        return response.json();
    })
    .then(data => {
        const listaLibros = data;
        const librosContainer = document.getElementById('lista-libros');

        // cree la tabla
        const tabla = document.createElement('table');

        // Contador para controlar el número de libros por fila
        let contadorLibros = 0;

        listaLibros.forEach(libro => {
            if (contadorLibros === 0) {
                // Cree una nueva fila al comienzo de la línea
                const fila = document.createElement('tr');
                tabla.appendChild(fila);
            }

            // Cree una celda para el libro
            const celda = document.createElement('td');
            // Cree la imagen
            const imagen = document.createElement('img');
            imagen.src = libro.cover;
            imagen.alt = libro.name;
            imagen.classList.add('imagen-libro'); // agregue la clase CSS a la imagen

            // Cree un avento al hacer click en la imagen
            imagen.addEventListener('click', () => {
                Swal.fire('Un asesor le entregará el libro.');
            });

            // Se agrega la imagen a la celda
            celda.appendChild(imagen);
            // Se agrega la celda a la fila actual
            tabla.lastElementChild.appendChild(celda);

            // Incremente  el contador de libros
            contadorLibros++;

            // Si el contador alcanza 4, reiniciar para comenzar una nueva fila
            if (contadorLibros === 4) {
                contadorLibros = 0;
            }
        });

        // Agregue la tabla al contenedor de libros
        librosContainer.appendChild(tabla);
    })
    .catch(error => {
        console.error('Error al obtener libros:', error);
        // Maneje el error, por ej, mostrando un mensaje de error al cliente
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al obtener los libros. Por favor, inténtalo de nuevo más tarde.'
        });
    });
};

cargarModoColor();
boton.addEventListener('click', () => {
    localStorage.getItem('mode') == 'dark' ? pasarALight() : pasarADark();
});

document.getElementById('solicitarIngreso').addEventListener('click', validarIngreso);

formulario.addEventListener('submit', registrarUsuario);

borrarCarritoBtn.addEventListener('click', borrarCarrito);

confirmarCompraBtn.addEventListener('click', confirmarCompra);

window.onload = () => {
    cargarHistorialCarrito();
};
