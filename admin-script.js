// Default credentials (CHANGE THESE!)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '1994admin'
};

// Default routes data
let routesData = [
    {
        id: 1,
        title: 'Tangil ⇄ Port Bulado',
        duration: '45 minutes',
        trips: 'Multiple departures',
        fare: 'Contact for rates'
    },
    {
        id: 2,
        title: 'Hagnaya ⇄ Santa Fe',
        duration: '1 hour',
        trips: 'Frequent schedules',
        fare: 'Contact for rates'
    },
    {
        id: 3,
        title: 'Cebu City ⇄ Bantayan Island',
        duration: '3 hours',
        trips: 'Regular service',
        fare: 'Contact for rates'
    },
    {
        id: 4,
        title: 'Cebu City ⇄ Camotes Islands',
        duration: '2.5 hours',
        trips: 'Daily service',
        fare: 'Contact for rates'
    }
];

// Load routes from storage or use defaults
function loadRoutes() {
    const saved = localStorage.getItem('isc_routes');
    if (saved) {
        routesData = JSON.parse(saved);
    }
}

// Save routes to storage
function saveRoutes() {
    localStorage.setItem('isc_routes', JSON.stringify(routesData));
}

// DOM Elements
const loginContainer = document.getElementById('loginContainer');
const adminPanel = document.getElementById('adminPanel');
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const logoutBtn = document.getElementById('logoutBtn');
const routesAdmin = document.getElementById('routesAdmin');
const addRouteBtn = document.getElementById('addRouteBtn');

// Check if already logged in
function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('isc_admin_logged_in');
    if (isLoggedIn === 'true') {
        showAdminPanel();
    }
}

// Login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('isc_admin_logged_in', 'true');
        errorMessage.textContent = '';
        showAdminPanel();
    } else {
        errorMessage.textContent = '❌ Invalid username or password';
        document.getElementById('password').value = '';
    }
});

// Show admin panel
function showAdminPanel() {
    loginContainer.style.display = 'none';
    adminPanel.classList.add('active');
    loadRoutes();
    renderRoutes();
}

// Logout
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('isc_admin_logged_in');
    adminPanel.classList.remove('active');
    loginContainer.style.display = 'flex';
    loginForm.reset();
    errorMessage.textContent = '';
});

// Render routes in admin panel
function renderRoutes() {
    routesAdmin.innerHTML = '';
    
    routesData.forEach(route => {
        const routeCard = createRouteCard(route);
        routesAdmin.appendChild(routeCard);
    });
}

// Create route card
function createRouteCard(route) {
    const card = document.createElement('div');
    card.className = 'route-edit-card';
    card.innerHTML = `
        <div class="route-edit-header">
            <h3>${route.title}</h3>
            <div class="route-actions">
                <button class="edit-btn" onclick="editRoute(${route.id})">Edit</button>
                <button class="delete-btn" onclick="deleteRoute(${route.id})">Delete</button>
            </div>
        </div>
        <div class="route-details" id="route-${route.id}">
            <div class="route-field">
                <label>Route Title:</label>
                <input type="text" value="${route.title}" disabled class="route-field-disabled" data-field="title">
            </div>
            <div class="route-field">
                <label>Duration:</label>
                <input type="text" value="${route.duration}" disabled class="route-field-disabled" data-field="duration">
            </div>
            <div class="route-field">
                <label>Daily Trips:</label>
                <input type="text" value="${route.trips}" disabled class="route-field-disabled" data-field="trips">
            </div>
            <div class="route-field">
                <label>Fare:</label>
                <input type="text" value="${route.fare}" disabled class="route-field-disabled" data-field="fare">
            </div>
        </div>
    `;
    return card;
}

// Edit route
function editRoute(id) {
    const routeDetails = document.getElementById(`route-${id}`);
    const inputs = routeDetails.querySelectorAll('input');
    const header = routeDetails.parentElement.querySelector('.route-actions');
    
    inputs.forEach(input => {
        input.disabled = false;
        input.classList.remove('route-field-disabled');
    });
    
    header.innerHTML = `
        <button class="save-btn" onclick="saveRoute(${id})">Save</button>
        <button class="cancel-btn" onclick="cancelEdit(${id})">Cancel</button>
    `;
}

// Save route
function saveRoute(id) {
    const routeDetails = document.getElementById(`route-${id}`);
    const inputs = routeDetails.querySelectorAll('input');
    
    const route = routesData.find(r => r.id === id);
    
    inputs.forEach(input => {
        const field = input.getAttribute('data-field');
        route[field] = input.value;
    });
    
    saveRoutes();
    renderRoutes();
    updateMainSite();
    alert('✅ Route updated successfully!');
}

// Cancel edit
function cancelEdit(id) {
    renderRoutes();
}

// Delete route
function deleteRoute(id) {
    if (confirm('Are you sure you want to delete this route?')) {
        routesData = routesData.filter(r => r.id !== id);
        saveRoutes();
        renderRoutes();
        updateMainSite();
        alert('✅ Route deleted successfully!');
    }
}

// Add new route
addRouteBtn.addEventListener('click', () => {
    const newId = Math.max(...routesData.map(r => r.id), 0) + 1;
    const newRoute = {
        id: newId,
        title: 'New Route',
        duration: '0 minutes',
        trips: 'TBD',
        fare: 'Contact for rates'
    };
    
    routesData.push(newRoute);
    saveRoutes();
    renderRoutes();
    updateMainSite();
    editRoute(newId);
});

// Update main site with new routes
function updateMainSite() {
    localStorage.setItem('isc_routes', JSON.stringify(routesData));
}

// Initialize
checkLogin();
