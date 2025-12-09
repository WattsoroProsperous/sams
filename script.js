// ============================================
// SAM's Abidjan - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLanguageToggle();
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initAnimations();
    initFormHandling();
    initCartDropdown();
    initGalleryLightbox();
    initMenuBooklet();
});

// ============================================
// Language Toggle (EN/FR)
// ============================================

let currentLang = 'fr';

function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');

    if (langToggle) {
        langToggle.addEventListener('click', function() {
            currentLang = currentLang === 'en' ? 'fr' : 'en';
            updateLanguage();
            updateLangToggleUI();
        });
    }

    // Check for saved language preference, default to French
    const savedLang = localStorage.getItem('sams-language');
    if (savedLang) {
        currentLang = savedLang;
    } else {
        currentLang = 'fr';
    }
    updateLanguage();
    updateLangToggleUI();
}

function updateLanguage() {
    // Update all elements with data-en and data-fr attributes
    const elements = document.querySelectorAll('[data-en][data-fr]');

    elements.forEach(element => {
        const text = element.getAttribute(`data-${currentLang}`);
        if (text) {
            element.textContent = text;
        }
    });

    // Update placeholders
    const inputs = document.querySelectorAll('[data-placeholder-en][data-placeholder-fr]');
    inputs.forEach(input => {
        const placeholder = input.getAttribute(`data-placeholder-${currentLang}`);
        if (placeholder) {
            input.placeholder = placeholder;
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;

    // Save preference
    localStorage.setItem('sams-language', currentLang);
}

function updateLangToggleUI() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const currentSpan = langToggle.querySelector('.lang-current');
        const otherSpan = langToggle.querySelector('.lang-other');

        currentSpan.textContent = currentLang.toUpperCase();
        otherSpan.textContent = currentLang === 'en' ? 'FR' : 'EN';
    }
}

// ============================================
// Mobile Menu
// ============================================

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// ============================================
// Header Scroll Effect
// ============================================

function initHeaderScroll() {
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// ============================================
// Smooth Scroll
// ============================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active nav link
                updateActiveNavLink(href);
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = document.querySelector('.header').offsetHeight;

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });

        if (currentSection) {
            updateActiveNavLink(currentSection);
        }
    });
}

function updateActiveNavLink(href) {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === href) {
            link.classList.add('active');
        }
    });
}

// ============================================
// Scroll Animations
// ============================================

function initAnimations() {
    const isMobile = window.innerWidth <= 768;

    // Food cards animation (special alternating on mobile)
    initFoodCardsAnimation(isMobile);

    // Other elements animation
    initGeneralAnimations();

    // Re-init on resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const newIsMobile = window.innerWidth <= 768;
            // Only re-init if mobile state changed
            if (newIsMobile !== isMobile) {
                location.reload(); // Simple reload to reset animations
            }
        }, 250);
    });
}

function initFoodCardsAnimation(isMobile) {
    const foodCards = document.querySelectorAll('.food-card');

    if (foodCards.length === 0) return;

    // Store initial transform for each card
    const cardInitialStates = [];

    foodCards.forEach((card, index) => {
        let initialTransform;

        if (isMobile) {
            // Alternating slide animation on mobile
            if (index % 2 === 0) {
                // Even index (0, 2, 4...) - slide from left
                card.classList.add('slide-from-left');
                initialTransform = 'translateX(-100px)';
            } else {
                // Odd index (1, 3, 5...) - slide from right
                card.classList.add('slide-from-right');
                initialTransform = 'translateX(100px)';
            }
        } else {
            // Desktop - standard fade up animation
            initialTransform = 'translateY(30px)';
        }

        cardInitialStates.push({
            card: card,
            initialTransform: initialTransform,
            index: index
        });

        // Set initial hidden state
        card.style.opacity = '0';
        card.style.transform = initialTransform;
        card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        card.style.transitionDelay = `${index * 0.15}s`;
    });

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -30px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const card = entry.target;
            const cardState = cardInitialStates.find(state => state.card === card);

            if (entry.isIntersecting) {
                // Card entering viewport - animate in
                card.style.transitionDelay = `${cardState.index * 0.15}s`;
                card.classList.add('card-animated');
            } else {
                // Card leaving viewport - reset to initial state
                card.classList.remove('card-animated');
                // Small delay before resetting transform to allow exit
                setTimeout(() => {
                    if (!card.classList.contains('card-animated')) {
                        card.style.opacity = '0';
                        card.style.transform = cardState.initialTransform;
                    }
                }, 100);
            }
        });
    }, observerOptions);

    // Observe all cards
    foodCards.forEach(card => {
        cardObserver.observe(card);
    });

    // Add animation styles
    const existingStyles = document.getElementById('food-card-animations');
    if (existingStyles) existingStyles.remove();

    const cardStyles = document.createElement('style');
    cardStyles.id = 'food-card-animations';
    cardStyles.textContent = `
        .food-card.card-animated {
            opacity: 1 !important;
            transform: translateX(0) translateY(0) !important;
        }

        @media (max-width: 768px) {
            .food-card.slide-from-left {
                transform: translateX(-100px);
            }
            .food-card.slide-from-right {
                transform: translateX(100px);
            }
            .food-card.slide-from-left.card-animated,
            .food-card.slide-from-right.card-animated {
                transform: translateX(0) !important;
            }
        }
    `;
    document.head.appendChild(cardStyles);
}

function initGeneralAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements to animate (excluding food-card as it has its own animation)
    const animateElements = document.querySelectorAll('.about-image-wrapper, .about-content, .feature');

    animateElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });

    // Add animation class styles
    const style = document.createElement('style');
    style.id = 'general-animations';
    style.textContent = `
        .animated {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// Form Handling
// ============================================

function initFormHandling() {
    const reservationForm = document.querySelector('.reservation-form');

    if (reservationForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
            dateInput.value = today;
        }

        // Form submission
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                guests: document.getElementById('guests').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                message: document.getElementById('message').value
            };

            // Validate form
            if (validateForm(formData)) {
                // Show success message
                showNotification(
                    currentLang === 'en'
                        ? 'Reservation submitted successfully! We will contact you soon.'
                        : 'Réservation soumise avec succès ! Nous vous contacterons bientôt.',
                    'success'
                );

                // Reset form
                reservationForm.reset();

                // Reset date to today
                if (dateInput) {
                    dateInput.value = new Date().toISOString().split('T')[0];
                }
            }
        });
    }
}

function validateForm(data) {
    // Simple validation
    if (!data.name || data.name.trim().length < 2) {
        showNotification(
            currentLang === 'en'
                ? 'Please enter a valid name.'
                : 'Veuillez entrer un nom valide.',
            'error'
        );
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        showNotification(
            currentLang === 'en'
                ? 'Please enter a valid email address.'
                : 'Veuillez entrer une adresse email valide.',
            'error'
        );
        return false;
    }

    if (!data.phone || data.phone.trim().length < 8) {
        showNotification(
            currentLang === 'en'
                ? 'Please enter a valid phone number.'
                : 'Veuillez entrer un numéro de téléphone valide.',
            'error'
        );
        return false;
    }

    if (!data.date) {
        showNotification(
            currentLang === 'en'
                ? 'Please select a date.'
                : 'Veuillez sélectionner une date.',
            'error'
        );
        return false;
    }

    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// Notification System
// ============================================

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    const styles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            background-color: #fff;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10000;
            animation: slideInNotification 0.3s ease;
            max-width: 400px;
        }

        .notification-success {
            border-left: 4px solid #4caf50;
        }

        .notification-error {
            border-left: 4px solid #f44336;
        }

        .notification-info {
            border-left: 4px solid #2196f3;
        }

        .notification-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #999;
            padding: 0;
            line-height: 1;
        }

        .notification-close:hover {
            color: #333;
        }

        @keyframes slideInNotification {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;

    // Add styles to head if not already present
    if (!document.getElementById('notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Add to page
    document.body.appendChild(notification);

    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInNotification 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ============================================
// Cart Functionality (Basic)
// ============================================

let cartCount = 4;

document.querySelectorAll('.control-btn.cart').forEach(btn => {
    btn.addEventListener('click', function() {
        cartCount++;
        updateCartCount();

        showNotification(
            currentLang === 'en'
                ? 'Item added to cart!'
                : 'Article ajouté au panier !',
            'success'
        );
    });
});

document.querySelectorAll('.control-btn.plus').forEach(btn => {
    btn.addEventListener('click', function() {
        // Visual feedback
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

document.querySelectorAll('.control-btn.minus').forEach(btn => {
    btn.addEventListener('click', function() {
        // Visual feedback
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;

        // Animation
        cartCountElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 200);
    }
}

// ============================================
// Cart Dropdown
// ============================================

function initCartDropdown() {
    const cartBtn = document.getElementById('cartBtn');
    const cartDropdown = document.getElementById('cartDropdown');

    if (!cartBtn || !cartDropdown) return;

    // Toggle cart dropdown
    cartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        cartDropdown.classList.toggle('active');

        // Close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
            cartDropdown.classList.remove('active');
        }
    });

    // Prevent dropdown from closing when clicking inside
    cartDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Initialize cart item controls
    initCartItemControls();
}

function initCartItemControls() {
    const cartDropdown = document.getElementById('cartDropdown');
    if (!cartDropdown) return;

    // Quantity buttons
    cartDropdown.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const qtyValue = this.parentElement.querySelector('.qty-value');
            let qty = parseInt(qtyValue.textContent);
            qty++;
            qtyValue.textContent = qty;
            updateCartTotal();

            // Visual feedback
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    cartDropdown.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const qtyValue = this.parentElement.querySelector('.qty-value');
            let qty = parseInt(qtyValue.textContent);
            if (qty > 1) {
                qty--;
                qtyValue.textContent = qty;
                updateCartTotal();
            }

            // Visual feedback
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Remove item buttons
    cartDropdown.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');

            // Animate removal
            cartItem.style.animation = 'cartItemSlideOut 0.3s ease forwards';

            setTimeout(() => {
                cartItem.remove();
                updateCartTotal();
                updateCartItemsCount();

                // Check if cart is empty
                const remainingItems = cartDropdown.querySelectorAll('.cart-item');
                if (remainingItems.length === 0) {
                    showEmptyCartState();
                }
            }, 300);
        });
    });

    // Add slide out animation
    if (!document.getElementById('cart-item-slideout')) {
        const style = document.createElement('style');
        style.id = 'cart-item-slideout';
        style.textContent = `
            @keyframes cartItemSlideOut {
                to {
                    opacity: 0;
                    transform: translateX(20px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function updateCartTotal() {
    const cartItems = document.querySelectorAll('#cartDropdown .cart-item');
    let total = 0;
    let totalItems = 0;

    cartItems.forEach(item => {
        const price = parseInt(item.dataset.price);
        const qty = parseInt(item.querySelector('.qty-value').textContent);
        total += price * qty;
        totalItems += qty;
    });

    // Update subtotal display
    const subtotalValue = document.querySelector('.subtotal-value');
    if (subtotalValue) {
        subtotalValue.textContent = formatPrice(total) + ' FCFA';
    }

    // Update cart count in header
    cartCount = totalItems;
    updateCartCount();
}

function updateCartItemsCount() {
    const cartItems = document.querySelectorAll('#cartDropdown .cart-item');
    const countElement = document.querySelector('.cart-items-count');

    if (countElement) {
        const count = cartItems.length;
        const itemText = currentLang === 'en'
            ? (count === 1 ? 'item' : 'items')
            : (count === 1 ? 'article' : 'articles');
        countElement.textContent = `${count} ${itemText}`;
    }
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function showEmptyCartState() {
    const cartItemsContainer = document.querySelector('.cart-dropdown-items');
    const cartFooter = document.querySelector('.cart-dropdown-footer');

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                </div>
                <h4 data-en="Your cart is empty" data-fr="Votre panier est vide">${currentLang === 'en' ? 'Your cart is empty' : 'Votre panier est vide'}</h4>
                <p data-en="Add some delicious items to your cart!" data-fr="Ajoutez de délicieux articles à votre panier !">${currentLang === 'en' ? 'Add some delicious items to your cart!' : 'Ajoutez de délicieux articles à votre panier !'}</p>
                <a href="#menu" class="btn btn-primary btn-sm" onclick="document.getElementById('cartDropdown').classList.remove('active')" data-en="Browse Menu" data-fr="Voir le Menu">${currentLang === 'en' ? 'Browse Menu' : 'Voir le Menu'}</a>
            </div>
        `;
    }

    if (cartFooter) {
        cartFooter.style.display = 'none';
    }

    // Update header count
    const countElement = document.querySelector('.cart-items-count');
    if (countElement) {
        countElement.textContent = currentLang === 'en' ? '0 items' : '0 articles';
    }

    cartCount = 0;
    updateCartCount();
}

// ============================================
// Cart Page
// ============================================

// Cart data store
let cartItems = [
    { id: 1, name: { en: 'Grilled Steak & Shrimp', fr: 'Steak Grillé & Crevettes' }, price: 9500, qty: 2, image: 'assets/1.png' },
    { id: 2, name: { en: 'Belgian Waffles', fr: 'Gaufres Belges' }, price: 5500, qty: 1, image: 'assets/3.png' },
    { id: 3, name: { en: 'Breakfast Sandwich', fr: 'Sandwich Petit-Déjeuner' }, price: 4500, qty: 1, image: 'assets/4.png' }
];

const deliveryFee = 1500;
let discount = 0;

function initCartPage() {
    const cartPageOverlay = document.getElementById('cartPageOverlay');
    const cartPageClose = document.getElementById('cartPageClose');
    const viewCartBtn = document.querySelector('.cart-dropdown .btn-outline');
    const continueShopping = document.getElementById('continueShopping');
    const browseMenuBtn = document.getElementById('browseMenuBtn');

    if (!cartPageOverlay) return;

    // Open cart page from dropdown "View Cart" button
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCartPage();
        });
    }

    // Close cart page
    if (cartPageClose) {
        cartPageClose.addEventListener('click', closeCartPage);
    }

    // Close when clicking overlay
    cartPageOverlay.addEventListener('click', function(e) {
        if (e.target === cartPageOverlay) {
            closeCartPage();
        }
    });

    // Continue shopping
    if (continueShopping) {
        continueShopping.addEventListener('click', function(e) {
            e.preventDefault();
            closeCartPage();
            // Smooth scroll to menu
            setTimeout(() => {
                document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' });
            }, 400);
        });
    }

    // Browse menu from empty cart
    if (browseMenuBtn) {
        browseMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeCartPage();
            setTimeout(() => {
                document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' });
            }, 400);
        });
    }

    // Promo code
    const applyPromoBtn = document.getElementById('applyPromo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }

    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartPageOverlay.classList.contains('active')) {
            closeCartPage();
        }
    });
}

function openCartPage() {
    const cartPageOverlay = document.getElementById('cartPageOverlay');
    const cartDropdown = document.getElementById('cartDropdown');

    // Close dropdown first
    if (cartDropdown) {
        cartDropdown.classList.remove('active');
    }

    // Render cart items
    renderCartPageItems();

    // Open cart page
    if (cartPageOverlay) {
        cartPageOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCartPage() {
    const cartPageOverlay = document.getElementById('cartPageOverlay');
    if (cartPageOverlay) {
        cartPageOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function renderCartPageItems() {
    const cartPageItems = document.getElementById('cartPageItems');
    const cartPageContent = document.querySelector('.cart-page-content');
    const cartPageEmpty = document.getElementById('cartPageEmpty');
    const cartPageCount = document.querySelector('.cart-page-count');

    if (!cartPageItems) return;

    // Check if cart is empty
    if (cartItems.length === 0) {
        if (cartPageContent) cartPageContent.style.display = 'none';
        if (cartPageEmpty) cartPageEmpty.style.display = 'flex';
        if (cartPageCount) {
            cartPageCount.textContent = currentLang === 'en' ? '0 items' : '0 articles';
        }
        return;
    }

    // Show content, hide empty state
    if (cartPageContent) cartPageContent.style.display = 'grid';
    if (cartPageEmpty) cartPageEmpty.style.display = 'none';

    // Update count
    const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
    if (cartPageCount) {
        const itemText = currentLang === 'en'
            ? (totalQty === 1 ? 'item' : 'items')
            : (totalQty === 1 ? 'article' : 'articles');
        cartPageCount.textContent = `${totalQty} ${itemText}`;
    }

    // Render items
    cartPageItems.innerHTML = cartItems.map((item, index) => `
        <div class="cart-page-item" data-id="${item.id}" style="animation-delay: ${index * 0.1}s">
            <div class="cart-page-item-image">
                <img src="${item.image}" alt="${item.name[currentLang]}">
            </div>
            <div class="cart-page-item-details">
                <h4 class="cart-page-item-name">${item.name[currentLang]}</h4>
                <span class="cart-page-item-price">${formatPrice(item.price)} FCFA</span>
                <span class="cart-page-item-unit" data-en="per unit" data-fr="par unité">${currentLang === 'en' ? 'per unit' : 'par unité'}</span>
            </div>
            <div class="cart-page-item-quantity">
                <button class="cart-page-qty-btn cart-page-qty-minus" data-id="${item.id}">−</button>
                <span class="cart-page-qty-value">${item.qty}</span>
                <button class="cart-page-qty-btn cart-page-qty-plus" data-id="${item.id}">+</button>
            </div>
            <div class="cart-page-item-total">
                <span class="cart-page-item-total-label" data-en="Total" data-fr="Total">${currentLang === 'en' ? 'Total' : 'Total'}</span>
                <span class="cart-page-item-total-value">${formatPrice(item.price * item.qty)} FCFA</span>
            </div>
            <button class="cart-page-item-remove" data-id="${item.id}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        </div>
    `).join('');

    // Add event listeners
    initCartPageItemControls();

    // Update summary
    updateCartPageSummary();
}

function initCartPageItemControls() {
    // Plus buttons
    document.querySelectorAll('.cart-page-qty-plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const item = cartItems.find(i => i.id === id);
            if (item) {
                item.qty++;
                updateCartPageItem(id);
                syncCartDropdown();
            }
        });
    });

    // Minus buttons
    document.querySelectorAll('.cart-page-qty-minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const item = cartItems.find(i => i.id === id);
            if (item && item.qty > 1) {
                item.qty--;
                updateCartPageItem(id);
                syncCartDropdown();
            }
        });
    });

    // Remove buttons
    document.querySelectorAll('.cart-page-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            removeCartPageItem(id);
        });
    });
}

function updateCartPageItem(id) {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    const itemElement = document.querySelector(`.cart-page-item[data-id="${id}"]`);
    if (itemElement) {
        itemElement.querySelector('.cart-page-qty-value').textContent = item.qty;
        itemElement.querySelector('.cart-page-item-total-value').textContent = formatPrice(item.price * item.qty) + ' FCFA';
    }

    updateCartPageSummary();
    updateCartPageCount();
}

function removeCartPageItem(id) {
    const itemElement = document.querySelector(`.cart-page-item[data-id="${id}"]`);

    if (itemElement) {
        itemElement.style.animation = 'cartPageItemOut 0.3s ease forwards';

        // Add the animation keyframes if not present
        if (!document.getElementById('cart-page-item-out')) {
            const style = document.createElement('style');
            style.id = 'cart-page-item-out';
            style.textContent = `
                @keyframes cartPageItemOut {
                    to {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            // Remove from array
            cartItems = cartItems.filter(i => i.id !== id);

            // Re-render
            renderCartPageItems();
            syncCartDropdown();

            // Show notification
            showNotification(
                currentLang === 'en'
                    ? 'Item removed from cart'
                    : 'Article retiré du panier',
                'info'
            );
        }, 300);
    }
}

function updateCartPageCount() {
    const cartPageCount = document.querySelector('.cart-page-count');
    const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

    if (cartPageCount) {
        const itemText = currentLang === 'en'
            ? (totalQty === 1 ? 'item' : 'items')
            : (totalQty === 1 ? 'article' : 'articles');
        cartPageCount.textContent = `${totalQty} ${itemText}`;
    }
}

function updateCartPageSummary() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const total = subtotal + deliveryFee - discount;

    const subtotalEl = document.querySelector('.summary-subtotal');
    const deliveryEl = document.querySelector('.summary-delivery');
    const discountEl = document.querySelector('.summary-discount');
    const totalEl = document.querySelector('.summary-total');

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal) + ' FCFA';
    if (deliveryEl) deliveryEl.textContent = formatPrice(deliveryFee) + ' FCFA';
    if (discountEl) discountEl.textContent = '-' + formatPrice(discount) + ' FCFA';
    if (totalEl) totalEl.textContent = formatPrice(total) + ' FCFA';

    // Also update dropdown
    const dropdownSubtotal = document.querySelector('.subtotal-value');
    if (dropdownSubtotal) {
        dropdownSubtotal.textContent = formatPrice(subtotal) + ' FCFA';
    }
}

function syncCartDropdown() {
    // Update header cart count
    cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
    updateCartCount();

    // Update dropdown items count
    const dropdownCount = document.querySelector('.cart-items-count');
    if (dropdownCount) {
        const itemText = currentLang === 'en'
            ? (cartItems.length === 1 ? 'item' : 'items')
            : (cartItems.length === 1 ? 'article' : 'articles');
        dropdownCount.textContent = `${cartItems.length} ${itemText}`;
    }

    // Update subtotal
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const dropdownSubtotal = document.querySelector('.subtotal-value');
    if (dropdownSubtotal) {
        dropdownSubtotal.textContent = formatPrice(subtotal) + ' FCFA';
    }

    // Re-render dropdown items
    renderDropdownItems();
}

function renderDropdownItems() {
    const dropdownItems = document.querySelector('.cart-dropdown-items');
    if (!dropdownItems) return;

    if (cartItems.length === 0) {
        showEmptyCartState();
        return;
    }

    dropdownItems.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-id="${item.id}" data-price="${item.price}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name[currentLang]}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name[currentLang]}</h4>
                <span class="cart-item-price">${formatPrice(item.price)} FCFA</span>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn qty-minus">−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn qty-plus">+</button>
            </div>
            <button class="cart-item-remove">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');

    // Re-init dropdown controls
    initCartItemControls();
}

function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const code = promoInput?.value.trim().toUpperCase();

    if (!code) {
        showNotification(
            currentLang === 'en'
                ? 'Please enter a promo code'
                : 'Veuillez entrer un code promo',
            'error'
        );
        return;
    }

    // Sample promo codes
    const promoCodes = {
        'SAMS10': 0.10,
        'BIENVENUE': 0.15,
        'WELCOME': 0.15
    };

    if (promoCodes[code]) {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
        discount = Math.round(subtotal * promoCodes[code]);
        updateCartPageSummary();

        showNotification(
            currentLang === 'en'
                ? `Promo code applied! You save ${formatPrice(discount)} FCFA`
                : `Code promo appliqué ! Vous économisez ${formatPrice(discount)} FCFA`,
            'success'
        );

        promoInput.value = '';
        promoInput.disabled = true;
        document.getElementById('applyPromo').disabled = true;
    } else {
        showNotification(
            currentLang === 'en'
                ? 'Invalid promo code'
                : 'Code promo invalide',
            'error'
        );
    }
}

// Initialize cart page when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initCartPage();
});

// ============================================
// Gallery Carousel & Lightbox
// ============================================

const galleryImages = [
    'assets/galery 1.png',
    'assets/galery 2.png',
    'assets/galery 3.png',
    'assets/galery 4.png',
    'assets/galery 5.png',
    'assets/galery 6.png'
];

let currentImageIndex = 0;
let currentSlide = 0;
let slidesPerView = 3;
let autoPlayInterval = null;
let isCarouselPaused = false;

function initGalleryLightbox() {
    initGalleryCarousel();
    initLightbox();
}

function initGalleryCarousel() {
    const carousel = document.getElementById('galleryCarousel');
    const track = carousel?.querySelector('.gallery-track');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const dotsContainer = document.getElementById('galleryDots');
    const items = document.querySelectorAll('.gallery-item');
    const wrapper = document.querySelector('.gallery-carousel-wrapper');

    if (!carousel || !track || items.length === 0) return;

    const autoPlayDelay = 3000; // 3 seconds

    // Calculate slides per view based on screen size
    function updateSlidesPerView() {
        if (window.innerWidth <= 768) {
            slidesPerView = 1;
        } else if (window.innerWidth <= 1024) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
    }

    updateSlidesPerView();

    // Calculate total pages
    function getTotalPages() {
        return Math.ceil(items.length / slidesPerView);
    }

    // Create dots
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const totalPages = getTotalPages();

        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        }
    }

    createDots();

    // Update dots
    function updateDots() {
        const dots = dotsContainer?.querySelectorAll('.gallery-dot');
        dots?.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Update navigation buttons (no longer disabled for infinite loop)
    function updateNavButtons() {
        if (prevBtn) prevBtn.disabled = false;
        if (nextBtn) nextBtn.disabled = false;
    }

    // Go to specific slide with infinite loop
    function goToSlide(index) {
        const totalPages = getTotalPages();

        // Infinite loop logic
        if (index >= totalPages) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalPages - 1;
        } else {
            currentSlide = index;
        }

        const itemWidth = items[0].offsetWidth;
        const gap = 20; // Gap between items
        const offset = currentSlide * slidesPerView * (itemWidth + gap);

        track.style.transform = `translateX(-${offset}px)`;
        updateDots();
        updateNavButtons();
    }

    // Next slide for auto-play
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Start auto-play
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (!isCarouselPaused) {
                nextSlide();
            }
        }, autoPlayDelay);
    }

    // Stop auto-play
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    // Reset auto-play (restart timer)
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Pause on hover
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => {
            isCarouselPaused = true;
        });

        wrapper.addEventListener('mouseleave', () => {
            isCarouselPaused = false;
        });
    }

    // Also pause on dots hover
    if (dotsContainer) {
        dotsContainer.addEventListener('mouseenter', () => {
            isCarouselPaused = true;
        });

        dotsContainer.addEventListener('mouseleave', () => {
            isCarouselPaused = false;
        });
    }

    // Navigation with infinite loop
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            resetAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            resetAutoPlay();
        });
    }

    // Touch/swipe support for carousel
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        isCarouselPaused = true;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                goToSlide(currentSlide + 1);
            } else {
                goToSlide(currentSlide - 1);
            }
            resetAutoPlay();
        }

        // Resume after touch
        setTimeout(() => {
            isCarouselPaused = false;
        }, 100);
    }, { passive: true });

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const oldSlidesPerView = slidesPerView;
            updateSlidesPerView();
            if (oldSlidesPerView !== slidesPerView) {
                currentSlide = 0;
                createDots();
                goToSlide(0);
            }
        }, 200);
    });

    // Initial state
    updateNavButtons();

    // Start auto-play
    startAutoPlay();
}

function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCurrent = document.getElementById('lightboxCurrent');
    const lightboxTotal = document.getElementById('lightboxTotal');

    if (!lightbox || galleryItems.length === 0) return;

    // Set total images count
    if (lightboxTotal) {
        lightboxTotal.textContent = galleryImages.length;
    }

    // Open lightbox on image click
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentImageIndex = index;
            openLightbox();
        });
    });

    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function(e) {
            e.stopPropagation();
            navigateLightbox(-1);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', function(e) {
            e.stopPropagation();
            navigateLightbox(1);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    });

    // Touch swipe support for lightbox
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleLightboxSwipe();
    }, { passive: true });

    function handleLightboxSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                navigateLightbox(1);
            } else {
                navigateLightbox(-1);
            }
        }
    }

    function openLightbox() {
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentImageIndex += direction;

        // Loop around
        if (currentImageIndex < 0) {
            currentImageIndex = galleryImages.length - 1;
        } else if (currentImageIndex >= galleryImages.length) {
            currentImageIndex = 0;
        }

        // Animate transition
        lightboxImage.style.opacity = '0';
        lightboxImage.style.transform = 'scale(0.9)';

        setTimeout(() => {
            updateLightboxImage();
            lightboxImage.style.opacity = '1';
            lightboxImage.style.transform = 'scale(1)';
        }, 200);
    }

    function updateLightboxImage() {
        if (lightboxImage) {
            lightboxImage.src = galleryImages[currentImageIndex];
        }
        if (lightboxCurrent) {
            lightboxCurrent.textContent = currentImageIndex + 1;
        }
    }
}

// ============================================
// Menu PDF Viewer
// ============================================

// Menu configuration
const menuConfig = {
    main: {
        pdfUrl: "assets/SAM'S carte.pdf",
        title: { en: 'Main Menu', fr: 'La Carte' }
    },
    desserts: {
        pdfUrl: "assets/SAM'S desserts.pdf",
        title: { en: 'Desserts', fr: 'Desserts' }
    }
};

let currentMenu = 'main';
let isFullscreen = false;

function initMenuBooklet() {
    setupMenuTabsListeners();
    setupPdfViewerListeners();
    checkPdfSupport();
}

function setupMenuTabsListeners() {
    const tabs = document.querySelectorAll('.menu-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const menuType = this.getAttribute('data-menu');
            switchMenu(menuType);

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function setupPdfViewerListeners() {
    const fullscreenBtn = document.getElementById('pdfFullscreenBtn');
    const viewerFrame = document.querySelector('.pdf-viewer-frame');

    if (fullscreenBtn && viewerFrame) {
        fullscreenBtn.addEventListener('click', function() {
            toggleFullscreen(viewerFrame);
        });
    }

    // ESC to exit fullscreen
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isFullscreen) {
            exitFullscreen();
        }
    });
}

function switchMenu(menuType) {
    const config = menuConfig[menuType];
    if (!config) return;

    currentMenu = menuType;

    // Update PDF iframe
    const pdfFrame = document.getElementById('pdfFrame');
    if (pdfFrame) {
        pdfFrame.src = config.pdfUrl;
    }

    // Update title
    const titleEl = document.getElementById('pdfViewerTitle');
    if (titleEl) {
        titleEl.textContent = config.title[currentLang] || config.title.fr;
    }

    // Update download link
    const downloadBtn = document.getElementById('pdfDownloadBtn');
    if (downloadBtn) {
        downloadBtn.href = config.pdfUrl;
    }

    // Update fallback link
    const openBtn = document.getElementById('pdfOpenBtn');
    if (openBtn) {
        openBtn.href = config.pdfUrl;
    }
}

function toggleFullscreen(element) {
    if (!isFullscreen) {
        element.classList.add('fullscreen');
        isFullscreen = true;
        document.body.style.overflow = 'hidden';
    } else {
        exitFullscreen();
    }
}

function exitFullscreen() {
    const viewerFrame = document.querySelector('.pdf-viewer-frame');
    if (viewerFrame) {
        viewerFrame.classList.remove('fullscreen');
    }
    isFullscreen = false;
    document.body.style.overflow = '';
}

function checkPdfSupport() {
    const pdfFrame = document.getElementById('pdfFrame');
    const fallback = document.getElementById('pdfFallback');

    if (!pdfFrame || !fallback) return;

    // Check if PDF can be displayed in iframe
    // Most modern browsers support this, but we add fallback for mobile browsers
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        // On mobile, show fallback with button to open PDF
        pdfFrame.style.display = 'none';
        fallback.classList.add('active');
    }

    // Also handle iframe load error
    pdfFrame.addEventListener('error', function() {
        pdfFrame.style.display = 'none';
        fallback.classList.add('active');
    });
}
