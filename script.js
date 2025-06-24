// Global variables
let currentSlideIndex = 1;
const totalSlides = 3;
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let cart = [];
let deliveryDistance = 0;
let deliveryFee = 0;
let customerAddress = '';
let customerZipCode = '';

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing DogDine...');
    initializeNavigation();
    initializeCounters();
    initializeTestimonials();
    initializeFeatureCards();
    initializeContactForm();
    initializeScrollAnimations();
    updateCartCount();
    initializeParallaxEffects();
    initializeInteractiveElements();
    loadCart();
});

// Navigation functionality
function initializeNavigation() {
    console.log('Initializing navigation...');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
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
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    });
}

// Counter Animation
function initializeCounters() {
    console.log('Initializing counters...');
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(counter, target) {
    const duration = 2000;
    const start = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * easeOutQuart);
        
        counter.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Testimonials Slider
function initializeTestimonials() {
    console.log('Initializing testimonials...');
    const slides = document.querySelectorAll('.testimonial-card');
    if (slides.length === 0) return;
    
    // Show first slide
    showSlide(1);
    
    // Auto-advance testimonials
    setInterval(() => {
        currentSlideIndex = currentSlideIndex % totalSlides + 1;
        showSlide(currentSlideIndex);
    }, 5000);
}

function showSlide(n) {
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    if (slides[n - 1]) slides[n - 1].classList.add('active');
    if (dots[n - 1]) dots[n - 1].classList.add('active');
}

function currentSlide(n) {
    currentSlideIndex = n;
    showSlide(n);
}

// Feature cards hover effects
function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        // Add staggered animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Parallax effect for hero cards
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroCards = document.querySelectorAll('.hero-card');
    
    heroCards.forEach((card, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        card.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.01}deg)`;
    });
});

// Plan selection functionality
function selectPlan() {
    showDeliveryCalendar();
}

// Delivery calendar modal
function showDeliveryCalendar() {
    const modalHTML = `
        <div class="modal-overlay" id="calendarModal">
            <div class="modal-content calendar-modal">
                <div class="modal-header">
                    <h3>Select Delivery Date & Time</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="calendar-info">
                        <p><strong>Delivery Details:</strong></p>
                        <ul>
                            <li>Monday-Friday delivery only</li>
                            <li>9:00 AM - 12:00 PM time slots</li>
                            <li>Greenwich, CT service area</li>
                            <li>Free delivery within 5 miles</li>
                        </ul>
                    </div>
                    <div class="calendar-container">
                        <div class="calendar-header">
                            <button class="calendar-nav" onclick="previousMonth()">&lt;</button>
                            <h4 id="currentMonth">January 2024</h4>
                            <button class="calendar-nav" onclick="nextMonth()">&gt;</button>
                        </div>
                        <div class="calendar-grid" id="calendarGrid">
                            <!-- Calendar will be generated here -->
                        </div>
                    </div>
                    <div class="time-slots" id="timeSlots" style="display: none;">
                        <h4>Select Time Slot</h4>
                        <div class="time-options">
                            <button class="time-slot" onclick="selectTime('9:00 AM')">9:00 AM</button>
                            <button class="time-slot" onclick="selectTime('10:00 AM')">10:00 AM</button>
                            <button class="time-slot" onclick="selectTime('11:00 AM')">11:00 AM</button>
                            <button class="time-slot" onclick="selectTime('12:00 PM')">12:00 PM</button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="proceedToPayment()" id="proceedBtn" disabled>
                        Proceed to Order
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    addCalendarStyles();
    initializeCalendar();
}

// Initialize calendar
function initializeCalendar() {
    updateCalendar();
}

// Update calendar display
function updateCalendar() {
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarGrid = document.getElementById('calendarGrid');
    
    if (!currentMonthElement || !calendarGrid) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;
    
    // Clear calendar grid
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate calendar days
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // Check if date is in current month
        if (date.getMonth() === month) {
            dayElement.textContent = date.getDate();
            
            // Check if date is available for delivery (Monday-Friday, future date)
            const dayOfWeek = date.getDay();
            const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5; // Monday = 1, Friday = 5
            const isFuture = date > new Date();
            
            if (isWeekday && isFuture) {
                dayElement.classList.add('available');
                dayElement.onclick = () => selectDate(date);
            } else {
                dayElement.classList.add('unavailable');
            }
        } else {
            dayElement.classList.add('other-month');
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

// Navigation functions
function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
}

// Select date
function selectDate(date) {
    selectedDate = date;
    
    // Update calendar display
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Find and select the clicked day
    const dayElements = document.querySelectorAll('.calendar-day');
    dayElements.forEach(day => {
        if (day.textContent == date.getDate() && day.classList.contains('available')) {
            day.classList.add('selected');
        }
    });
    
    // Show time slots
    document.getElementById('timeSlots').style.display = 'block';
    
    // Enable proceed button
    document.getElementById('proceedBtn').disabled = false;
}

// Select time
function selectTime(time) {
    selectedTime = time;
    
    // Update time slot display
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Find and select the clicked time slot
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        if (slot.textContent === time) {
            slot.classList.add('selected');
        }
    });
}

// Proceed to payment (simplified - no actual payment processing)
function proceedToPayment() {
    if (!selectedDate || !selectedTime) {
        showNotification('Please select a date and time', 'error');
        return;
    }
    
    showOrderConfirmation();
}

// Show order confirmation (simplified)
function showOrderConfirmation() {
    const orderDate = selectedDate.toLocaleDateString();
    const orderTime = selectedTime;
    const orderTotal = getCartTotal();
    
    const confirmationHTML = `
        <div class="modal-overlay" id="confirmationModal">
            <div class="modal-content confirmation-modal">
                <div class="modal-header">
                    <h3>Order Confirmation</h3>
                    <button class="modal-close" onclick="closeConfirmationModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="confirmation-success">
                        <div class="success-icon">✅</div>
                        <h4>Order Submitted Successfully!</h4>
                        <p>Thank you for choosing DogDine. We'll contact you shortly to confirm your order.</p>
                    </div>
                    <div class="order-details">
                        <h5>Order Details:</h5>
                        <div class="order-summary">
                            <div class="order-row">
                                <span>Delivery Date:</span>
                                <span>${orderDate}</span>
                            </div>
                            <div class="order-row">
                                <span>Delivery Time:</span>
                                <span>${orderTime}</span>
                            </div>
                            <div class="order-row">
                                <span>Total Amount:</span>
                                <span>$${orderTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="next-steps">
                        <h5>What's Next?</h5>
                        <ul>
                            <li>We'll call you within 24 hours to confirm your order</li>
                            <li>Payment will be collected upon delivery</li>
                            <li>Fresh food will be prepared and delivered on your selected date</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="closeConfirmationModal()">Done</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', confirmationHTML);
    addConfirmationStyles();
    
    // Clear cart
    cart = [];
    updateCartCount();
    localStorage.removeItem('cart');
}

// Close modals
function closePaymentModal() {
    const modal = document.getElementById('calendarModal');
    if (modal) {
        modal.remove();
    }
}

function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.remove();
    }
}

function closeModal() {
    closePaymentModal();
}

// Contact form functionality
function initializeContactForm() {
    console.log('Initializing contact form...');
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            this.reset();
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    console.log('Showing notification:', message, type);
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Cart functionality
function addToCart(productName, price) {
    console.log('Adding to cart:', productName, price);
    
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Simple notification
    showNotification(`${productName} added to cart!`);
    
    // Animate cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }
}

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
    const cartCountElement = document.getElementById('cart-count');
    
    if (navCartCount) navCartCount.textContent = cartCount;
    if (cartCountElement) cartCountElement.textContent = cartCount;
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function viewCart() {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    window.location.href = 'cart.html';
}

function showCartModal() {
    const modalHTML = `
        <div class="modal-overlay" id="cartModal">
            <div class="modal-content cart-modal">
                <div class="modal-header">
                    <h3>Your Cart</h3>
                    <button class="modal-close" onclick="closeCartModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div id="cartModalItems">
                        <!-- Cart items will be populated here -->
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="cart-total">
                        <strong>Total: $${getCartTotal().toFixed(2)}</strong>
                    </div>
                    <button class="btn btn-primary" onclick="proceedToCheckout()">Proceed to Checkout</button>
                    <button class="btn btn-secondary" onclick="closeCartModal()">Continue Shopping</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    addCartStyles();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartModalItems');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
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
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.remove();
    }
}

function proceedToCheckout() {
    closeCartModal();
    window.location.href = 'cart.html';
}

// Product detail modal
function viewProduct(productId) {
    console.log('Viewing product:', productId);
    
    const products = {
        'chicken-rice': {
            name: 'Chicken & Rice Blend',
            description: 'Lean chicken with brown rice and vegetables. Perfect for active dogs.',
            price: 18.00,
            ingredients: ['Chicken breast', 'Brown rice', 'Carrots', 'Peas', 'Sweet potato'],
            nutrition: {
                protein: '25%',
                fat: '12%',
                fiber: '4%',
                moisture: '70%'
            },
            icon: '🦴'
        },
        'salmon-sweet-potato': {
            name: 'Salmon & Sweet Potato',
            description: 'Omega-rich salmon with sweet potato. Great for skin and coat health.',
            price: 22.00,
            ingredients: ['Salmon', 'Sweet potato', 'Green beans', 'Carrots', 'Flaxseed'],
            nutrition: {
                protein: '28%',
                fat: '15%',
                fiber: '3%',
                moisture: '68%'
            },
            icon: '🐟'
        },
        'beef-vegetable': {
            name: 'Beef & Vegetable Mix',
            description: 'Premium beef with fresh vegetables. Ideal for growing puppies.',
            price: 20.00,
            ingredients: ['Ground beef', 'Broccoli', 'Carrots', 'Brown rice', 'Spinach'],
            nutrition: {
                protein: '26%',
                fat: '14%',
                fiber: '5%',
                moisture: '69%'
            },
            icon: '🥕'
        },
        'turkey-quinoa': {
            name: 'Turkey & Quinoa Bowl',
            description: 'Lean turkey with quinoa and green vegetables. Perfect for weight management.',
            price: 19.00,
            ingredients: ['Ground turkey', 'Quinoa', 'Kale', 'Carrots', 'Green beans'],
            nutrition: {
                protein: '24%',
                fat: '8%',
                fiber: '6%',
                moisture: '72%'
            },
            icon: '🌿'
        },
        'lamb-grains': {
            name: 'Lamb & Ancient Grains',
            description: 'Premium lamb with ancient grains and herbs. Great for sensitive stomachs.',
            price: 25.00,
            ingredients: ['Ground lamb', 'Quinoa', 'Millet', 'Rosemary', 'Carrots'],
            nutrition: {
                protein: '27%',
                fat: '16%',
                fiber: '4%',
                moisture: '67%'
            },
            icon: '🌱'
        }
    };
    
    const product = products[productId];
    if (!product) return;
    
    const modalHTML = `
        <div class="modal-overlay" id="productModal">
            <div class="modal-content product-modal">
                <div class="modal-header">
                    <h3>${product.name}</h3>
                    <button class="modal-close" onclick="closeProductModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="product-detail-content">
                        <div class="product-detail-image">
                            <span class="product-detail-icon">${product.icon}</span>
                        </div>
                        <div class="product-detail-info">
                            <p class="product-description">${product.description}</p>
                            <div class="product-price">$${product.price.toFixed(2)}</div>
                            
                            <div class="product-ingredients">
                                <h4>Ingredients:</h4>
                                <ul>
                                    ${product.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                                </ul>
                            </div>
                            
                            <div class="product-nutrition">
                                <h4>Nutrition (per serving):</h4>
                                <div class="nutrition-grid">
                                    <div class="nutrition-item">
                                        <span class="nutrition-label">Protein:</span>
                                        <span class="nutrition-value">${product.nutrition.protein}</span>
                                    </div>
                                    <div class="nutrition-item">
                                        <span class="nutrition-label">Fat:</span>
                                        <span class="nutrition-value">${product.nutrition.fat}</span>
                                    </div>
                                    <div class="nutrition-item">
                                        <span class="nutrition-label">Fiber:</span>
                                        <span class="nutrition-value">${product.nutrition.fiber}</span>
                                    </div>
                                    <div class="nutrition-item">
                                        <span class="nutrition-label">Moisture:</span>
                                        <span class="nutrition-value">${product.nutrition.moisture}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="addToCart('${product.name}', ${product.price}); closeProductModal();">
                        Add to Cart
                    </button>
                    <button class="btn btn-secondary" onclick="closeProductModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    addProductDetailStyles();
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.remove();
    }
}

// Load cart from localStorage on page load
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Add styles for cart modal
function addCartStyles() {
    const styles = `
        <style>
            .cart-modal {
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
            }
            
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
            
            .cart-total {
                text-align: right;
                font-size: 18px;
                margin-bottom: 15px;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Add styles for calendar modal
function addCalendarStyles() {
    const styles = `
        <style>
            .calendar-modal {
                max-width: 500px;
            }
            
            .calendar-info {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            
            .calendar-info ul {
                margin: 10px 0 0 0;
                padding-left: 20px;
            }
            
            .calendar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .calendar-nav {
                background: none;
                border: 1px solid #ddd;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .calendar-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 2px;
                margin-bottom: 20px;
            }
            
            .calendar-day-header {
                text-align: center;
                font-weight: bold;
                padding: 10px;
                background: #f8f9fa;
            }
            
            .calendar-day {
                text-align: center;
                padding: 10px;
                border: 1px solid #eee;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .calendar-day:hover {
                background: #f0f0f0;
            }
            
            .calendar-day.available {
                background: #e8f5e8;
                color: #2d5a2d;
            }
            
            .calendar-day.available:hover {
                background: #d4edda;
            }
            
            .calendar-day.selected {
                background: #28a745;
                color: white;
            }
            
            .calendar-day.unavailable {
                background: #f8f9fa;
                color: #ccc;
                cursor: not-allowed;
            }
            
            .calendar-day.other-month {
                background: #f8f9fa;
                color: #ccc;
            }
            
            .time-slots {
                margin-top: 20px;
            }
            
            .time-options {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-top: 10px;
            }
            
            .time-slot {
                padding: 10px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .time-slot:hover {
                background: #f0f0f0;
            }
            
            .time-slot.selected {
                background: #007bff;
                color: white;
                border-color: #007bff;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Add styles for confirmation modal
function addConfirmationStyles() {
    const styles = `
        <style>
            .confirmation-modal {
                max-width: 500px;
            }
            
            .confirmation-success {
                text-align: center;
                margin-bottom: 20px;
            }
            
            .success-icon {
                font-size: 48px;
                margin-bottom: 15px;
            }
            
            .order-details {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            
            .order-summary {
                margin-top: 10px;
            }
            
            .order-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            
            .next-steps {
                background: #e8f5e8;
                padding: 15px;
                border-radius: 8px;
            }
            
            .next-steps ul {
                margin: 10px 0 0 0;
                padding-left: 20px;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Add styles for product detail modal
function addProductDetailStyles() {
    const styles = `
        <style>
            .product-modal {
                max-width: 700px;
            }
            
            .product-detail-content {
                display: grid;
                grid-template-columns: 200px 1fr;
                gap: 30px;
                align-items: start;
            }
            
            .product-detail-image {
                text-align: center;
            }
            
            .product-detail-icon {
                font-size: 80px;
            }
            
            .product-description {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 20px;
            }
            
            .product-price {
                font-size: 24px;
                font-weight: bold;
                color: #28a745;
                margin-bottom: 20px;
            }
            
            .product-ingredients {
                margin-bottom: 20px;
            }
            
            .product-ingredients ul {
                margin: 10px 0 0 0;
                padding-left: 20px;
            }
            
            .nutrition-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-top: 10px;
            }
            
            .nutrition-item {
                display: flex;
                justify-content: space-between;
                padding: 8px;
                background: #f8f9fa;
                border-radius: 4px;
            }
            
            .nutrition-label {
                font-weight: 500;
            }
            
            .nutrition-value {
                color: #666;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Make functions globally available for HTML onclick events
window.addToCart = addToCart;
window.viewCart = viewCart;
window.viewProduct = viewProduct;
window.currentSlide = currentSlide;
window.selectPlan = selectPlan;
window.proceedToPayment = proceedToPayment;
window.closePaymentModal = closePaymentModal;
window.closeConfirmationModal = closeConfirmationModal;
window.closeProductModal = closeProductModal;
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;
window.selectDate = selectDate;
window.selectTime = selectTime; 