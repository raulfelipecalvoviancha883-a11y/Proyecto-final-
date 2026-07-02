localStorage.clear(); 
const initLocalStorage = () => {
    if (!localStorage.getItem('categories')) {
        localStorage.setItem('categories', JSON.stringify([
            { id: "1", name: "Rock", description: "Conciertos de Rock y Metal" },
            { id: "2", name: "Pop", description: "Música Pop internacional y nacional" },
            { id: "3", name: "Reggaeton", description: "Género urbano y fiesta" },
            { id: "4", name: "Vallenato", description: "Folclor y clásicos vallenatos" }
        ]));
    }
   if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify([
        { id: "EV01", name: "Rock Fest 2026", category: "Rock", price: 150000, date: "2026-08-15", hour: "20:00", city: "Bogotá", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoQ8AvBUvEMPJHcDO0d3VvFagv_1BWRRc_S8-8RDC3kg&s=10", desc: "El festival de rock más grande del año con bandas nacionales e internacionales." },
        { id: "EV02", name: "Pop Queen Tour", category: "Pop", price: 220000, date: "2026-09-20", hour: "19:00", city: "Medellín", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRovF-X7E8Dz1IQmInaJQDKaHzcbvcEfoxSHK-CeYsAiFLWVursRrXAyLLy&s=10", desc: "La reina del pop llega a la ciudad de la eterna primavera en su gira mundial." },
        { id: "EV03", name: "Vallenato al Parque", category: "Vallenato", price: 80000, date: "2026-10-05", hour: "18:00", city: "Bucaramanga", img: "https://cloudfront-us-east-1.images.arcpublishing.com/elespectador/ZGLIVQ7TOJAIJBH7WPXUVWJHMM.png", desc: "Una noche inolvidable con los mejores acordeoneros y compositores del país." },
        { id: "EV04", name: "Urban Flow Arena", category: "Reggaeton", price: 180000, date: "2026-11-12", hour: "21:00", city: "Barranquilla", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPvr2VA4MFe3Y1zC39CdUlAH69RnHPgP8CHL_QCKQ0WHiYKC9qF4oYyKqW&s=10", desc: "El evento de género urbano más esperado del caribe con los artistas del momento." },
        { id: "EV05", name: "Electro Pop Night", category: "Pop", price: 130000, date: "2026-12-13", hour: "22:00", city: "Bogotá", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmV9Itvv9RwnYVBxJwGuA9ggctJ-ytRbg48oPta7RGBQ&s=10", desc: "Una experiencia audiovisual única que combina voces pop con beats electrónicos." },
        { id: "EV06", name: "Indie Rock Sunset", category: "Rock", price: 95000, date: "2026-08-18", hour: "16:00", city: "Bucaramanga", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBoqmb43GDjTSWj9WQHERxfOFcUWOUnaAwSCLBhQ2W6Q&s=10", desc: "Disfruta del mejor rock alternativo al aire libre durante el atardecer." },
        { id: "EV07", name: "La Eterna Parranda", category: "Vallenato", price: 110000, date: "2026-08-29", hour: "20:00", city: "Barranquilla", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiu7a-xiti0XUhEpRyWNDb_HJj3bHRr0siXTt2A3xAfQ&s=10", desc: "Los grandes clásicos del vallenato en un solo escenario frente al mar." },
        { id: "EV08", name: "Reggaeton Legends", category: "Reggaeton", price: 250000, date: "2026-12-01", hour: "20:00", city: "Medellín", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwxBPMEX3FtMaZtu7Rq59uUDnYC03xKEL156ukMg_8wg&s=10", desc: "Los pioneros del género urbano se reúnen en un concierto histórico." },
        { id: "EV09", name: "SUPER CONCIERTO FERIA DE CÚCUTA 2026", category: "Vallenato", price: 250000, date: "2026-07-18", hour: "19:00", city: "Cucuta", img: "https://www.tuboleta.com/sites/default/files/2026-05/WhatsApp%20Image%202026-05-25%20at%2011.14.35%20AM.jpeg", desc: "El gran concierto de pago reunirá a Grupo Firme (con su gira La Última Peda) y a Silvestre Dangond (con El Baile de Todos)" }
    ]));
}
    if (!localStorage.getItem('sales')) localStorage.setItem('sales', JSON.stringify([]));
};
initLocalStorage();

let cart = [];
let currentView = 'client-events'; 
let adminSubView = 'categories';

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
    const events = JSON.parse(localStorage.getItem('events'));
    const categories = JSON.parse(localStorage.getItem('categories'));

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
    const events = JSON.parse(localStorage.getItem('events'));
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

const renderAdminLogin = () => {
    appContainer.innerHTML = `
        <div class="container" style="max-width: 400px; margin: 5rem auto; background: white; padding: 2.5rem; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h2 style="margin-bottom: 1.5rem; text-align: center;">Acceso Administrador</h2>
            <form id="login-form" style="display:flex; flex-direction:column; gap:1rem;">
                <input type="email" id="login-email" placeholder="admin@mail.com" required style="padding: 0.8rem; border: 1px solid #ccc; border-radius:5px;">
                <input type="password" id="login-pass" placeholder="••••••" required style="padding: 0.8rem; border: 1px solid #ccc; border-radius:5px;">
                <button type="submit" class="btn">Ingresar</button>
            </form>
        </div>
    `;

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-pass').value;

        if (email === 'admin@mail.com' && pass === '123456') {
            alert('¡Bienvenido Administrador!');
            currentView = 'admin-dashboard';
            renderApp();
        } else {
            alert('Credenciales incorrectas. Intente de nuevo.');
        }
    });
};

const renderAdminDashboard = () => {
    appContainer.innerHTML = `
        <div class="container">
            <h2>Dashboard de Control</h2>
            <div class="admin-layout">
                <div class="admin-menu">
                    <button class="btn ${adminSubView==='categories'?'':'btn-secondary'}" id="sub-cat">Categorías</button>
                    <button class="btn ${adminSubView==='events'?'':'btn-secondary'}" id="sub-ev">Eventos</button>
                    <button class="btn ${adminSubView==='sales'?'':'btn-secondary'}" id="sub-sales">Ventas</button>
                </div>
                <div class="admin-content" id="admin-sub-content"></div>
            </div>
        </div>
    `;

    document.getElementById('sub-cat').addEventListener('click', () => { adminSubView = 'categories'; renderAdminDashboard(); });
    document.getElementById('sub-ev').addEventListener('click', () => { adminSubView = 'events'; renderAdminDashboard(); });
    document.getElementById('sub-sales').addEventListener('click', () => { adminSubView = 'sales'; renderAdminDashboard(); });

    const subContent = document.getElementById('admin-sub-content');

    if (adminSubView === 'categories') {
        const categories = JSON.parse(localStorage.getItem('categories'));
        subContent.innerHTML = `
            <h3>Módulo de Categorías</h3>
            <button class="btn" id="btn-add-cat" style="margin: 1rem 0;">+ Agregar Categoría</button>
            <table>
                <thead><tr><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead>
                <tbody>
                    ${categories.map(c => `<tr><td>${c.name}</td><td>${c.description}</td><td><button class="btn btn-danger btn-del-cat" data-id="${c.id}">Eliminar</button></td></tr>`).join('')}
                </tbody>
            </table>
        `;
        document.querySelectorAll('.btn-del-cat').forEach(b => b.addEventListener('click', (e) => {
            let catList = categories.filter(c => c.id !== e.target.dataset.id);
            localStorage.setItem('categories', JSON.stringify(catList));
            renderAdminDashboard();
        }));
        document.getElementById('btn-add-cat').addEventListener('click', () => {
            const name = prompt('Nombre de la categoría:');
            const description = prompt('Descripción:');
            if (name && description) {
                categories.push({ id: Date.now().toString(), name, description });
                localStorage.setItem('categories', JSON.stringify(categories));
                renderAdminDashboard();
            }
        });
    } 
    else if (adminSubView === 'events') {
        const events = JSON.parse(localStorage.getItem('events'));
        subContent.innerHTML = `
            <h3>Módulo de Eventos</h3>
            <button class="btn" id="btn-create-ev" style="margin:1rem 0;">+ Crear Evento</button>
            <div style="overflow-x: auto;">
                <table>
                    <thead><tr><th>Código</th><th>Nombre</th><th>Ciudad</th><th>Precio</th><th>Acciones</th></tr></thead>
                    <tbody>
                        ${events.map(ev => `<tr><td>${ev.id}</td><td>${ev.name}</td><td>${ev.city}</td><td>$${ev.price}</td><td><button class="btn btn-danger btn-del-ev" data-id="${ev.id}">Eliminar</button></td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
        document.querySelectorAll('.btn-del-ev').forEach(b => b.addEventListener('click', (e) => {
            let evList = events.filter(ev => ev.id !== e.target.dataset.id);
            localStorage.setItem('events', JSON.stringify(evList));
            renderAdminDashboard();
        }));
        document.getElementById('btn-create-ev').addEventListener('click', () => {
            const id = prompt('Código único del evento:');
            const name = prompt('Nombre del evento:');
            const city = prompt('Ciudad (Barranquilla, Bogotá, Bucaramanga, Medellín):');
            const price = parseFloat(prompt('Precio:'));
            const date = prompt('Fecha (AAAA-MM-DD):');
            const hour = prompt('Hora (HH:MM):');
            const category = prompt('Categoría (Ej: Rock, Pop):');
            const img = prompt('URL de Imagen de referencia:');
            const desc = prompt('Breve descripción:');

            if(id && name && city && price) {
                events.push({ id, name, city, price, date, hour, category, img, desc });
                localStorage.setItem('events', JSON.stringify(events));
                renderAdminDashboard();
            }
        });
    }
    else if (adminSubView === 'sales') {
        const sales = JSON.parse(localStorage.getItem('sales')).sort((a,b) => new Date(b.date) - new Date(a.date));
        subContent.innerHTML = `
            <h3>Módulo de Ventas</h3>
            <table>
                <thead><tr><th>Fecha</th><th>Cliente</th><th>Ciudad (Envío)</th><th>Total</th><th>Detalles</th></tr></thead>
                <tbody>
                    ${sales.map((s, index) => `
                        <tr>
                            <td>${new Date(s.date).toLocaleString()}</td>
                            <td>${s.customer.name}</td>
                            <td>${s.items[0]?.city || 'N/A'}</td>
                            <td>$${s.total.toLocaleString()}</td>
                            <td><button class="btn btn-secondary btn-view-sale" data-index="${index}">Ver Todo</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        document.querySelectorAll('.btn-view-sale').forEach(b => b.addEventListener('click', (e) => {
            const sale = sales[e.target.dataset.index];
            alert(`Detalle del Pedido:\nCliente: ${sale.customer.name}\nEmail: ${sale.customer.email}\nIdentificación: ${sale.customer.doc}\nTeléfono: ${sale.customer.tel}\nDirección: ${sale.customer.dir}\n\nItems:\n${sale.items.map(i => `- ${i.name} ($${i.price})`).join('\n')}`);
        }));
    }
};

const addToCart = (id) => {
    const events = JSON.parse(localStorage.getItem('events'));
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
    
    const sales = JSON.parse(localStorage.getItem('sales'));
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
    localStorage.setItem('sales', JSON.stringify(sales));

    alert("¡Compra realizada con éxito! Su boleta digital ha sido asignada.");
    
    cart = [];
    checkoutForm.reset();
    checkoutForm.classList.add('hidden');
    cartModal.style.display = 'none';
    renderApp();
});

renderApp();