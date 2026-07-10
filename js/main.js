let cart = [];
let currentView = 'client-events'; 

const appContainer = document.getElementById('app-container');
const cartModal = document.getElementById('cart-modal');
const btnOpenCart = document.getElementById('btn-open-cart');
const btnCloseCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalVal = document.getElementById('cart-total-val');
const checkoutForm = document.getElementById('checkout-form');
const btnGoToCheckout = document.getElementById('btn-go-to-checkout');

const renderApp = () => {
    appContainer.innerHTML = '';
    if (currentView === 'client-events') {
        renderClientEvents();
    } else if (currentView === 'event-detail') {
        renderEventDetail(window.selectedEventId);
    } else if (currentView === 'admin-login') {
        renderAdminLogin();
    } else if (currentView === 'admin-dashboard') {
        renderAdminDashboard();
    }
    updateCartCount();
};

const renderClientEvents = () => {
    const events = getStorageData('events');
    const categories = getStorageData('categories');

    appContainer.innerHTML = `
        <div class="container">
            <div class="filters-section">
                <input type="text" id="search-input" placeholder="Buscar por nombre en tiempo real...">
                <select id="filter-city">
                    <option value="">Todas las ciudades</option>
                    <option value="Barranquilla">Barranquilla</option>
                    <option value="Bogotá">Bogotá</option>
                    <option value="Bucaramanga">Bucaramanga</option>
                    <option value="Medellín">Medellín</option>
                    <option value="Cucuta">Cucuta</option>
                </select>
                <select id="filter-category">
                    <option value="">Todas las categorías</option>
                    ${categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
                </select>
            </div>
            <div class="grid-events" id="events-display"></div>
        </div>
    `;

    const displayEvents = () => {
        const search = document.getElementById('search-input').value.toLowerCase();
        const city = document.getElementById('filter-city').value;
        const cat = document.getElementById('filter-category').value;
        const display = document.getElementById('events-display');
        
        const filtered = events.filter(e => {
            return e.name.toLowerCase().includes(search) &&
                   (city === '' || e.city === city) &&
                   (cat === '' || e.category === cat);
        });

        display.innerHTML = filtered.map(e => `
            <div class="event-card">
                <img src="${e.img}" alt="${e.name}">
                <div class="event-card-body">
                    <h3>${e.name}</h3>
                    <p>📍 ${e.city} | 📅 ${e.date} | ⏰ ${e.hour}</p>
                    <div class="price">$${e.price.toLocaleString()}</div>
                    <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                        <button class="btn btn-view-detail" data-id="${e.id}" style="flex:1;">Ver Detalle</button>
                        <button class="btn btn-add-cart" data-id="${e.id}">🛒</button>
                    </div>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.btn-view-detail').forEach(b => b.addEventListener('click', (e) => {
            window.selectedEventId = e.target.dataset.id;
            currentView = 'event-detail';
            renderApp();
        }));
        document.querySelectorAll('.btn-add-cart').forEach(b => b.addEventListener('click', (e) => addToCart(e.target.dataset.id)));
    };

    document.getElementById('search-input').addEventListener('input', displayEvents);
    document.getElementById('filter-city').addEventListener('change', displayEvents);
    document.getElementById('filter-category').addEventListener('change', displayEvents);
    displayEvents();
};

const renderEventDetail = (id) => {
    const events = getStorageData('events');
    const ev = events.find(e => e.id === id);

    if (!ev) {
        appContainer.innerHTML = `<div class="container"><p>Evento no encontrado</p></div>`;
        return;
    }

    appContainer.innerHTML = `
        <div class="container" style="max-width: 800px; margin: 0 auto; background: white; padding: 2rem; border-radius: 10px; margin-top: 2rem;">
            <button class="btn btn-secondary" id="btn-back-home" style="margin-bottom: 1rem;">⬅ Volver</button>
            <img src="${ev.img}" style="width:100%; max-height:400px; object-fit:cover; border-radius:10px;" alt="${ev.name}">
            <h1 style="margin: 1rem 0;">${ev.name}</h1>
            <p style="font-size: 1.1rem; color: #555;">${ev.desc}</p>
            <hr style="margin: 1rem 0; border: 0; border-top: 1px solid #eee;">
            <p><strong>Ciudad:</strong> ${ev.city}</p>
            <p><strong>Fecha:</strong> ${ev.date} | <strong>Hora:</strong> ${ev.hour}</p>
            <div class="price" style="font-size: 1.8rem; margin: 1rem 0;">$${ev.price.toLocaleString()}</div>
            <button class="btn" id="btn-add-cart-detail" style="width: 100%; padding: 1rem; font-size: 1.2rem;">Agregar al Carrito</button>
        </div>
    `;

    document.getElementById('btn-back-home').addEventListener('click', () => { currentView = 'client-events'; renderApp(); });
    document.getElementById('btn-add-cart-detail').addEventListener('click', () => addToCart(ev.id));
};

const addToCart = (id) => {
    const events = getStorageData('events');
    const ev = events.find(e => e.id === id);
    if (ev) {
        cart.push(ev);
        updateCartCount();
        alert(`¡Entrada para "${ev.name}" añadida al carrito!`);
    }
};

const updateCartCount = () => {
    document.getElementById('cart-count').innerText = cart.length;
};

const openCartModal = () => {
    cartModal.style.display = 'flex';
    cartItemsContainer.innerHTML = cart.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid #eee; padding-bottom:0.5rem;">
            <div style="display:flex; align-items:center; gap:1rem;">
                <img src="${item.img}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;">
                <div>
                    <h4>${item.name}</h4>
                    <p style="font-size:0.85rem; color:#666;">${item.city}</p>
                </div>
            </div>
            <strong>$${item.price.toLocaleString()}</strong>
        </div>
    `).join('');
    
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    cartTotalVal.innerText = total.toLocaleString();

    if(cart.length === 0) {
        cartItemsContainer.innerHTML = `<p>El carrito está vacío.</p>`;
        btnGoToCheckout.classList.add('hidden');
    } else {
        btnGoToCheckout.classList.remove('hidden');
    }
};

document.getElementById('btn-nav-client').addEventListener('click', () => {
    currentView = 'client-events';
    document.getElementById('btn-nav-client').classList.add('active');
    document.getElementById('btn-nav-admin').classList.remove('active');
    renderApp();
});

document.getElementById('btn-nav-admin').addEventListener('click', () => {
    currentView = 'admin-login';
    document.getElementById('btn-nav-admin').classList.add('active');
    document.getElementById('btn-nav-client').classList.remove('active');
    renderApp();
});

document.getElementById('nav-logo').addEventListener('click', () => {
    currentView = 'client-events';
    renderApp();
});

btnOpenCart.addEventListener('click', openCartModal);
btnCloseCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
    checkoutForm.classList.add('hidden');
});

btnGoToCheckout.addEventListener('click', () => {
    checkoutForm.classList.remove('hidden');
    btnGoToCheckout.classList.add('hidden');
});

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const sales = getStorageData('sales');
    const total = cart.reduce((acc, item) => acc + item.price, 0);

    const newSale = {
        date: new Date().toISOString(),
        customer: {
            doc: document.getElementById('cust-doc').value,
            name: document.getElementById('cust-name').value,
            dir: document.getElementById('cust-dir').value,
            tel: document.getElementById('cust-tel').value,
            email: document.getElementById('cust-email').value,
        },
        items: [...cart],
        total: total
    };

    sales.push(newSale);
    setStorageData('sales', sales);

    alert("¡Compra realizada con éxito! Su boleta digital ha sido asignada.");
    
    cart = [];
    checkoutForm.reset();
    checkoutForm.classList.add('hidden');
    cartModal.style.display = 'none';
    renderApp();
});

renderApp();
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalSugerencia');
    const btnSugerencia = document.getElementById('btnSugerencia');
    const closeBtn = document.querySelector('.modal-sugerencia-close');
    const formSugerencia = document.getElementById('formSugerencia');
    const tablaBody = document.querySelector('#tablaSugerencias tbody');

    if (btnSugerencia && modal && closeBtn) {
        btnSugerencia.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    if (formSugerencia) {
        formSugerencia.addEventListener('submit', (e) => {
            e.preventDefault();

            const sugerencia = {
                id: Date.now(),
                nombre: document.getElementById('nombre').value.trim(),
                email: document.getElementById('email').value.trim(),
                mensaje: document.getElementById('mensaje').value.trim(),
                fecha: new Date().toISOString()
            };

            const sugerenciasGuardadas = JSON.parse(localStorage.getItem('sugerencias')) || [];
            sugerenciasGuardadas.push(sugerencia);
            localStorage.setItem('sugerencias', JSON.stringify(sugerenciasGuardadas));

            alert('¡Muchas gracias! Tu sugerencia ha sido enviada con éxito.');
            formSugerencia.reset();
            if (modal) modal.style.display = 'none';

            if (tablaBody) cargarSugerenciasEnTabla();
        });
    }

    function cargarSugerenciasEnTabla() {
        if (!tablaBody) return;

        const sugerencias = JSON.parse(localStorage.getItem('sugerencias')) || [];
        tablaBody.innerHTML = '';

        if (sugerencias.length === 0) {
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: #9ca3af;">No se han recibido sugerencias en el buzón.</td>
                </tr>
            `;
            return;
        }

        sugerencias.forEach(sug => {
            const fila = document.createElement('tr');
            
            const fechaFormateada = new Date(sug.fecha).toLocaleString('es-ES', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            fila.innerHTML = `
                <td><strong>${sug.id}</strong></td>
                <td>${escapeHTML(sug.nombre)}</td>
                <td><a href="mailto:${sug.email}">${escapeHTML(sug.email)}</a></td>
                <td>${escapeHTML(sug.mensaje)}</td>
                <td>${fechaFormateada}</td>
            `;
            tablaBody.appendChild(fila);
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    cargarSugerenciasEnTabla();
});

