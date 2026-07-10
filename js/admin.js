let adminSubView = 'categories';

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
        const categories = getStorageData('categories');
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
            setStorageData('categories', catList);
            renderAdminDashboard();
        }));
        document.getElementById('btn-add-cat').addEventListener('click', () => {
            const name = prompt('Nombre de la categoría:');
            const description = prompt('Descripción:');
            if (name && description) {
                categories.push({ id: Date.now().toString(), name, description });
                setStorageData('categories', categories);
                renderAdminDashboard();
            }
        });
    } 
    else if (adminSubView === 'events') {
        const events = getStorageData('events');
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
            setStorageData('events', evList);
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
                setStorageData('events', events);
                renderAdminDashboard();
            }
        });
    }
    else if (adminSubView === 'sales') {
        const sales = getStorageData('sales').sort((a,b) => new Date(b.date) - new Date(a.date));
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
const btnNavAdmin = document.getElementById('btn-nav-admin');

if (btnNavAdmin) {
    btnNavAdmin.addEventListener('click', () => {
        cargarPerfilAdministrador();
    });
}

function cargarPerfilAdministrador() {
    fetch('reporte-ventas.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo HTML del reporte');
            }
            return response.text();
        })
        .then(html => {
            const container = document.getElementById('app-container');
            container.innerHTML = html;

            inicializarLogicaReporte();
        })
        .catch(error => console.error('Error cargando la vista de admin:', error));
}