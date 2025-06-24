// Simple, working Cart JavaScript
let cart = [];
let deliveryDistance = 0;
let deliveryFee = 0;
let customerAddress = '';
let customerZipCode = '';
let isDeliveryAvailable = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing cart page...');
    initializeCart();
    initializeLocationChecker();
    updateCartDisplay();
    updateCartCount();
    updateOrderSummary();
    addCartStyles();
});

// Initialize Cart
function initializeCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        console.log('Loaded cart:', cart);
    }
}

// Initialize Location Checker
function initializeLocationChecker() {
    const locationForm = document.getElementById('locationForm');
    const addressInput = document.getElementById('addressInput');
    
    if (locationForm && addressInput) {
        locationForm.addEventListener('submit', handleLocationSubmit);
        
        // Simple address suggestions
        addressInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length >= 3) {
                showAddressSuggestions(query);
            } else {
                hideAddressSuggestions();
            }
        });
    }
}

// Handle Location Submit
function handleLocationSubmit(event) {
    event.preventDefault();
    
    const addressInput = document.getElementById('addressInput');
    const zipCodeInput = document.getElementById('zipCodeInput');
    
    if (!addressInput || !zipCodeInput) return;
    
    customerAddress = addressInput.value.trim();
    customerZipCode = zipCodeInput.value.trim();
    
    if (!customerAddress || !customerZipCode) {
        showNotification('Please enter a valid address', 'error');
        return;
    }
    
    // Show loading state
    const checkDeliveryBtn = document.getElementById('checkDeliveryBtn');
    if (checkDeliveryBtn) {
        checkDeliveryBtn.textContent = 'Checking...';
        checkDeliveryBtn.disabled = true;
    }
    
    // Simulate API call
    setTimeout(() => {
        checkDeliveryAvailability(customerAddress, customerZipCode);
        if (checkDeliveryBtn) {
            checkDeliveryBtn.textContent = 'Check Delivery';
            checkDeliveryBtn.disabled = false;
        }
    }, 1500);
}

// Check Delivery Availability
function checkDeliveryAvailability(address, zipCode) {
    // Simple distance calculation
    deliveryDistance = Math.floor(Math.random() * 15) + 1;
    deliveryFee = deliveryDistance <= 5 ? 0 : 5;
    isDeliveryAvailable = deliveryDistance <= 15;
    
    displayLocationResult();
    updateOrderSummary();
}

// Display Location Result
function displayLocationResult() {
    const resultContainer = document.getElementById('locationResult');
    if (!resultContainer) return;
    
    let resultHTML = '';
    
    if (isDeliveryAvailable) {
        const deliveryType = deliveryDistance <= 5 ? 'Standard' : 'Extended';
        
        resultHTML = `
            <div class="location-result-success">
                <h4>✅ Delivery Available!</h4>
                <p><strong>Distance:</strong> ${deliveryDistance} miles</p>
                <p><strong>Delivery Type:</strong> ${deliveryType}</p>
                <p><strong>Delivery Fee:</strong> ${deliveryFee === 0 ? 'FREE' : '$' + deliveryFee}</p>
            </div>
        `;
        
        // Enable proceed button
        const proceedBtn = document.getElementById('proceedBtn');
        if (proceedBtn) {
            proceedBtn.disabled = false;
        }
        
        showNotification('Great! We deliver to your area', 'success');
    } else {
        resultHTML = `
            <div class="location-result-error">
                <h4>❌ Delivery Not Available</h4>
                <p>We're sorry, but we don't currently deliver to your area.</p>
                <p><strong>Current service area:</strong> Greenwich, CT and surrounding areas within 15 miles.</p>
            </div>
        `;
        
        showNotification('Delivery not available in your area', 'error');
    }
    
    resultContainer.innerHTML = resultHTML;
    resultContainer.style.display = 'block';
}

// Show Address Suggestions
function showAddressSuggestions(query) {
    const suggestionsContainer = document.getElementById('addressSuggestions');
    if (!suggestionsContainer) return;
    
    const greenwichAddresses = [
        '123 Greenwich Avenue, Greenwich, CT 06830',
        '456 East Putnam Avenue, Greenwich, CT 06830',
        '789 West Putnam Avenue, Greenwich, CT 06830',
        '321 Sound Beach Avenue, Greenwich, CT 06830',
        '654 North Street, Greenwich, CT 06830'
    ];
    
    const suggestions = greenwichAddresses.filter(address => 
        address.toLowerCase().includes(query.toLowerCase())
    );
    
    if (suggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    let suggestionsHTML = '';
    suggestions.forEach(suggestion => {
        suggestionsHTML += `
            <div class="address-suggestion" onclick="selectAddress('${suggestion}')">
                📍 ${suggestion}
            </div>
        `;
    });
    
    suggestionsContainer.innerHTML = suggestionsHTML;
    suggestionsContainer.style.display = 'block';
}

function hideAddressSuggestions() {
    const suggestionsContainer = document.getElementById('addressSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

function selectAddress(address) {
    const addressInput = document.getElementById('addressInput');
    const zipCodeInput = document.getElementById('zipCodeInput');
    
    if (addressInput) addressInput.value = address;
    if (zipCodeInput) zipCodeInput.value = '06830';
    
    hideAddressSuggestions();
    
    // Auto-submit the form
    setTimeout(() => {
        const locationForm = document.getElementById('locationForm');
        if (locationForm) {
            locationForm.dispatchEvent(new Event('submit'));
        }
    }, 100);
}

// Update Cart Display
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
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
}

// Cart Functions
function updateQuantity(index, change) {
    if (index < 0 || index >= cart.length) return;
    
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
        updateOrderSummary();
    }
}

function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;
    
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
    updateOrderSummary();
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const navCartCount = document.getElementById('navCartCount');
    
    if (navCartCount) {
        navCartCount.textContent = cartCount;
    }
}

function updateOrderSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal + deliveryFee;
    
    const subtotalElement = document.getElementById('subtotal');
    const deliveryFeeElement = document.getElementById('deliveryFee');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (deliveryFeeElement) deliveryFeeElement.textContent = `$${deliveryFee.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

function proceedToDelivery() {
    if (!isDeliveryAvailable) {
        showNotification('Please check delivery availability first', 'error');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Please add items to your cart first', 'error');
        return;
    }
    
    showNotification('Proceeding to delivery setup...', 'success');
}

// Simple Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #333;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        border-left: 4px solid #4a7c59;
        max-width: 300px;
        font-weight: 600;
    `;
    
    if (type === 'error') {
        notification.style.borderLeftColor = '#f44336';
    } else if (type === 'success') {
        notification.style.borderLeftColor = '#4caf50';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add simple styles
function addCartStyles() {
    const styles = `
        <style>
            .cart-item {
                background: white;
                border-radius: 10px;
                padding: 1rem;
                margin-bottom: 1rem;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .cart-item-details {
                flex: 1;
            }
            
            .cart-item-details h4 {
                margin: 0 0 0.5rem 0;
                color: #333;
            }
            
            .cart-item-details p {
                margin: 0;
                color: #666;
            }
            
            .cart-item-quantity {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .cart-item-quantity button {
                width: 30px;
                height: 30px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 50%;
                cursor: pointer;
            }
            
            .cart-item-quantity button:hover {
                background: #f0f0f0;
            }
            
            .cart-item-total {
                font-weight: bold;
                color: #4a7c59;
                min-width: 80px;
                text-align: right;
            }
            
            .cart-item button:last-child {
                background: #f44336;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                cursor: pointer;
            }
            
            .location-result-success,
            .location-result-error {
                padding: 1rem;
                border-radius: 10px;
                margin-top: 1rem;
            }
            
            .location-result-success {
                background: #e8f5e8;
                border: 1px solid #4caf50;
            }
            
            .location-result-error {
                background: #ffebee;
                border: 1px solid #f44336;
            }
            
            .address-suggestion {
                padding: 0.5rem;
                cursor: pointer;
                border-bottom: 1px solid #eee;
            }
            
            .address-suggestion:hover {
                background: #f0f0f0;
            }
            
            #addressSuggestions {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 5px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                z-index: 1000;
                max-height: 200px;
                overflow-y: auto;
                display: none;
            }
            
            .form-group {
                position: relative;
                margin-bottom: 1rem;
            }
            
            .btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: 600;
                text-decoration: none;
                display: inline-block;
            }
            
            .btn-primary {
                background: #4a7c59;
                color: white;
            }
            
            .btn-secondary {
                background: #f0f0f0;
                color: #333;
            }
            
            .btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .btn-full {
                width: 100%;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Make functions globally available
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.selectAddress = selectAddress;
window.proceedToDelivery = proceedToDelivery; 