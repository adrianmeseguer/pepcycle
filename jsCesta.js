// Función para añadir productos a la cesta
function addToCart(nombreProducto, precioNumero, tallaSeleccionada) {
    if (tallaSeleccionada === "Talla no elegida" || tallaSeleccionada === "-elegir-") {
        mostrarModalError();
        return;
    }
    
    // Formatear precio correctamente con separadores españoles
    const precioFormateado = precioNumero.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }) + " €";
    
    const producto = {
        nombre: nombreProducto,
        precio: precioFormateado,
        precioNumero: precioNumero,
        cantidad: 1,
        talla: tallaSeleccionada
    };
    
    let cesta = JSON.parse(localStorage.getItem('cesta')) || [];
    cesta.push(producto);
    localStorage.setItem('cesta', JSON.stringify(cesta));
    
    mostrarModalExito(nombreProducto);
    
    // Actualizar contador de la cesta si existe
    actualizarContadorCesta();
}

// Función para mostrar modal de error
function mostrarModalError() {
    const modal = document.getElementById('modalError');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Función para cerrar modal de error
function cerrarModalError() {
    const modal = document.getElementById('modalError');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Función para mostrar modal de éxito
function mostrarModalExito(nombreProducto) {
    const modal = document.getElementById('modalExito');
    if (modal) {
        // Actualizar el título del modal con el nombre del producto
        const titulo = modal.querySelector('h2');
        if (titulo) {
            titulo.textContent = `¡${nombreProducto} añadido a la cesta!`;
        }
        
        modal.style.display = 'flex';
    }
}

// Función para cerrar modal de éxito
function cerrarModalExito() {
    const modal = document.getElementById('modalExito');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Función para cargar la cesta en la página de cesta de compra
function cargarCesta() {
    const productos = JSON.parse(localStorage.getItem('cesta')) || [];
    const tbody = document.getElementById('cestaProductos');
    const mensajeVacia = document.getElementById('mensajeVacia');
    
    if (!tbody || !mensajeVacia) return; // Si no estamos en la página de cesta
    
    let total = 0;
    
    tbody.innerHTML = '';
    
    // Ocultar siempre el mensaje al cargar o eliminar artículos
    mensajeVacia.style.display = 'none';
    
    if (productos.length === 0) {
        mensajeVacia.style.display = 'block';
        document.getElementById('totalCesta').innerText = "0,00 €";
        return;
    }
    
    productos.forEach((producto, index) => {
        total += producto.precioNumero || 0;
        
        const fila = `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.talla || '-'}</td>
                <td>${producto.precio}</td>
                <td>
                    <button class="btn btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', fila);
    });
    
    const totalFormateado = total.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }) + " €";
    
    document.getElementById('totalCesta').innerText = totalFormateado;
}

// Función para eliminar un producto de la cesta
function eliminarProducto(index) {
    let productos = JSON.parse(localStorage.getItem('cesta')) || [];
    productos.splice(index, 1);
    localStorage.setItem('cesta', JSON.stringify(productos));
    cargarCesta();
    
    // Actualizar contador de la cesta si existe
    actualizarContadorCesta();
}

// Función para validar la cesta antes de proceder al pago
function validarCesta() {
    const productos = JSON.parse(localStorage.getItem('cesta')) || [];
    const mensajeVacia = document.getElementById('mensajeVacia');
    
    if (productos.length === 0) {
        mensajeVacia.style.display = 'block';
    } else {
        mensajeVacia.style.display = 'none';
        window.location.href = "formularioCompra.html";
    }
}

// Función para actualizar el contador de la cesta en el icono del carrito
function actualizarContadorCesta() {
    const productos = JSON.parse(localStorage.getItem('cesta')) || [];
    const contadorElement = document.getElementById('contadorCesta');
    
    if (contadorElement) {
        if (productos.length > 0) {
            contadorElement.textContent = productos.length;
            contadorElement.style.display = 'flex';
        } else {
            contadorElement.style.display = 'none';
        }
    }
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    // Si estamos en la página de cesta, cargar los productos
    if (document.getElementById('cestaProductos')) {
        cargarCesta();
    }
    
    // Actualizar contador de la cesta
    actualizarContadorCesta();
    
    // Configurar botones de añadir a la cesta en páginas de producto
    const btnAddToCart = document.querySelector('.btn[onclick="addToCart()"]');
    if (btnAddToCart) {
        btnAddToCart.onclick = function() {
            const nombreProducto = document.querySelector('.producto-info h1').textContent.trim();
            const precioTexto = document.querySelector('.precio').textContent.trim();
            const precioNumero = parseFloat(precioTexto.replace('€', '').replace('.', '').replace(',', '.').trim());
            const tallaSeleccionada = document.querySelector('.desplegableTallasBicis').value;
            
            addToCart(nombreProducto, precioNumero, tallaSeleccionada);
        };
    }
});