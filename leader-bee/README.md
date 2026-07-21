# LEADER-BEE Landing Page

Production-ready responsive landing page for **LEADER-BEE – 10 Weeks Workshop**.

## Tech Stack

- HTML5
- CSS3
- Bootstrap 5.3
- Vanilla JavaScript
- Font Awesome 6
- Google Fonts (Poppins)

## Project Structure

```
leader-bee/
│
├── index.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   └── app.js
├── assets/
│   └── images/
│       ├── hero.webp
│       ├── hss-logo.png
│       ├── workshop.webp
│       ├── family.webp
│       └── icons/
├── favicon.ico
├── manifest.webmanifest
└── README.md
```

## Features

- Sticky, responsive navbar
- Hero section matching provided design reference
- Program details with interactive hover cards
- Skills grid with circular icon badges
- Parent + workshop highlights dual cards
- Registration CTA with large gradient button
- Important notes + share section
- Footer with branding and social icons
- Smooth scrolling and reveal animations
- Button ripple effect
- Keyboard accessible controls and semantic structure
- SEO metadata + OpenGraph + Twitter + JSON-LD

## Assets

The project now includes real image binaries copied from the existing repository assets:

- `assets/images/hero.webp`
- `assets/images/hss-logo.png`
- `assets/images/workshop.webp`
- `assets/images/family.webp`

## Run Locally

Since this is a static project, open `index.html` directly or serve with any static server.

### Option 1: VS Code Live Server

- Install Live Server extension
- Right click `index.html` -> **Open with Live Server**

### Option 2: Python

```bash
cd leader-bee
python3 -m http.server 5500
```

Then open: `http://localhost:5500`

## Notes

- The registration button scrolls to the registration CTA section.
- External registration link points to:
  - `https://join.shakhasewasetu.com/register-leader-bee`
