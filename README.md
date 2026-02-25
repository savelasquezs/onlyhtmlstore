# My Store

**Where buying and selling is easy**

Online store website built with pure HTML5. Technology product catalog with semantic structure, internal navigation, and purchase and contact forms.

---

## Features

- **Semantic structure**: Uses HTML5 tags (`header`, `nav`, `main`, `article`, `aside`, `section`, `footer`) for accessibility and SEO
- **Internal navigation**: Anchor links (`#section`) to jump between sections without reloading the page
- **Product catalog**: Articles with detailed specs (price, description, availability, brand, model)
- **Featured products**: Best-selling products list with direct links to the catalog
- **Visual indicators**: Progress bars and meters for customer satisfaction and stock
- **Forms**: Purchase (shipping) and contact forms with basic validation
- **Warranty plans**: Comparison table (Basic, Pro, Premium)
- **HTML only**: No external dependencies, heavy scripts, or styles

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
├── images/         # Product images and logo
│   ├── logo.png
│   ├── pc.jpg
│   ├── smartphone.jpg
│   ├── laptop.jpg
│   ├── tablet.jpg
│   ├── smartwatch.jpg
│   ├── mouse.jpg
│   ├── keyboard.jpg
│   └── monitor.jpg
└── README.md
```

---

## How to run

1. Clone or download the repository
2. Make sure you have the `images/` folder with the referenced images
3. Open `index.html` in your browser (double-click or drag the file)

Or use a local server:

```bash
# With Python 3
python -m http.server 8000

# With npx (Node.js)
npx serve .
```

Then visit `http://localhost:8000` in your browser.

---

## Page sections

| Section               | Description                    |
|-----------------------|--------------------------------|
| Home                  | Store welcome                  |
| Catalog               | Full product catalog           |
| Specifications        | Technical specs of the site    |
| Best Selling Products | Best-selling products          |
| Categories            | Category navigation            |
| Indicators            | Satisfaction and stock per product |
| Store                 | Purchase form                  |
| Warranty plans        | Warranty plans                 |
| My Account            | User account area              |
| Cart                  | Shopping cart                  |
| Contact               | Contact form                   |

---

## Technologies

- **HTML5** (semantic)
- No frameworks or external libraries

---

## Contact

- **Email**: santiavelasquez25@gmail.com
- **Phone**: 317-890-1234
- **Address**: Calle 25 # 30-28, Medellín, Colombia

---

© 2026 My Store. All rights reserved.
