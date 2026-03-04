# My Store

**Where buying and selling is easy**

Online store website built with HTML5 and CSS. Technology product catalog with semantic structure, internal navigation, purchase and contact forms, and custom styling.

---

## Features

### HTML Structure & Semantics
- **Semantic structure**: Uses HTML5 tags (`header`, `nav`, `main`, `article`, `aside`, `section`, `footer`) for accessibility and SEO
- **Internal navigation**: Anchor links (`#section`) to jump between sections without reloading the page
- **Product catalog**: Articles with detailed specs (price, description, availability, brand, model)
- **Featured products**: Best-selling products list (numbered) with direct links to the catalog
- **Visual indicators**: Progress bars and meters for customer satisfaction and stock
- **Forms**: Purchase (shipping) and contact forms with basic validation
- **Warranty plans**: Comparison table (Basic, Pro, Premium)

### CSS Styling
- **CSS variables**: Theme colors, shadows, and transitions defined in `:root`
- **Layout**: Flexbox and CSS Grid 
- **Fixed sidebar**: Navigation menu fixed on the left
- **Section-based hierarchy**: Styles scoped under `#catalog`, `#cart`, `#plans`, etc.
- **Shared patterns**: Card and hover effects to avoid redundancy
- **Product grid**: 3-column catalog layout with card-style articles
- **Hover effects**: Scale and color transitions on interactive elements
- **Typography**: Segoe UI font family, consistent sizing
- **No frameworks**: Pure HTML and CSS only

---

## Catalog products

| Product    | Brand    | Price |
|------------|----------|-------|
| PC         | Dell     | $500  |
| Smartphone | Apple    | $200  |
| Laptop     | Dell     | $300  |
| Tablet     | Apple    | $400  |
| Smartwatch | Apple    | $500  |
| Mouse      | Logitech | $50   |
| Keyboard   | Apple    | $100  |
| Monitor    | Apple    | $100  |

---

## Project structure

```
Store/
├── index.html      # Main page
├── styles.css      # Stylesheet (variables, layout, section-based styles)
├── images/         # Product images and logo
│   ├── logo.png
│   ├── pc.jpg
│   ├── smartphone.jpg
│   ├── laptop.jpg
│   ├── tablet.jpg
│   ├── smartwatch.jpg
│   ├── mouse.jpg
│   ├── keyboard.jpg
│   ├── monitor.jpg
│   └── cart.png
└── README.md
```

---

## How to run

Go to https://codesandbox.io/p/sandbox/github/savelasquezs/onlyhtmlstore/tree/css 
to see both the files and web page running

1. Clone or download the repository
2. Make sure you have the `images/` folder with the referenced images
3. Open `index.html` in your browser (double-click or drag the file)

Or install live server on your favorite code editor.







---

## Page sections

| Section               | Description                    |
|-----------------------|--------------------------------|
| Home                  | Store welcome                  |
| Catalog               | Full product catalog           |
| Specifications        | Technical specs of the site    |
| Best Selling Products | Best-selling products (numbered list) |
| Categories            | Category navigation            |
| Indicators            | Satisfaction and stock per product |
| Store                 | Purchase form                  |
| Warranty plans        | Warranty plans                 |
| My Account            | User account area              |
| Cart                  | Shopping cart                  |
| Contact               | Contact form                   |

---

## Technologies

- **HTML5** (semantic structure)
- **CSS3** (Flexbox, Grid, variables, transitions)
- No JavaScript frameworks or external libraries

---

## Contact

- **Email**: santyvano@outlook.com
- **Phone**: 3127163848
- **Address**: Calle 25 # 30-28, Medellín, Colombia

---

© 2026 My Store. All rights reserved.
