# FVC Careers Page

A modern, premium careers/jobs page for FVC (Future Vision Company) built with HTML, CSS, and JavaScript.

## Features

### Design
- **Premium Aesthetics**: Modern gradient colors, smooth animations, and glassmorphism effects
- **Responsive Layout**: Fully responsive design that works on desktop, tablet, and mobile
- **Smooth Animations**: Fade-in effects, hover animations, and parallax scrolling
- **Modern Typography**: Uses Inter font family for clean, professional look

### Sections
1. **Navigation Bar**: Fixed header with smooth scroll navigation
2. **Hero Section**: Eye-catching headline with "Build The Future With Us" message
3. **Job Search Form**: Interactive search form for role and location
4. **Frequently Searched Job Roles**: Carousel of job categories with cards
5. **Locations**: Display of office locations with interactive tags
6. **Find Your Team**: Team spotlight section with UX team example
7. **Life at FVC**: Photo gallery showcasing company culture
8. **Footer**: Comprehensive footer with social links and site navigation

### Interactive Features
- Smooth scrolling navigation
- Navbar scroll effects
- Job cards carousel with prev/next buttons
- Form validation and submission handling
- Favorite button toggle
- Location tag selection
- Parallax hero image effect
- Button ripple effects
- Intersection observer animations
- Gallery lightbox (ready for implementation)

## File Structure

```
FVC/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with design system
├── script.js           # Interactive JavaScript features
├── hero-image.jpg      # Hero section image
├── job-notes.jpg       # Job seeker card image
├── ux-expert.jpg       # UX Expert card image
├── product-manager.jpg # Product Manager card image
├── office-location.jpg # Office location image
├── team-meeting.jpg    # Team section image
├── life-1.jpg          # Gallery image 1
├── life-2.jpg          # Gallery image 2
├── life-3.jpg          # Gallery image 3
├── life-4.jpg          # Gallery image 4
├── life-5.jpg          # Gallery image 5
└── life-6.jpg          # Gallery image 6
```

## Design System

### Colors
- **Primary**: #FF6B6B (Coral Red)
- **Secondary**: #4ECDC4 (Turquoise)
- **Accent**: #FFE66D (Yellow)
- **Dark Background**: #1A1A2E
- **Light Background**: #F8F9FA
- **Text Dark**: #2D3436
- **Text Light**: #636E72

### Gradients
- **Primary Gradient**: Linear gradient from #FF6B6B to #FF8E53
- **Secondary Gradient**: Linear gradient from #667EEA to #764BA2

### Typography
- **Font Family**: Inter (Google Fonts)
- **Sizes**: Responsive scale from 0.75rem to 4rem
- **Weights**: 300, 400, 500, 600, 700, 800

### Spacing
- Uses consistent spacing scale (0.5rem to 6rem)
- Grid-based layouts with CSS Grid
- Responsive gaps and padding

### Shadows
- 4 levels of elevation (sm, md, lg, xl)
- Consistent shadow system for depth

### Border Radius
- 4 sizes (sm: 8px, md: 12px, lg: 16px, xl: 24px)
- Rounded corners throughout for modern feel

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- Intersection Observer API for animations
- ES6+ JavaScript features

## Usage

Simply open `index.html` in a web browser to view the page. No build process or dependencies required.

For local development:
1. Open the folder in your code editor
2. Use a local server (e.g., Live Server extension in VS Code)
3. Make changes to HTML, CSS, or JS files
4. Refresh browser to see updates

## Customization

### Changing Colors
Edit the CSS custom properties in `styles.css`:
```css
:root {
    --primary-color: #FF6B6B;
    --secondary-color: #4ECDC4;
    /* ... other colors */
}
```

### Adding New Job Cards
Add new card HTML in the `.job-cards` div in `index.html`:
```html
<div class="job-card">
    <div class="job-card-image">
        <img src="your-image.jpg" alt="Job Title">
    </div>
    <h3 class="job-card-title">Your Job Title</h3>
    <p class="job-card-desc">Description here</p>
    <a href="#" class="job-card-link">Explore →</a>
</div>
```

### Updating Locations
Modify the location tags in the locations section:
```html
<span class="location-tag">Your City</span>
```

## Performance
- Optimized images (JPEG format)
- Minimal JavaScript
- CSS animations using GPU acceleration
- Lazy loading ready for implementation

## SEO
- Semantic HTML5 structure
- Proper heading hierarchy
- Meta descriptions and title tags
- Alt text for all images
- Unique IDs for interactive elements

## Future Enhancements
- [ ] Add actual job listings integration
- [ ] Implement backend for form submission
- [ ] Add lightbox modal for gallery
- [ ] Integrate with ATS (Applicant Tracking System)
- [ ] Add job filters and search functionality
- [ ] Implement user authentication
- [ ] Add application form
- [ ] Mobile menu for navigation

## Credits
Created with modern web development best practices, focusing on user experience and visual excellence.

---

**Note**: Replace placeholder images with actual company photos for production use.
