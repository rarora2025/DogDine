// Global variables
let cart = [];
let deliveryDistance = 0;
let deliveryFee = 0;
let customerAddress = '';
let customerZipCode = '';

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    // Initialize all components
    initializeNavigation();
    updateCartDisplay();
    updateCartCount();
    initializeLocationForm();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartEmpty = document.getElementById('cartEmpty');
    
    if (!cartItemsContainer || !cartEmpty) return;
    
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        cartEmpty.style.display = 'block';
        return;
    }
    
    cartItemsContainer.style.display = 'block';
    cartEmpty.style.display = 'none';
    
    let cartHTML = '';
    cart.forEach((item, index) => {
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">&times;</button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    updateSummary();
}

// Update cart summary
function updateSummary() {
    const subtotal = getCartTotal();
    const total = subtotal + deliveryFee;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('deliveryFee').textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Cart functions
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const navCartCount = document.getElementById('navCartCount');
    
    if (navCartCount) navCartCount.textContent = cartCount;
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Location form functionality
function initializeLocationForm() {
    const locationForm = document.getElementById('locationForm');
    if (locationForm) {
        locationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            checkLocation();
        });
    }
}

function checkLocation() {
    const addressInput = document.getElementById('addressInput');
    const zipCodeInput = document.getElementById('zipCodeInput');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const locationResult = document.getElementById('locationResult');
    const proceedBtn = document.getElementById('proceedBtn');
    
    if (!addressInput || !zipCodeInput) return;
    
    const address = addressInput.value.trim();
    const zipCode = zipCodeInput.value.trim();
    
    if (!address || !zipCode) {
        showLocationResult('Please enter both address and ZIP code.', 'error');
        return;
    }
    
    // Show loading
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
    
    // Simulate API call delay
    setTimeout(() => {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        
        // Simulate distance calculation
        const distance = calculateDistance(zipCode);
        
        if (distance > 15) {
            showLocationResult('Sorry, we don\'t deliver to your area yet. We currently serve within 15 miles of Greenwich, CT.', 'error');
            return;
        }
        
        customerAddress = address;
        customerZipCode = zipCode;
        deliveryDistance = distance;
        
        if (distance <= 5) {
            deliveryFee = 0;
            showLocationResult('Great! You\'re in our free delivery zone (0-5 miles).', 'success');
        } else {
            deliveryFee = 5;
            showLocationResult(`You're in our extended delivery zone (${distance.toFixed(1)} miles). $5 premium delivery fee applies.`, 'success');
        }
        
        // Enable proceed button
        if (proceedBtn) proceedBtn.disabled = false;
        
        // Update summary
        updateSummary();
    }, 1500);
}

function calculateDistance(zipCode) {
    // Simulate distance calculation based on ZIP code
    const zipNum = parseInt(zipCode);
    
    if (zipNum >= 6830 && zipNum <= 6840) return Math.random() * 5; // 0-5 miles
    if (zipNum >= 6841 && zipNum <= 6850) return 5 + Math.random() * 5; // 5-10 miles
    if (zipNum >= 6851 && zipNum <= 6860) return 10 + Math.random() * 5; // 10-15 miles
    
    return 20; // Beyond service area
}

function showLocationResult(message, type) {
    const locationResult = document.getElementById('locationResult');
    if (!locationResult) return;
    
    const icon = type === 'success' ? '✅' : '❌';
    const className = type === 'success' ? 'success' : 'error';
    
    locationResult.innerHTML = `
        <div class="location-result ${className}">
            <span class="result-icon">${icon}</span>
            <p>${message}</p>
        </div>
    `;
    locationResult.style.display = 'block';
}

// Proceed to delivery
function proceedToDelivery() {
    if (!customerAddress || !customerZipCode) {
        alert('Please check your delivery location first.');
        return;
    }
    
    if (cart.length === 0) {
        alert('Your cart is empty. Please add some items first.');
        return;
    }
    
    // Redirect to main page for delivery selection
    window.location.href = 'index.html#pricing';
}

// Add cart styles
function addCartStyles() {
    const styles = `
        <style>
            .cart-item {
                display: flex;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid #eee;
                gap: 15px;
            }
            
            .cart-item-info {
                flex: 1;
            }
            
            .cart-item-info h4 {
                margin: 0 0 5px 0;
                font-size: 16px;
            }
            
            .cart-item-info p {
                margin: 0;
                color: #666;
                font-size: 14px;
            }
            
            .cart-item-controls {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .cart-item-controls button {
                width: 30px;
                height: 30px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
            }
            
            .cart-item-controls button:hover {
                background: #f0f0f0;
            }
            
            .cart-item-total {
                font-weight: bold;
                min-width: 60px;
                text-align: right;
            }
            
            .remove-item {
                background: none;
                border: none;
                color: #ff4444;
                font-size: 18px;
                cursor: pointer;
                padding: 5px;
            }
            
            .location-result {
                padding: 15px;
                border-radius: 8px;
                margin-top: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .location-result.success {
                background: #e8f5e8;
                color: #2d5a2d;
                border: 1px solid #4a7c59;
            }
            
            .location-result.error {
                background: #ffeaea;
                color: #d32f2f;
                border: 1px solid #f44336;
            }
            
            .result-icon {
                font-size: 20px;
            }
            
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            
            .loading-spinner {
                background: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
            }
            
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #4a7c59;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 15px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Add styles on page load
document.addEventListener('DOMContentLoaded', function() {
    addCartStyles();
}); 