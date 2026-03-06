// Tab functionality for About page
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Smooth scroll for navigation links
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

// Scroll-triggered project animations
const projectSlides = document.querySelectorAll('.project-slide');

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

projectSlides.forEach(slide => {
    projectObserver.observe(slide);
});

// Hide scroll indicator when scrolling
const scrollIndicator = document.querySelector('.scroll-indicator');
let scrollTimeout;

window.addEventListener('scroll', () => {
    if (scrollIndicator) {
        scrollIndicator.style.opacity = '0';
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.scrollY < 200) {
                scrollIndicator.style.opacity = '1';
            }
        }, 1000);
    }
});


// Contact Form Submission to Firebase Realtime Database
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    console.log('Contact form found');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted');
        
        // Check if Firebase is initialized
        if (typeof firebase === 'undefined') {
            console.error('Firebase is not loaded');
            showMessage('Firebase is not loaded. Please refresh the page.', 'error');
            return;
        }
        
        if (typeof database === 'undefined') {
            console.error('Database is not initialized');
            showMessage('Database connection failed. Please refresh the page.', 'error');
            return;
        }
        
        // Get form values
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const message = document.getElementById('userMessage').value.trim();
        
        console.log('Form data:', { name, email, message });
        
        // Validate form
        if (!name || !email || !message) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Disable submit button
        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            console.log('Attempting to save to Firebase...');
            
            // Create a new contact entry with unique ID
            const contactRef = database.ref('contacts').push();
            
            // Save data to Firebase Realtime Database
            await contactRef.set({
                name: name,
                email: email,
                message: message,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                status: 'new',
                id: contactRef.key
            });
            
            console.log('Data saved successfully!');
            
            // Success message
            showMessage('Thank you! Your message has been sent successfully.', 'success');
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            console.error('Error details:', error.message);
            showMessage('Oops! Something went wrong. Please try again. Error: ' + error.message, 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    });
} else {
    console.error('Contact form not found');
}

// Show message function
function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}
