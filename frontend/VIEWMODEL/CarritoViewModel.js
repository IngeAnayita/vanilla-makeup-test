document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos
    const carrito = document.getElementById('carrito');
    const productos1 = document.getElementById('lista-1');
    const productos2 = document.getElementById('lista-2');
    const listaCarrito = document.querySelector('#lista-carrito tbody');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    const contadorCarrito = document.createElement('span'); // Para mostrar cantidad de items
    
    // Array para almacenar los productos del carrito
    let articulosCarrito = [];

    // Cargar event listeners
    cargarEventListeners();

    function cargarEventListeners() {
        // Agregar producto al carrito
        if(productos1) productos1.addEventListener('click', agregarProducto);
        if(productos2) productos2.addEventListener('click', agregarProducto);
        
        // Eliminar producto del carrito
        if(carrito) carrito.addEventListener('click', eliminarProducto);
        
        // Vaciar carrito
        if(vaciarCarritoBtn) vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
        
        // Mostrar contador en el ícono del carrito
        actualizarContadorCarrito();
    }

    function agregarProducto(e) {
        e.preventDefault();
        
        if(e.target.classList.contains('agregar-carrito')) {
            const productoSeleccionado = e.target.parentElement.parentElement;
            leerDatosProducto(productoSeleccionado);
            
            // Mostrar notificación
            mostrarNotificacion('Producto agregado al carrito');
        }
    }

    function leerDatosProducto(producto) {
        const infoProducto = {
            imagen: producto.querySelector('img').src,
            titulo: producto.querySelector('h3').textContent,
            precio: producto.querySelector('.precio').textContent,
            id: producto.querySelector('a').getAttribute('data-id'),
            cantidad: 1
        };

        // Revisar si el producto ya existe en el carrito
        const existe = articulosCarrito.some(producto => producto.id === infoProducto.id);
        if(existe) {
            // Actualizamos la cantidad
            const productos = articulosCarrito.map(producto => {
                if(producto.id === infoProducto.id) {
                    producto.cantidad++;
                    return producto;
                } else {
                    return producto;
                }
            });
            articulosCarrito = [...productos];
        } else {
            // Agregamos el producto al carrito
            articulosCarrito = [...articulosCarrito, infoProducto];
        }

        carritoHTML();
    }

    function carritoHTML() {
        // Limpiar el HTML del carrito
        limpiarHTML();

        // Recorrer el array y generar el HTML
        articulosCarrito.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width="50" height="50" style="object-fit: cover; border-radius: 5px;">
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>${producto.cantidad}</td>
                <td>
                    <a href="#" class="borrar" data-id="${producto.id}">X</a>
                </td>
            `;
            listaCarrito.appendChild(row);
        });

        // Actualizar contador
        actualizarContadorCarrito();
    }

    function limpiarHTML() {
        while(listaCarrito.firstChild) {
            listaCarrito.removeChild(listaCarrito.firstChild);
        }
    }

    function eliminarProducto(e) {
        e.preventDefault();
        
        if(e.target.classList.contains('borrar')) {
            const productoId = e.target.getAttribute('data-id');
            
            // Eliminar del array
            articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);
            
            // Actualizar HTML
            carritoHTML();
            
            // Mostrar notificación
            mostrarNotificacion('Producto eliminado del carrito');
        }
    }

    function vaciarCarrito() {
        // Vaciar array
        articulosCarrito = [];
        
        // Limpiar HTML
        limpiarHTML();
        
        // Actualizar contador
        actualizarContadorCarrito();
        
        // Mostrar notificación
        mostrarNotificacion('Carrito vaciado');
    }

    function actualizarContadorCarrito() {
        const imgCarrito = document.getElementById('img-carrito');
        if(imgCarrito) {
            // Eliminar contador anterior si existe
            const contadorAnterior = imgCarrito.querySelector('.contador-carrito');
            if(contadorAnterior) {
                imgCarrito.removeChild(contadorAnterior);
            }
            
            // Crear nuevo contador
            if(articulosCarrito.length > 0) {
                const contador = document.createElement('span');
                contador.classList.add('contador-carrito');
                contador.textContent = articulosCarrito.reduce((total, producto) => total + producto.cantidad, 0);
                
                // Estilos del contador
                contador.style.position = 'absolute';
                contador.style.top = '-10px';
                contador.style.right = '-10px';
                contador.style.backgroundColor = '#8800ff';
                contador.style.color = 'white';
                contador.style.borderRadius = '50%';
                contador.style.width = '20px';
                contador.style.height = '20px';
                contador.style.display = 'flex';
                contador.style.alignItems = 'center';
                contador.style.justifyContent = 'center';
                contador.style.fontSize = '12px';
                contador.style.fontWeight = 'bold';
                
                imgCarrito.style.position = 'relative';
                imgCarrito.appendChild(contador);
            }
        }
    }

    function mostrarNotificacion(mensaje) {
        // Crear notificación
        const notificacion = document.createElement('div');
        notificacion.classList.add('notificacion');
        notificacion.textContent = mensaje;
        
        // Estilos de la notificación
        notificacion.style.position = 'fixed';
        notificacion.style.bottom = '20px';
        notificacion.style.right = '20px';
        notificacion.style.backgroundColor = '#CC99FF';
        notificacion.style.color = 'white';
        notificacion.style.padding = '10px 20px';
        notificacion.style.borderRadius = '5px';
        notificacion.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        notificacion.style.zIndex = '1000';
        notificacion.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
        
        document.body.appendChild(notificacion);
        
        // Eliminar notificación después de 3 segundos
        setTimeout(() => {
            notificacion.style.animation = 'fadeOut 0.3s';
            setTimeout(() => {
                document.body.removeChild(notificacion);
            }, 300);
        }, 2700);
    }

    // Agregar animaciones CSS para las notificaciones
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
    `;
    document.head.appendChild(style);
});