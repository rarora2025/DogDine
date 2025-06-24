# DogDine - Fresh Human-Grade Dog Food Delivery

A modern, responsive website for DogDine, a small business that delivers freshly made, human-grade dog food personalized for pets and pre-portioned for optimal health. The service operates in Greenwich with weekly deliveries.

## 🚀 Features

### Design & User Experience
- **Modern, Professional Design**: Clean, green-themed design that reflects the natural, healthy nature of the product
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Subtle animations and transitions for enhanced user experience
- **Accessible Navigation**: Fixed navigation bar with smooth scrolling to sections

### Key Sections
1. **Hero Section**: Compelling headline and call-to-action buttons
2. **About Section**: Four key features highlighting the business benefits
3. **Products Section**: Three different meal options with detailed descriptions
4. **Pricing Section**: Three weekly meal plans with clear pricing and features
5. **Contact Section**: Contact form and business information
6. **Footer**: Links and company information

### Interactive Features
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Plan Selection**: Interactive pricing cards with modal confirmation
- **Contact Form**: Form validation and submission handling
- **Smooth Scrolling**: Navigation links smoothly scroll to sections
- **Notifications**: Success/error messages for user feedback

## 📁 File Structure

```
DogDine/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── CS.png             # Logo file (not used on website)
└── README.md          # This file
```

## 🛠️ Setup Instructions

### Option 1: Open Directly in Browser
1. Simply double-click on `index.html` to open the website in your default browser
2. The website will work immediately with all features

### Option 2: Local Server (Recommended)
For the best experience, especially for testing forms and interactions:

1. **Using Python** (if installed):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

2. **Using Node.js** (if installed):
   ```bash
   npx serve .
   ```

3. **Using PHP** (if installed):
   ```bash
   php -S localhost:8000
   ```

Then open `http://localhost:8000` in your browser.

## 🎨 Customization

### Colors
The website uses a green color scheme that can be easily modified in `styles.css`:
- Primary Green: `#4a7c59`
- Dark Green: `#2c5530`
- Light Green: `#e8f5e8`

### Content
- **Business Information**: Update contact details, phone numbers, and email addresses
- **Pricing**: Modify the weekly meal plan prices and features
- **Products**: Add or change the meal options and descriptions
- **Service Area**: Update the delivery area information

### Logo Integration
To use your CS.png logo:
1. Replace the text "DogDine" in the navigation with an image
2. Update the hero section to include your logo
3. Consider adding it to the footer as well

## 📱 Responsive Design

The website is fully responsive and includes:
- **Desktop**: Full layout with side-by-side sections
- **Tablet**: Adjusted grid layouts and spacing
- **Mobile**: Single-column layout with mobile navigation

## 🔧 Technical Features

### CSS Features
- CSS Grid and Flexbox for layouts
- CSS Custom Properties for easy theming
- Smooth transitions and hover effects
- Mobile-first responsive design

### JavaScript Features
- Intersection Observer for scroll animations
- Form validation and handling
- Modal system for plan selection
- Notification system for user feedback
- Mobile navigation toggle

### Performance
- Optimized images and icons
- Minimal external dependencies
- Fast loading times
- SEO-friendly structure

## 📞 Contact Information

The website includes placeholder contact information that should be updated:
- **Phone**: +44 20 1234 5678
- **Email**: arora.nisha@gmail.com
- **Service Area**: Greenwich, CT

## 🚀 Deployment

To deploy this website:

1. **GitHub Pages**: Upload to a GitHub repository and enable GitHub Pages
2. **Netlify**: Drag and drop the folder to Netlify
3. **Vercel**: Connect your repository to Vercel
4. **Traditional Hosting**: Upload files to any web hosting service

## 📋 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔄 Future Enhancements

Potential improvements for the website:
- **E-commerce Integration**: Add online ordering and payment processing
- **Customer Portal**: Allow customers to manage their subscriptions
- **Blog Section**: Share pet nutrition tips and company updates
- **Testimonials**: Add customer reviews and success stories
- **Image Gallery**: Show photos of the food preparation process
- **Nutrition Calculator**: Help customers determine portion sizes

## 📄 License

This website is created for DogDine business use. All rights reserved.

---

**Note**: This is a static website. For full e-commerce functionality, you'll need to integrate with a backend service or e-commerce platform. 