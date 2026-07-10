const initLocalStorage = () => {
    if (!localStorage.getItem('categories')) {
        localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }
    if (!localStorage.getItem('events')) {
        localStorage.setItem('events', JSON.stringify(defaultEvents));
    }
    if (!localStorage.getItem('sales')) {
        localStorage.setItem('sales', JSON.stringify([]));
    }
    if (!localStorage.getItem('tickets_sold')) {
        localStorage.setItem('tickets_sold', JSON.stringify([]));
    }
};

const getStorageData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setStorageData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

initLocalStorage();

function guardarVentaLocalStorage() {
    const datosVentas = JSON.parse(localStorage.getItem('tickets_sold')) || [];
    const carrito = JSON.parse(localStorage.getItem('cart')) || []; 
    
    if (carrito.length === 0) return;

    const fechaActual = new Date().toISOString().split('T')[0];

    carrito.forEach(item => {
        const nuevaVenta = {
            eventCode: item.eventCode || item.id, 
            eventName: item.eventName || item.title,
            dateSold: fechaActual, 
            quantity: item.quantity,
            totalPrice: item.totalPrice || (item.price * item.quantity)
        };
        
        datosVentas.push(nuevaVenta);
    });

    localStorage.setItem('tickets_sold', JSON.stringify(datosVentas));
    localStorage.removeItem('cart');
}