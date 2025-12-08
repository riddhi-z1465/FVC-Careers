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
});
