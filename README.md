# Codsoft Web Development Internship Tasks 🚀

Welcome to my repository for the **Codsoft Web Development Internship**. This repository showcases a collection of responsive, accessible, and high-performance web projects developed during the internship curriculum.

---

## 📂 Project Directory Structure

| Task | Project Name | Description | Tech Stack | Link |
|---|---|---|---|---|
| **Task 1** | [AI & ML Portfolio](./Task-1/) | Single-page portfolio for an AI & ML Engineer. | HTML, CSS, JavaScript | [View Folder](./Task-1/) |
| **Task 2** | [Multi-Page Portfolio](./Task-2/) | Accessible multi-page portfolio with theme switching. | HTML, CSS, JavaScript | [View Folder](./Task-2/) |
| **Task 3** | [TaskFlow Manager](./Task-3/) | Elegant glassmorphic task management application. | HTML, CSS, JavaScript | [View Folder](./Task-3/) |
| **Task 4** | [SkyFlow Dashboard](./Task-4/) | Real-time weather dashboard using Open-Meteo API. | HTML, CSS, API, JavaScript | [View Folder](./Task-4/) |
| **Task 5** | [R.N. Agritech Platform](./Task-5/) | Full-stack e-commerce and consultancy platform. | Express, Node.js, MongoDB, JS | [View Folder](./Task-5/) |

---

## 🏅 Task 1: Personal Portfolio (AI & ML Engineer)
A premium, professional single-page portfolio website designed for an AI & ML Engineer. It features reveal animations on scroll and a modern dark-themed aesthetic.
- **Key Features:**
  - Modern Sticky Navigation with scroll active states.
  - Dynamic Skill Grid with custom icons.
  - Project Showcase with interactive hover cards.
  - Fully Responsive Design (Mobile, Tablet, Desktop).
- **Tech Stack:** HTML5, CSS3, JavaScript (ES6+), Font Awesome.
- **Location:** [`/Task-1/`](./Task-1/)

---

## 🏅 Task 2: Multi-Page Personal Portfolio (Accessible)
An advanced multi-page personal portfolio website with dedicated pages for Home, About, Skills, Projects, and Contact, prioritizing accessibility and user preference.
- **Key Features:**
  - Multi-page layout (linked via semantic `<nav>`).
  - Dark/Light Theme Switching with `localStorage` persistence.
  - Keyboard-accessible navigation menu (aria-expanded, focus traps) and interactive elements.
  - Accessible form validation with visual, screen-reader friendly feedback.
  - Motion-reduced animations that respect user preferences (`prefers-reduced-motion`).
- **Tech Stack:** HTML5, CSS3, JavaScript, Font Awesome.
- **Location:** [`/Task-2/`](./Task-2/)

---

## 🏅 Task 3: TaskFlow - Elegant Task Management App
A clean, glassmorphic task management dashboard designed for tracking activities with ease, color-coded details, and persistent storage.
- **Key Features:**
  - Create tasks with title, category (Work, Personal, Shopping, Ideas), priority levels (Low, Medium, High), and due dates.
  - Real-time search and filter tabs (All, Active, Completed, High/Medium/Low priority).
  - Modern glassmorphism UI with ambient background glowing orbs.
  - LocalStorage integration for offline data persistence.
- **Tech Stack:** HTML5, CSS3, JavaScript (DOM manipulation, LocalStorage).
- **Location:** [`/Task-3/`](./Task-3/)

---

## 🏅 Task 4: SkyFlow - Real-Time Weather Dashboard
An interactive weather forecast dashboard that connects to live meteorological data to show current conditions and highlights for search locations.
- **Key Features:**
  - Auto-complete search bar powered by Geocoding APIs.
  - Detailed metrics display (Humidity, Wind Speed, UV Index, Sunrise/Sunset, Pressure, Visibility).
  - Celsius / Fahrenheit toggle with state preservation.
  - Recent search chips for quick switching between cities.
  - Weather-responsive UI background changes.
- **Tech Stack:** HTML5, CSS3, Async JavaScript (Fetch API), Open-Meteo REST API.
- **Location:** [`/Task-4/`](./Task-4/)

---

## 🏅 Task 5: R.N. Agritech Services - Full-Stack E-commerce Platform
A full-stack e-commerce and gardening/agricultural services platform that supports user accounts, cart operations, order checkout, and administrative capabilities.
- **Key Features:**
  - **JWT Authentication:** Secure user signup and login with token refresh mechanisms.
  - **Cart Management:** Synchronizes guest/local carts to MongoDB upon login.
  - **Checkout Flow:** Multi-step checkout (Login -> Address -> Summary -> Confirm) with automated WhatsApp notification alerts to the business.
  - **Admin Dashboard:** Access-restricted panel to view store performance statistics and update/cancel customer orders.
- **Tech Stack:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Vanilla HTML/CSS/JS.
- **Location:** [`/Task-5/`](./Task-5/)

---

## 🚀 Getting Started

To run any of the client-side portfolios or dashboards (Tasks 1, 2, 3, 4):
1. Open the project folder in your editor.
2. Open the `index.html` file in your browser, or serve it using a local utility like Live Server:
   ```bash
   npx serve ./Task-X
   ```

To run the Full-Stack platform (Task 5):
1. Navigate to the backend directory:
   ```bash
   cd Task-5/Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside `Task-5/Backend` with these keys:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/rn_agritech
   JWT_SECRET=your_secret_key
   ```
4. Seed the database with the admin user:
   ```bash
   node seedAdmin.js
   ```
5. Start the backend:
   ```bash
   npm run dev
   ```
6. Open `Task-5/rnproject/index.html` using a local server.
---
*Created as part of the Codsoft Web Development Internship curriculum.*
