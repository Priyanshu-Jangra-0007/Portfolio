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

// Project popup functionality
const projectData = {
    monastery: {
        title: 'Monastery360',
        description: 'A responsive React-based web application for immersive virtual exploration with Firebase authentication and real-time database integration. Journey through centuries of Buddhist heritage with interactive 360° views.',
        image: 'images/monestry.png',
        github: 'https://github.com/Priyanshu-Jangra-0007/Monastery360',
        demo: 'https://monastery360.example.com'
    },
    powerzone: {
        title: 'PowerZone',
        description: 'Modern fitness web app with AI-powered workout coaching, meal tracking, and Supabase authentication. Features personalized training programs and progress analytics tailored to your goals.',
        image: 'images/powerzone.png',
        github: 'https://github.com/Priyanshu-Jangra-0007/PowerZone',
        demo: 'https://power-zone.vercel.app/'
    },
    pastelab: {
        title: 'PasteLab',
        description: 'Modern text and code sharing platform built with React, TypeScript, Supabase, and Tailwind CSS. Features syntax highlighting for 20+ languages, markdown support, QR code generation, and auto-expiration.',
        image: 'images/pastelab.png',
        github: 'https://github.com/Priyanshu-Jangra-0007/Pastelab',
        demo: 'https://pastelab.netlify.app/'
    },
    onetimetalk: {
        title: 'OneTimeTalk',
        description: 'A real-time chat application where users can create temporary chat rooms with unique codes. Rooms support 2+ users and automatically expire when everyone leaves. Built with Supabase Realtime for instant messaging.',
        image: 'images/onetimetalk.png',
        github: 'https://github.com/Priyanshu-Jangra-0007/onetimetalk',
        demo: 'https://onetimetalk.vercel.app'
    }
};

const popup = document.getElementById('projectPopup');
const popupClose = document.querySelector('.popup-close');
const readMoreBtns = document.querySelectorAll('.read-more-btn');

readMoreBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        const project = btn.getAttribute('data-project');
        const data = projectData[project];
        
        // Update popup content
        document.getElementById('popupImage').src = data.image;
        document.getElementById('popupImage').alt = data.title;
        document.getElementById('popupTitle').textContent = data.title;
        document.getElementById('popupDescription').textContent = data.description;
        document.getElementById('popupGithub').href = data.github;
        document.getElementById('popupDemo').href = data.demo;
        
        // Show popup
        popup.classList.add('show');
    });
});

// Close popup when clicking close button
popupClose.addEventListener('click', () => {
    popup.classList.remove('show');
});

// Close popup when clicking outside
popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.classList.remove('show');
    }
});

// Close popup when mouse leaves the popup area
popup.addEventListener('mouseleave', () => {
    popup.classList.remove('show');
});

// Keep popup open when hovering over it
popup.addEventListener('mouseenter', () => {
    popup.classList.add('show');
});

// Close popup with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('show')) {
        popup.classList.remove('show');
    }
});
