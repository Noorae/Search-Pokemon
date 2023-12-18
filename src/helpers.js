// Function to save data to localStorage
export function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Function to retrieve data from localStorage
export function getFromLocalStorage(key) {
    const cachedData = localStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
}
