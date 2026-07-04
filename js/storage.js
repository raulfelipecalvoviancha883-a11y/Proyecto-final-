localStorage.clear(); 

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
};

const getStorageData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setStorageData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

initLocalStorage();