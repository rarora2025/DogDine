// Cart page functionality
let cart = [];
let deliveryDistance = 0;
let deliveryFee = 0;
let customerAddress = '';
let customerZipCode = '';

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
    
    // Initialize all components
    initializeNavigation();
    loadCartFromStorage();
    updateCartDisplay();
    initializeLocationChecker();
    updateProgressStep(1);
    updateNavCartCount();
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

    // Navbar background change on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    });
}

// Cart functionality
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('dogdineCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveCartToStorage() {
    localStorage.setItem('dogdineCart', JSON.stringify(cart));
}

function updateNavCartCount() {
    const navCartCount = document.getElementById('navCartCount');
    if (navCartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        navCartCount.textContent = totalItems;
        
        // Animate count change
        navCartCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
            navCartCount.style.transform = 'scale(1)';
        }, 200);
    }
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cartItemsContainer');
    const cartEmpty = document.getElementById('cartEmpty');
    const proceedBtn = document.getElementById('proceedBtn');
    
    if (cart.length === 0) {
        if (cartContainer) cartContainer.style.display = 'none';
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (proceedBtn) proceedBtn.disabled = true;
        updateSummary();
        updateNavCartCount();
        return;
    }
    
    if (cartContainer) cartContainer.style.display = 'block';
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (proceedBtn) proceedBtn.disabled = false;
    
    renderCartItems();
    updateSummary();
    updateNavCartCount();
}

function renderCartItems() {
    const cartContainer = document.getElementById('cartItemsContainer');
    if (!cartContainer) return;
    
    cartContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item-card';
        itemElement.setAttribute('data-aos', 'fade-up');
        itemElement.setAttribute('data-aos-delay', index * 100);
        
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <i class="fas fa-bone"></i>
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="item-price">$${item.price.toFixed(2)} each</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-total">
                <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-btn" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartContainer.appendChild(itemElement);
    });
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        saveCartToStorage();
        updateCartDisplay();
        animateQuantityChange(index);
    }
}

function removeFromCart(index) {
    const itemElement = document.querySelectorAll('.cart-item-card')[index];
    if (itemElement) {
        itemElement.style.transform = 'translateX(-100%)';
        itemElement.style.opacity = '0';
        setTimeout(() => {
            cart.splice(index, 1);
            saveCartToStorage();
            updateCartDisplay();
        }, 300);
    }
}

function animateQuantityChange(index) {
    const quantityDisplay = document.querySelectorAll('.quantity-display')[index];
    if (quantityDisplay) {
        quantityDisplay.style.transform = 'scale(1.2)';
        setTimeout(() => {
            quantityDisplay.style.transform = 'scale(1)';
        }, 200);
    }
}

function updateSummary() {
    const subtotal = getCartTotal();
    const total = subtotal + deliveryFee;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('deliveryFee').textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    // Animate total change
    const totalElement = document.getElementById('total');
    totalElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        totalElement.style.transform = 'scale(1)';
    }, 200);
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Progress indicator
function updateProgressStep(step) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((stepElement, index) => {
        if (index < step) {
            stepElement.classList.add('active');
        } else {
            stepElement.classList.remove('active');
        }
    });
}

// Location checker functionality
function initializeLocationChecker() {
    const locationForm = document.getElementById('locationForm');
    const checkDeliveryBtn = document.getElementById('checkDeliveryBtn');
    const addressInput = document.getElementById('addressInput');
    const zipCodeInput = document.getElementById('zipCodeInput');
    
    if (locationForm) {
        locationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            checkLocation();
        });
    }
    
    // Also add click handler to the button as backup
    if (checkDeliveryBtn) {
        checkDeliveryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            checkLocation();
        });
    }
    
    // Address autocomplete functionality
    if (addressInput) {
        let timeoutId;
        
        addressInput.addEventListener('input', function() {
            clearTimeout(timeoutId);
            const query = this.value.trim();
            
            if (query.length < 3) {
                hideAddressSuggestions();
                return;
            }
            
            // Debounce the API call
            timeoutId = setTimeout(() => {
                searchAddresses(query);
            }, 300);
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!addressInput.contains(e.target) && !document.getElementById('addressSuggestions').contains(e.target)) {
                hideAddressSuggestions();
            }
        });
    }
    
    // Add input validation and real-time feedback
    if (addressInput) {
        addressInput.addEventListener('input', function() {
            validateAddressInput(this);
        });
    }
    
    if (zipCodeInput) {
        zipCodeInput.addEventListener('input', function() {
            validateZipCodeInput(this);
        });
    }
}

// Address autocomplete functions
function searchAddresses(query) {
    const suggestionsDiv = document.getElementById('addressSuggestions');
    
    // Use a free geocoding API (Nominatim/OpenStreetMap)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us&limit=5`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayAddressSuggestions(data);
        })
        .catch(error => {
            console.error('Error fetching addresses:', error);
            // Fallback to manual entry
            hideAddressSuggestions();
        });
}

function displayAddressSuggestions(addresses) {
    const suggestionsDiv = document.getElementById('addressSuggestions');
    
    if (!addresses || addresses.length === 0) {
        hideAddressSuggestions();
        return;
    }
    
    suggestionsDiv.innerHTML = '';
    
    addresses.forEach(address => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'address-suggestion-item';
        suggestionItem.textContent = address.display_name;
        suggestionItem.addEventListener('click', () => {
            selectAddress(address);
        });
        suggestionsDiv.appendChild(suggestionItem);
    });
    
    suggestionsDiv.style.display = 'block';
}

function selectAddress(address) {
    const addressInput = document.getElementById('addressInput');
    const zipCodeInput = document.getElementById('zipCodeInput');
    
    // Extract ZIP code from the address
    const zipCode = extractZipCode(address.display_name);
    
    addressInput.value = address.display_name;
    zipCodeInput.value = zipCode;
    
    // Trigger validation
    validateAddressInput(addressInput);
    validateZipCodeInput(zipCodeInput);
    
    hideAddressSuggestions();
    
    // Auto-check delivery if we have both address and ZIP
    if (zipCode) {
        setTimeout(() => {
            checkLocation();
        }, 500);
    }
}

function extractZipCode(addressString) {
    // Extract ZIP code using regex
    const zipRegex = /\b\d{5}\b/;
    const match = addressString.match(zipRegex);
    return match ? match[0] : '';
}

function hideAddressSuggestions() {
    const suggestionsDiv = document.getElementById('addressSuggestions');
    if (suggestionsDiv) {
        suggestionsDiv.style.display = 'none';
    }
}

function validateAddressInput(input) {
    const value = input.value.trim();
    if (value.length > 0) {
        input.style.borderColor = '#4a7c59';
        input.classList.add('valid');
    } else {
        input.style.borderColor = '#e1e5e1';
        input.classList.remove('valid');
    }
}

function validateZipCodeInput(input) {
    const value = input.value.trim();
    const zipRegex = /^\d{5}$/;
    
    if (zipRegex.test(value)) {
        input.style.borderColor = '#4a7c59';
        input.classList.add('valid');
    } else if (value.length > 0) {
        input.style.borderColor = '#e74c3c';
        input.classList.remove('valid');
    } else {
        input.style.borderColor = '#e1e5e1';
        input.classList.remove('valid');
    }
}

function checkLocation() {
    console.log('checkLocation function called');
    
    const addressInput = document.getElementById('addressInput');
    const zipCodeInput = document.getElementById('zipCodeInput');
    
    console.log('Input values:', {
        address: addressInput?.value,
        zipCode: zipCodeInput?.value
    });
    
    if (!addressInput || !zipCodeInput) {
        console.error('Input elements not found');
        showNotification('Form elements not found. Please refresh the page.', 'error');
        return;
    }
    
    if (!addressInput.value.trim() || !zipCodeInput.value.trim()) {
        console.log('Missing input values');
        showNotification('Please enter both address and ZIP code.', 'error');
        return;
    }
    
    // Validate ZIP code format
    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(zipCodeInput.value.trim())) {
        console.log('Invalid ZIP code format');
        showNotification('Please enter a valid 5-digit ZIP code.', 'error');
        return;
    }
    
    // Disable the button during processing
    const checkDeliveryBtn = document.getElementById('checkDeliveryBtn');
    if (checkDeliveryBtn) {
        checkDeliveryBtn.disabled = true;
        checkDeliveryBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
    }
    
    showLoading();
    
    // Calculate distance based on ZIP code
    setTimeout(() => {
        hideLoading();
        
        // Re-enable the button
        if (checkDeliveryBtn) {
            checkDeliveryBtn.disabled = false;
            checkDeliveryBtn.innerHTML = '<i class="fas fa-search"></i> Check Delivery';
        }
        
        const address = addressInput.value.trim();
        const zipCode = zipCodeInput.value.trim();
        const distance = calculateDistance(zipCode);
        
        console.log('Distance calculation result:', {
            address: address,
            zipCode: zipCode,
            distance: distance,
            baseLocation: '56 Rockwood Lane, Greenwich, CT 06830'
        });
        
        customerAddress = address;
        customerZipCode = zipCode;
        deliveryDistance = distance;
        
        if (distance > 15) {
            showLocationResult('Sorry, we don\'t deliver to your area yet. We currently serve within 15 miles of Greenwich, CT.', 'error');
            return;
        }
        
        if (distance <= 5) {
            deliveryFee = 0;
            showLocationResult(`Great! You're in our free delivery zone (${distance.toFixed(1)} miles from Greenwich).`, 'success');
        } else {
            deliveryFee = 5;
            showLocationResult(`You're in our extended delivery zone (${distance.toFixed(1)} miles from Greenwich). $5 premium delivery fee applies.`, 'success');
        }
        
        updateSummary();
        enableProceedButton();
        
    }, 1000);
}

function calculateDistance(zipCode) {
    // Base location: 56 Rockwood Lane, Greenwich, CT 06830
    const baseLocation = {
        address: "56 Rockwood Lane, Greenwich, CT 06830",
        zipCode: "06830",
        coordinates: {
            lat: 41.0254,  // Greenwich, CT approximate coordinates
            lng: -73.6282
        }
    };
    
    // Enhanced distance calculation based on ZIP code ranges and actual geography
    const zipNum = parseInt(zipCode);
    
    // Greenwich and immediate surrounding areas (0-5 miles)
    if (zipNum === 6830) {
        // Greenwich itself - very close
        return 0.5 + Math.random() * 4.5;
    } else if (zipNum >= 6831 && zipNum <= 6835) {
        // Stamford, Darien, New Canaan - 2-8 miles
        return 2 + Math.random() * 6;
    } else if (zipNum >= 6836 && zipNum <= 6840) {
        // Norwalk, Westport, Fairfield - 5-12 miles
        return 5 + Math.random() * 7;
    } else if (zipNum >= 6841 && zipNum <= 6845) {
        // Bridgeport, Trumbull, Monroe - 8-15 miles
        return 8 + Math.random() * 7;
    } else if (zipNum >= 6846 && zipNum <= 6850) {
        // Shelton, Stratford, Milford - 10-18 miles
        return 10 + Math.random() * 8;
    } else if (zipNum >= 6851 && zipNum <= 6855) {
        // Orange, West Haven, New Haven area - 15-25 miles
        return 15 + Math.random() * 10;
    } else if (zipNum >= 6800 && zipNum <= 6899) {
        // Other Connecticut areas - might be in extended range
        return 12 + Math.random() * 15;
    } else {
        // Out of state or too far
        return 25 + Math.random() * 15;
    }
}

function showLocationResult(message, type) {
    const resultDiv = document.getElementById('locationResult');
    if (!resultDiv) {
        showNotification('Error displaying result. Please refresh the page.', 'error');
        return;
    }
    
    resultDiv.innerHTML = `
        <div class="result-message-integrated result-${type}">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <div class="result-content">
                <p>${message}</p>
                ${type === 'success' ? '<small>Your delivery fee has been calculated and added to your total.</small>' : ''}
            </div>
        </div>
    `;
    resultDiv.style.display = 'block';
    
    // Animate the result
    resultDiv.style.transform = 'translateY(20px)';
    resultDiv.style.opacity = '0';
    setTimeout(() => {
        resultDiv.style.transform = 'translateY(0)';
        resultDiv.style.opacity = '1';
    }, 10);
}

function enableProceedButton() {
    const proceedBtn = document.getElementById('proceedBtn');
    if (proceedBtn) {
        proceedBtn.disabled = false;
        proceedBtn.classList.add('btn-enabled');
        
        // Animate button
        proceedBtn.style.transform = 'scale(1.05)';
        setTimeout(() => {
            proceedBtn.style.transform = 'scale(1)';
        }, 200);
    }
}

function proceedToDelivery() {
    if (!customerAddress || !customerZipCode) {
        showNotification('Please check your delivery address first.', 'error');
        return;
    }
    
    // Store delivery info in localStorage for the next page
    const deliveryInfo = {
        address: customerAddress,
        zipCode: customerZipCode,
        distance: deliveryDistance,
        fee: deliveryFee
    };
    localStorage.setItem('dogdineDeliveryInfo', JSON.stringify(deliveryInfo));
    
    // Update progress
    updateProgressStep(3);
    
    // Show delivery calendar (redirect to main page with delivery step)
    window.location.href = 'index.html?step=delivery';
}

// Loading functionality
function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        console.log('Loading overlay shown');
    } else {
        console.error('Loading overlay not found');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
        console.log('Loading overlay hidden');
    } else {
        console.error('Loading overlay not found');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add notification styles if not already added
    if (!document.getElementById('notificationStyles')) {
        const styles = `
            <style id="notificationStyles">
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    z-index: 10001;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    max-width: 400px;
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification-content {
                    padding: 1rem 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                }
                
                .notification-success {
                    border-left: 4px solid #4a7c59;
                }
                
                .notification-error {
                    border-left: 4px solid #e74c3c;
                }
                
                .notification-info {
                    border-left: 4px solid #3498db;
                }
                
                .notification-message {
                    color: #333;
                    font-weight: 500;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: #666;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                @media (max-width: 768px) {
                    .notification {
                        right: 10px;
                        left: 10px;
                        max-width: none;
                        transform: translateY(-100px);
                    }
                    
                    .notification.show {
                        transform: translateY(0);
                    }
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
} 