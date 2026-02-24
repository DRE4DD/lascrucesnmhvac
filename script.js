// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el, index) => {
        el.classList.add('fade-in-scroll');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
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

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });
});

// Calculator Logic (for calculator.html page)
function calculateHVAC() {
    const squareFootage = parseInt(document.getElementById('squareFootage')?.value);
    const insulation = document.querySelector('input[name="insulation"]:checked')?.value;
    const climate = document.querySelector('input[name="climate"]:checked')?.value;
    const systemAge = document.querySelector('input[name="systemAge"]:checked')?.value;

    if (!squareFootage || !insulation || !climate || !systemAge) {
        alert('Please answer all questions');
        return;
    }

    // Calculate BTU requirements based on square footage and conditions
    let btuPerSqFt = 25; // Base BTU per square foot

    // Adjust for insulation
    if (insulation === 'poor') btuPerSqFt += 5;
    if (insulation === 'excellent') btuPerSqFt -= 3;

    // Adjust for climate (Las Cruces is very hot)
    if (climate === 'very-hot') btuPerSqFt += 8;
    if (climate === 'moderate') btuPerSqFt += 3;

    const totalBTU = squareFootage * btuPerSqFt;
    const tons = (totalBTU / 12000).toFixed(1);

    // Calculate estimated cost
    let baseCost = 4500;
    const tonMultiplier = parseFloat(tons);
    let estimatedCost = baseCost + (tonMultiplier * 800);

    // Adjust for system age (replacement vs new installation)
    if (systemAge === 'none' || systemAge === '15plus') {
        estimatedCost += 500; // Additional cost for full installation or old system removal
    }

    // Display results
    document.getElementById('btuResult').value = totalBTU.toLocaleString();
    document.getElementById('tonsResult').value = tons;
    document.getElementById('costResult').value = estimatedCost.toLocaleString();

    // Scroll to results
    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
}

// Form submission handler
function handleFormSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('customerName')?.value;
    const email = document.getElementById('customerEmail')?.value;
    const phone = document.getElementById('customerPhone')?.value;
    const address = document.getElementById('customerAddress')?.value;

    if (!name || !email || !phone || !address) {
        alert('Please fill in all contact information');
        return;
    }

    // Here you would typically send this to a backend or email service
    // For now, we'll just show a success message
    alert('Thank you! We will connect you with 2-3 licensed HVAC contractors within 24-48 hours.');
    
    // You can integrate with services like:
    // - Formspree
    // - EmailJS
    // - Your own backend API
}

// Export functions for use in HTML
if (typeof window !== 'undefined') {
    window.calculateHVAC = calculateHVAC;
    window.handleFormSubmit = handleFormSubmit;
}