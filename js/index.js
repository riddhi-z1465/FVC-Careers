// Homepage Job Card Navigation
document.addEventListener('DOMContentLoaded', function () {
    // Make job cards clickable and navigate to jobs page
    const jobCards = document.querySelectorAll('.job-card');

    jobCards.forEach(card => {
        card.style.cursor = 'pointer';

        card.addEventListener('click', function () {
            // Navigate to jobs page
            window.location.href = 'jobs.html';
        });
    });

    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-section');
    fadeElements.forEach(el => observer.observe(el));
});
