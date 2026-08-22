# 🎵 Bole Music Shop

A responsive front-end e-commerce website for browsing and purchasing music equipment in Bole, Addis Ababa, Ethiopia.
you can access the website with https://music-shop-project.vercel.app/

## 📌 Project Overview

**Bole Music Shop** is a web-based music equipment shopping application built using **HTML, CSS, and JavaScript**.

The website allows users to:

- Browse available music products
- Search for products by name
- Filter products by category
- Add products to a shopping cart
- Increase or decrease product quantities
- Remove products from the cart
- View the total cart price in ETB
- Save the cart using browser `localStorage`
- Enter checkout information
- Validate Ethiopian phone numbers
- Place an order and receive an order confirmation

## 🛠️ Technologies Used

- **HTML5** — Provides the structure and content of the website
- **CSS3** — Provides styling, layout, responsiveness, and visual design
- **JavaScript (ES6+)** — Handles application logic and user interactions
- **JSON** — Stores the product information
- **Fetch API** — Loads products from `products.json`
- **LocalStorage API** — Saves the user's shopping cart
- **Responsive CSS / Media Queries** — Makes the website work on different screen sizes

## ✨ Main Features

### 🔎 Product Search

Users can search for music products by entering a product name in the search box.

The JavaScript filters the available products based on the user's search term.

### 🏷️ Category Filtering

Products can be filtered by category:

- Guitars
- Keyboards
- Drums
- Audio
- Accessories
- All Categories

### 🛒 Shopping Cart

Users can add products to their cart and manage quantities.

Cart functionality includes:

- Add to cart
- Increase quantity
- Decrease quantity
- Remove products
- Calculate the total price
- Disable checkout when the cart is empty

### 💾 Local Storage

The shopping cart is saved using the browser's `localStorage`.

This means the cart can remain available even after refreshing the page.

The application stores the cart using:

```javascript
localStorage.setItem("boleMusicCart", JSON.stringify(state.cart));
```

### 💳 Checkout

The checkout form collects:

- Customer name
- Ethiopian phone number
- Delivery area

Available delivery areas include:

- Bole
- Kazanchis
- Megenagna

The phone number is validated using an Ethiopian phone-number pattern.

### ✅ Order Confirmation

After a valid checkout:

- The order information is created
- The cart is cleared
- The saved cart is updated
- The user receives an order confirmation
- The total amount and delivery area are displayed

## 🎨 Design

The website uses a dark-themed interface with:

- Dark navy background
- Blue navigation and product sections
- Responsive product grids
- Sticky header
- Sticky shopping cart
- Responsive layouts for desktop, tablet, and mobile screens

## 📱 Responsive Design

CSS media queries adjust the layout based on screen size.

- **Large screens:** Three product columns
- **Medium screens:** Two product columns
- **Small screens:** One product column
- The shopping layout changes to a single-column layout on smaller screens.

## ⚙️ How It Works

The application follows this basic flow:

```text
Open Website
     ↓
Load products from products.json
     ↓
Display Products
     ↓
Search / Filter Products
     ↓
Add Products to Cart
     ↓
Save Cart to LocalStorage
     ↓
Manage Cart
     ↓
Checkout
     ↓
Validate Customer Information
     ↓
Place Order
     ↓
Show Confirmation
```

## 🚀 How to Run

1. Download or clone the project.
2. Open the project folder in VS Code.
3. Make sure the `data/products.json` file exists.
4. Run the project using a local development server such as **Live Server**.
5. Open the provided local URL in a browser.

> Using a local server is recommended because the application uses the Fetch API to load `products.json`.

## 🧪 Testing

The following functionality should be tested:

- Product loading
- Product search
- Category filtering
- Add to cart
- Increase/decrease quantity
- Remove from cart
- Cart total calculation
- Cart persistence after refresh
- Empty-cart checkout prevention
- Name validation
- Ethiopian phone-number validation
- Order confirmation
- Responsive layout

## 👩‍💻 Author

**Elizabeth Debebe**

Bole Music Shop — 2026

## 📄 License

This project was created for educational and demonstration purposes.
