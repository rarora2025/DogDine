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
    initializeCounters();
    initializeTestimonials();
    initializeFeatureCards();
    initializeContactForm();
    updateCartCount();
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

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

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

// Counter Animation
function initializeCounters() {
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
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Testimonials Slider
function initializeTestimonials() {
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
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Parallax effect for hero cards
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroCards = document.querySelectorAll('.hero-card');
    
    heroCards.forEach((card, index) => {
        const speed = 0.5 + (index * 0.1);
        card.style.transform = `translateY(${scrolled * speed}px)`;
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
                            <li>• Delivery available Monday through Friday</li>
                            <li>• Delivery times: 9:00 AM - 12:00 PM</li>
                            <li>• Service area: Greenwich, CT</li>
                            <li>• Price: $25 per order</li>
                        </ul>
                    </div>
                    <div class="calendar-container">
                        <div class="calendar-header">
                            <button class="calendar-nav" onclick="previousMonth()">&lt;</button>
                            <h4 id="currentMonth">Loading...</h4>
                            <button class="calendar-nav" onclick="nextMonth()">&gt;</button>
                        </div>
                        <div class="calendar-grid">
                            <div class="calendar-days">
                                <span>Sun</span>
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                            </div>
                            <div id="calendarDates" class="calendar-dates"></div>
                        </div>
                    </div>
                    <div class="time-selection" id="timeSelection" style="display: none;">
                        <h4>Select Delivery Time:</h4>
                        <div class="time-slots">
                            <button class="time-slot" onclick="selectTime('9:00 AM')">9:00 AM</button>
                            <button class="time-slot" onclick="selectTime('10:00 AM')">10:00 AM</button>
                            <button class="time-slot" onclick="selectTime('11:00 AM')">11:00 AM</button>
                            <button class="time-slot" onclick="selectTime('12:00 PM')">12:00 PM</button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button class="btn btn-primary" id="proceedToPayment" onclick="proceedToPayment()" style="display: none;">Proceed to Payment</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    addCalendarStyles();
    
    setTimeout(() => {
        const modal = document.getElementById('calendarModal');
        if (modal) {
            modal.classList.add('show');
            initializeCalendar();
        }
    }, 10);
}

// Calendar functionality
function initializeCalendar() {
    updateCalendar();
}

function updateCalendar() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    const currentMonthElement = document.getElementById('currentMonth');
    if (currentMonthElement) {
        currentMonthElement.textContent = 
            `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    
    const calendarDates = document.getElementById('calendarDates');
    if (!calendarDates) return;
    
    calendarDates.innerHTML = '';
    
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dateElement = document.createElement('div');
        dateElement.className = 'calendar-date';
        
        if (date.getMonth() === currentDate.getMonth()) {
            dateElement.textContent = date.getDate();
            
            // Check if it's a Monday and in the future
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const checkDate = new Date(date);
            checkDate.setHours(0, 0, 0, 0);
            
            if (date.getDay() >= 1 && date.getDay() <= 5 && checkDate >= today) {
                dateElement.classList.add('available-weekday');
                dateElement.onclick = () => selectDate(date);
            } else {
                dateElement.classList.add('unavailable');
            }
        } else {
            dateElement.classList.add('other-month');
        }
        
        calendarDates.appendChild(dateElement);
    }
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
}

function selectDate(date) {
    selectedDate = date;
    selectedTime = null;
    
    // Update calendar display
    document.querySelectorAll('.calendar-date').forEach(el => {
        el.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Show time selection
    const timeSelection = document.getElementById('timeSelection');
    const proceedButton = document.getElementById('proceedToPayment');
    if (timeSelection) timeSelection.style.display = 'block';
    if (proceedButton) proceedButton.style.display = 'none';
    
    // Reset time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
}

function selectTime(time) {
    selectedTime = time;
    
    // Update time slots display
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Show proceed button
    const proceedButton = document.getElementById('proceedToPayment');
    if (proceedButton) proceedButton.style.display = 'inline-block';
}

function proceedToPayment() {
    if (!selectedDate || !selectedTime) {
        showNotification('Please select both a date and time.', 'error');
        return;
    }
    
    closeModal();
    showPaymentPage();
}

// Payment page
function showPaymentPage() {
    const dateStr = selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const modalHTML = `
        <div class="modal-overlay" id="paymentModal">
            <div class="modal-content payment-modal">
                <div class="modal-header">
                    <h3>Complete Your Order</h3>
                    <button class="modal-close" onclick="closePaymentModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="order-summary">
                        <h4>Order Summary</h4>
                        <div id="orderItems"></div>
                        <div class="summary-item">
                            <span>Subtotal:</span>
                            <span>$${getCartTotal().toFixed(2)}</span>
                        </div>
                        <div class="summary-item">
                            <span>Delivery Fee:</span>
                            <span>$${deliveryFee.toFixed(2)}</span>
                        </div>
                        <div class="summary-total">
                            <span>Total:</span>
                            <span>$${(getCartTotal() + deliveryFee).toFixed(2)}</span>
                        </div>
                        <div class="summary-item">
                            <span>Delivery Date:</span>
                            <span>${dateStr}</span>
                        </div>
                        <div class="summary-item">
                            <span>Delivery Time:</span>
                            <span>${selectedTime}</span>
                        </div>
                        <div class="summary-item">
                            <span>Delivery Address:</span>
                            <span>${customerAddress}, ${customerZipCode}</span>
                        </div>
                    </div>
                    
                    <form id="paymentForm" class="payment-form">
                        <div class="form-section">
                            <h4>Contact Information</h4>
                            <div class="form-group">
                                <input type="text" id="customerName" name="customerName" placeholder="Full Name" required>
                            </div>
                            <div class="form-group">
                                <input type="email" id="customerEmail" name="customerEmail" placeholder="Email Address" required>
                            </div>
                            <div class="form-group">
                                <input type="tel" id="customerPhone" name="customerPhone" placeholder="Phone Number" required>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h4>Dog Information</h4>
                            <div class="form-group">
                                <input type="text" id="dogName" name="dogName" placeholder="Dog's Name" required>
                            </div>
                            <div class="form-group">
                                <select id="dogSize" name="dogSize" required>
                                    <option value="">Select Dog Size</option>
                                    <option value="small">Small (under 20 lbs)</option>
                                    <option value="medium">Medium (20-50 lbs)</option>
                                    <option value="large">Large (over 50 lbs)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <textarea id="dietaryNotes" name="dietaryNotes" placeholder="Any dietary restrictions or special needs?" rows="3"></textarea>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h4>Order Confirmation</h4>
                            <div class="order-notice">
                                <p><strong>Note:</strong> This is a demo order. No payment will be processed.</p>
                                <p>Your order will be sent to our team for review. We'll contact you to confirm details and arrange payment.</p>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closePaymentModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="submitOrder()">Submit Order</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    addPaymentStyles();
    
    setTimeout(() => {
        const modal = document.getElementById('paymentModal');
        if (modal) {
            modal.classList.add('show');
            updateOrderItems();
        }
    }, 10);
}

function updateOrderItems() {
    const orderItems = document.getElementById('orderItems');
    if (!orderItems) return;
    
    orderItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'summary-item';
        itemElement.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderItems.appendChild(itemElement);
    });
}

function submitOrder() {
    const form = document.getElementById('paymentForm');
    const formData = new FormData(form);
    
    // Basic validation
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'dogName', 'dogSize'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!formData.get(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.get('customerEmail'))) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Send email notification
    sendOrderEmail(formData);
    
    // Show success message
    showNotification('Order submitted successfully! We\'ll contact you soon.', 'success');
    
    // Close payment modal and show confirmation
    setTimeout(() => {
        closePaymentModal();
        showOrderConfirmation();
    }, 2000);
}

function sendOrderEmail(formData) {
    const orderDetails = {
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        customerPhone: formData.get('customerPhone'),
        dogName: formData.get('dogName'),
        dogSize: formData.get('dogSize'),
        dietaryNotes: formData.get('dietaryNotes'),
        deliveryDate: selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        deliveryTime: selectedTime,
        deliveryAddress: customerAddress,
        deliveryZipCode: customerZipCode,
        deliveryDistance: deliveryDistance,
        deliveryFee: deliveryFee,
        cart: cart,
        total: getCartTotal() + deliveryFee
    };
    
    // In a real implementation, this would send an actual email
    // For now, we'll just log the order details
    console.log('Order Details:', orderDetails);
    
    // Simulate sending email to arora.nisha@gmail.com
    const emailBody = `
New DogDine Order Received

Customer Information:
- Name: ${orderDetails.customerName}
- Email: ${orderDetails.customerEmail}
- Phone: ${orderDetails.customerPhone}

Dog Information:
- Name: ${orderDetails.dogName}
- Size: ${orderDetails.dogSize}
- Dietary Notes: ${orderDetails.dietaryNotes || 'None'}

Delivery Information:
- Date: ${orderDetails.deliveryDate}
- Time: ${orderDetails.deliveryTime}
- Address: ${orderDetails.deliveryAddress}
- ZIP Code: ${orderDetails.deliveryZipCode}
- Distance: ${orderDetails.deliveryDistance.toFixed(1)} miles
- Delivery Fee: $${orderDetails.deliveryFee.toFixed(2)}

Order Items:
${orderDetails.cart.map(item => `- ${item.name} (x${item.quantity}): $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Total: $${orderDetails.total.toFixed(2)}

This order was submitted through the website demo.
    `;
    
    console.log('Email to arora.nisha@gmail.com:', emailBody);
    
    // In production, you would use a service like EmailJS, SendGrid, or your own email server
    // For now, we'll just show a notification
    showNotification('Order details sent to arora.nisha@gmail.com', 'info');
}

function showOrderConfirmation() {
    const dateStr = selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const modalHTML = `
        <div class="modal-overlay" id="confirmationModal">
            <div class="modal-content confirmation-modal">
                <div class="modal-header">
                    <h3>Order Submitted!</h3>
                </div>
                <div class="modal-body">
                    <div class="confirmation-content">
                        <div class="success-icon">✓</div>
                        <h4>Thank you for your order!</h4>
                        <p>Your order has been submitted and sent to our team for review.</p>
                        <div class="delivery-info">
                            <strong>Delivery: ${dateStr} at ${selectedTime}</strong>
                        </div>
                        <p>We'll contact you within 24 hours to confirm your order details and arrange payment.</p>
                        <p>If you have any questions, please contact us at arora.nisha@gmail.com</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="closeConfirmationModal()">Done</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    addConfirmationStyles();
    
    setTimeout(() => {
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
    
    // Clear cart after successful order
    cart = [];
    updateCartCount();
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('calendarModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Initialize payment methods
function initializePaymentMethods() {
    // Initialize PayPal
    if (typeof paypal !== 'undefined') {
        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '25.00'
                        },
                        description: 'DogDine Weekly Dog Food Plan'
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    // Payment successful
                    showNotification('Payment successful! Processing your order...', 'success');
                    setTimeout(() => {
                        closePaymentModal();
                        showOrderConfirmation();
                    }, 2000);
                });
            },
            onError: function(err) {
                showNotification('Payment failed. Please try again.', 'error');
            }
        }).render('#paypal-button-container');
    }
    
    // Handle payment method selection
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const paypalContainer = document.getElementById('paypal-button-container');
            const stripeContainer = document.getElementById('stripe-button-container');
            
            if (this.value === 'paypal') {
                if (paypalContainer) paypalContainer.style.display = 'block';
                if (stripeContainer) stripeContainer.style.display = 'none';
            } else {
                if (paypalContainer) paypalContainer.style.display = 'none';
                if (stripeContainer) stripeContainer.style.display = 'block';
            }
        });
    });
}

// Process Stripe payment
function processStripePayment() {
    // Validate form first
    const form = document.getElementById('paymentForm');
    const formData = new FormData(form);
    
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'address', 'zipCode', 'dogName', 'dogSize'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!formData.get(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Simulate payment processing
    showNotification('Payment successful! Processing your order...', 'success');
    setTimeout(() => {
        closePaymentModal();
        showOrderConfirmation();
    }, 2000);
}

// Contact form handling
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you! We\'ll contact you within 24 hours.', 'success');
            contactForm.reset();
        });
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

// Add calendar styles
function addCalendarStyles() {
    if (!document.getElementById('calendarStyles')) {
        const styles = `
            <style id="calendarStyles">
                .modal-overlay {
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
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .modal-overlay.show {
                    opacity: 1;
                }
                
                .modal-content {
                    background: white;
                    border-radius: 15px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    transform: scale(0.7);
                    transition: transform 0.3s ease;
                }
                
                .modal-overlay.show .modal-content {
                    transform: scale(1);
                }
                
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #e1e5e1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .modal-header h3 {
                    color: #2c5530;
                    margin: 0;
                }
                
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .modal-body {
                    padding: 1.5rem;
                }
                
                .modal-footer {
                    padding: 1.5rem;
                    border-top: 1px solid #e1e5e1;
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                }
                
                @media (max-width: 768px) {
                    .modal-footer {
                        flex-direction: column;
                    }
                }
                
                .calendar-modal {
                    max-width: 600px !important;
                }
                
                .calendar-info {
                    background: #f8faf9;
                    padding: 1rem;
                    border-radius: 10px;
                    margin-bottom: 1.5rem;
                }
                
                .calendar-info ul {
                    margin: 0.5rem 0 0 0;
                    padding-left: 1rem;
                }
                
                .calendar-info li {
                    margin-bottom: 0.25rem;
                    color: #666;
                }
                
                .calendar-container {
                    margin-bottom: 1.5rem;
                }
                
                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                
                .calendar-nav {
                    background: #4a7c59;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1.2rem;
                }
                
                .calendar-grid {
                    border: 1px solid #e1e5e1;
                    border-radius: 10px;
                    overflow: hidden;
                }
                
                .calendar-days {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    background: #4a7c59;
                    color: white;
                    font-weight: 600;
                }
                
                .calendar-days span {
                    padding: 0.75rem;
                    text-align: center;
                }
                
                .calendar-dates {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                }
                
                .calendar-date {
                    padding: 0.75rem;
                    text-align: center;
                    cursor: pointer;
                    border-bottom: 1px solid #e1e5e1;
                    border-right: 1px solid #e1e5e1;
                    transition: background-color 0.3s ease;
                }
                
                .calendar-date:nth-child(7n) {
                    border-right: none;
                }
                
                .calendar-date.available-weekday {
                    background: #e8f5e8;
                    color: #2c5530;
                    font-weight: 600;
                }
                
                .calendar-date.available-weekday:hover {
                    background: #4a7c59;
                    color: white;
                }
                
                .calendar-date.selected {
                    background: #4a7c59;
                    color: white;
                }
                
                .calendar-date.unavailable {
                    color: #ccc;
                    cursor: not-allowed;
                }
                
                .calendar-date.other-month {
                    color: #ccc;
                    cursor: not-allowed;
                }
                
                .time-selection {
                    margin-top: 1.5rem;
                }
                
                .time-slots {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 0.5rem;
                    margin-top: 1rem;
                }
                
                .time-slot {
                    padding: 0.75rem;
                    border: 2px solid #e1e5e1;
                    background: white;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .time-slot:hover {
                    border-color: #4a7c59;
                }
                
                .time-slot.selected {
                    background: #4a7c59;
                    color: white;
                    border-color: #4a7c59;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Add payment styles
function addPaymentStyles() {
    if (!document.getElementById('paymentStyles')) {
        const styles = `
            <style id="paymentStyles">
                .payment-modal {
                    max-width: 700px !important;
                    max-height: 90vh !important;
                }
                
                .order-summary {
                    background: #f8faf9;
                    padding: 1.5rem;
                    border-radius: 10px;
                    margin-bottom: 2rem;
                }
                
                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    color: #666;
                }
                
                .summary-total {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #e1e5e1;
                    font-weight: 700;
                    color: #2c5530;
                    font-size: 1.1rem;
                }
                
                .payment-form {
                    max-height: 60vh;
                    overflow-y: auto;
                }
                
                .form-section {
                    margin-bottom: 2rem;
                }
                
                .form-section h4 {
                    color: #2c5530;
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid #e8f5e8;
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                
                .payment-methods {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                
                .payment-option {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    border: 2px solid #e1e5e1;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .payment-option:hover {
                    border-color: #4a7c59;
                    background: #f8faf9;
                }
                
                .payment-option input[type="radio"] {
                    margin: 0;
                }
                
                .payment-option input[type="radio"]:checked + label {
                    color: #4a7c59;
                    font-weight: 600;
                }
                
                .payment-option label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    font-size: 1.1rem;
                }
                
                .payment-option i {
                    font-size: 1.5rem;
                }
                
                .payment-option i.fa-paypal {
                    color: #003087;
                }
                
                .payment-option i.fa-credit-card {
                    color: #6772e5;
                }
                
                .payment-button-container {
                    margin-top: 1rem;
                }
                
                #paypal-button-container {
                    width: 100%;
                    max-width: 400px;
                }
                
                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .payment-methods {
                        gap: 0.75rem;
                    }
                    
                    .payment-option {
                        padding: 0.75rem;
                    }
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Add confirmation styles
function addConfirmationStyles() {
    if (!document.getElementById('confirmationStyles')) {
        const styles = `
            <style id="confirmationStyles">
                .confirmation-modal {
                    max-width: 500px !important;
                }
                
                .confirmation-content {
                    text-align: center;
                    padding: 1rem 0;
                }
                
                .success-icon {
                    font-size: 4rem;
                    color: #4a7c59;
                    margin-bottom: 1rem;
                }
                
                .delivery-info {
                    background: #e8f5e8;
                    padding: 1rem;
                    border-radius: 10px;
                    margin: 1rem 0;
                    color: #2c5530;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Cart functionality
function addToCart(productName, price) {
    // Load existing cart from localStorage
    let cart = [];
    const savedCart = localStorage.getItem('dogdineCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
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
    
    // Save to localStorage
    localStorage.setItem('dogdineCart', JSON.stringify(cart));
    
    updateCartCount();
    showNotification(`${productName} added to cart!`, 'success');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCartDisplay();
        updateCartCount();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const navCartCount = document.getElementById('navCartCount');
    
    const savedCart = localStorage.getItem('dogdineCart');
    let cart = [];
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) cartCount.textContent = totalItems;
    if (navCartCount) {
        navCartCount.textContent = totalItems;
        // Animate count change
        navCartCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
            navCartCount.style.transform = 'scale(1)';
        }, 200);
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function viewCart() {
    const savedCart = localStorage.getItem('dogdineCart');
    let cart = [];
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'info');
        return;
    }
    
    // Redirect to cart page
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
                    <div id="cartItems" class="cart-items"></div>
                    <div class="cart-summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>$${getCartTotal().toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Delivery Fee:</span>
                            <span>$${deliveryFee.toFixed(2)}</span>
                        </div>
                        <div class="summary-total">
                            <span>Total:</span>
                            <span>$${(getCartTotal() + deliveryFee).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeCartModal()">Continue Shopping</button>
                    <button class="btn btn-primary" onclick="proceedToCheckout()">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    addCartStyles();
    
    setTimeout(() => {
        const modal = document.getElementById('cartModal');
        if (modal) {
            modal.classList.add('show');
            updateCartDisplay();
        }
    }, 10);
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
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
            <button class="cart-item-remove" onclick="removeFromCart(${index})">&times;</button>
        `;
        cartItems.appendChild(itemElement);
    });
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function proceedToCheckout() {
    closeCartModal();
    showLocationChecker();
}

// Location checker
function showLocationChecker() {
    const modalHTML = `
        <div class="modal-overlay" id="locationModal">
            <div class="modal-content location-modal">
                <div class="modal-header">
                    <h3>Delivery Address Check</h3>
                    <button class="modal-close" onclick="closeLocationModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="location-info">
                        <p><strong>Service Area:</strong> We deliver within 15 miles of Greenwich, CT (06830)</p>
                        <ul>
                            <li>• 0-5 miles: Free delivery</li>
                            <li>• 5-10 miles: $5 premium fee</li>
                            <li>• 10-15 miles: $5 premium fee</li>
                            <li>• Beyond 15 miles: Not available</li>
                        </ul>
                    </div>
                    <form id="locationForm" class="location-form">
                        <div class="form-group">
                            <label for="checkAddress">Street Address</label>
                            <input type="text" id="checkAddress" name="address" placeholder="Enter your street address" required>
                        </div>
                        <div class="form-group">
                            <label for="checkZipCode">ZIP Code</label>
                            <input type="text" id="checkZipCode" name="zipCode" placeholder="Enter your ZIP code" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Check Availability</button>
                    </form>
                    <div id="locationResult" class="location-result" style="display: none;"></div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    addLocationStyles();
    
    setTimeout(() => {
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.classList.add('show');
            initializeLocationForm();
        }
    }, 10);
}

function initializeLocationForm() {
    const form = document.getElementById('locationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            checkLocation();
        });
    }
}

function checkLocation() {
    const address = document.getElementById('checkAddress').value;
    const zipCode = document.getElementById('checkZipCode').value;
    
    if (!address || !zipCode) {
        showNotification('Please enter both address and ZIP code.', 'error');
        return;
    }
    
    // Simulate distance calculation (in real implementation, use Google Maps API)
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
        showLocationResult(`You're in our extended delivery zone (${distance} miles). $5 premium delivery fee applies.`, 'success');
    }
    
    // Show proceed button after successful check
    setTimeout(() => {
        showProceedButton();
    }, 2000);
}

function calculateDistance(zipCode) {
    // Simulate distance calculation based on ZIP code
    // In real implementation, use Google Maps Distance Matrix API
    const zipNum = parseInt(zipCode);
    
    if (zipNum >= 6830 && zipNum <= 6840) return Math.random() * 5; // 0-5 miles
    if (zipNum >= 6841 && zipNum <= 6850) return 5 + Math.random() * 5; // 5-10 miles
    if (zipNum >= 6851 && zipNum <= 6860) return 10 + Math.random() * 5; // 10-15 miles
    
    return 20; // Beyond service area
}

function showLocationResult(message, type) {
    const resultDiv = document.getElementById('locationResult');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="result-message result-${type}">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <p>${message}</p>
            </div>
        `;
        resultDiv.style.display = 'block';
    }
}

function showProceedButton() {
    const resultDiv = document.getElementById('locationResult');
    if (resultDiv) {
        const proceedButton = document.createElement('button');
        proceedButton.className = 'btn btn-primary';
        proceedButton.textContent = 'Proceed to Order';
        proceedButton.onclick = () => {
            closeLocationModal();
            showDeliveryCalendar();
        };
        resultDiv.appendChild(proceedButton);
    }
}

function closeLocationModal() {
    const modal = document.getElementById('locationModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Product detail view
function viewProduct(productId) {
    const products = {
        'chicken-rice': {
            name: 'Chicken & Rice Blend',
            price: 18.00,
            description: 'Our most popular blend featuring lean chicken breast with brown rice and fresh vegetables. Perfect for active dogs who need sustained energy.',
            ingredients: ['Chicken breast', 'Brown rice', 'Carrots', 'Peas', 'Sweet potato', 'Chicken broth', 'Vitamins & minerals'],
            benefits: ['High protein content', 'Easy to digest', 'Rich in vitamins', 'Sustained energy', 'Supports muscle health'],
            image: 'fas fa-bone'
        },
        'salmon-sweet-potato': {
            name: 'Salmon & Sweet Potato',
            price: 22.00,
            description: 'Premium salmon with sweet potato and omega-rich ingredients. Excellent for skin and coat health.',
            ingredients: ['Salmon fillet', 'Sweet potato', 'Quinoa', 'Spinach', 'Flaxseed', 'Fish oil', 'Antioxidants'],
            benefits: ['Omega-3 fatty acids', 'Anti-inflammatory', 'Grain-free option', 'Skin & coat health', 'Joint support'],
            image: 'fas fa-fish'
        },
        'beef-vegetable': {
            name: 'Beef & Vegetable Mix',
            price: 20.00,
            description: 'Premium beef with fresh vegetables and essential minerals. Ideal for growing puppies and active dogs.',
            ingredients: ['Ground beef', 'Mixed vegetables', 'Brown rice', 'Beef broth', 'Eggs', 'Minerals', 'Probiotics'],
            benefits: ['High iron content', 'Essential minerals', 'Balanced nutrition', 'Muscle development', 'Energy support'],
            image: 'fas fa-carrot'
        },
        'turkey-quinoa': {
            name: 'Turkey & Quinoa Bowl',
            price: 19.00,
            description: 'Lean turkey with quinoa and green vegetables. Perfect for weight management and sensitive stomachs.',
            ingredients: ['Ground turkey', 'Quinoa', 'Broccoli', 'Zucchini', 'Turkey broth', 'Pumpkin', 'Digestive enzymes'],
            benefits: ['Low fat content', 'High fiber', 'Weight control', 'Easy digestion', 'Hypoallergenic'],
            image: 'fas fa-leaf'
        },
        'lamb-grains': {
            name: 'Lamb & Ancient Grains',
            price: 25.00,
            description: 'Premium lamb with ancient grains and herbs. Great for dogs with sensitive stomachs or allergies.',
            ingredients: ['Ground lamb', 'Ancient grains', 'Herbs', 'Lamb broth', 'Olive oil', 'Antioxidants', 'Prebiotics'],
            benefits: ['Gentle on digestion', 'Ancient grain blend', 'Hypoallergenic', 'Rich flavor', 'Nutrient dense'],
            image: 'fas fa-seedling'
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
                    <div class="product-detail">
                        <div class="product-detail-image">
                            <i class="${product.image}"></i>
                        </div>
                        <div class="product-detail-info">
                            <div class="product-detail-price">$${product.price.toFixed(2)}</div>
                            <p class="product-detail-description">${product.description}</p>
                            
                            <div class="product-detail-section">
                                <h4>Ingredients</h4>
                                <ul>
                                    ${product.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                                </ul>
                            </div>
                            
                            <div class="product-detail-section">
                                <h4>Benefits</h4>
                                <ul>
                                    ${product.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeProductModal()">Close</button>
                    <button class="btn btn-primary" onclick="addToCart('${product.name}', ${product.price}); closeProductModal();">Add to Cart</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    addProductDetailStyles();
    
    setTimeout(() => {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.add('show');
        }
    }, 10);
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Add cart styles
function addCartStyles() {
    if (!document.getElementById('cartStyles')) {
        const styles = `
            <style id="cartStyles">
                .cart-modal {
                    max-width: 700px !important;
                    max-height: 90vh !important;
                }
                
                .cart-items {
                    max-height: 60vh;
                    overflow-y: auto;
                }
                
                .cart-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border-bottom: 1px solid #e1e5e1;
                }
                
                .cart-item-info {
                    flex: 1;
                }
                
                .cart-item-quantity {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .cart-item-quantity button {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: #666;
                }
                
                .cart-item-total {
                    font-weight: 700;
                }
                
                .cart-summary {
                    background: #f8faf9;
                    padding: 1.5rem;
                    border-radius: 10px;
                    margin-top: 1rem;
                }
                
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                }
                
                .summary-total {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid #e1e5e1;
                    font-weight: 700;
                    color: #2c5530;
                    font-size: 1.1rem;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Add location styles
function addLocationStyles() {
    if (!document.getElementById('locationStyles')) {
        const styles = `
            <style id="locationStyles">
                .location-modal {
                    max-width: 500px !important;
                }
                
                .location-info {
                    background: #f8faf9;
                    padding: 1.5rem;
                    border-radius: 10px;
                    margin-bottom: 1.5rem;
                }
                
                .location-info ul {
                    margin: 0.5rem 0 0 0;
                    padding-left: 1rem;
                }
                
                .location-info li {
                    margin-bottom: 0.25rem;
                    color: #666;
                }
                
                .location-form {
                    margin-top: 1.5rem;
                }
                
                .form-group {
                    margin-bottom: 1rem;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                }
                
                .form-group input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #e1e5e1;
                    border-radius: 5px;
                }
                
                .btn-primary {
                    background: #4a7c59;
                    color: white;
                    border: none;
                    padding: 0.75rem 1rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1rem;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Add product detail styles
function addProductDetailStyles() {
    if (!document.getElementById('productDetailStyles')) {
        const styles = `
            <style id="productDetailStyles">
                .product-modal {
                    max-width: 700px !important;
                    max-height: 90vh !important;
                }
                
                .product-detail {
                    display: flex;
                    gap: 2rem;
                }
                
                .product-detail-image {
                    flex: 1;
                    text-align: center;
                }
                
                .product-detail-image i {
                    font-size: 4rem;
                    color: #4a7c59;
                }
                
                .product-detail-info {
                    flex: 2;
                }
                
                .product-detail-price {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }
                
                .product-detail-description {
                    color: #666;
                }
                
                .product-detail-section {
                    margin-bottom: 1.5rem;
                }
                
                .product-detail-section h4 {
                    color: #2c5530;
                    margin-bottom: 0.5rem;
                }
                
                .product-detail-section ul {
                    margin: 0;
                    padding-left: 1rem;
                }
                
                .product-detail-section li {
                    margin-bottom: 0.25rem;
                    color: #666;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
} 