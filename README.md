# 🚀 NASA Mission Explorer

## 📌 Project Description

NASA Mission Explorer is a responsive web application built using **HTML, CSS, and JavaScript**.  
It allows users to explore NASA’s Astronomy Picture of the Day (APOD) content in a simple and interactive way.

The application displays space-related images and videos along with their:
- title
- date
- description

Users can also search, filter, sort, save favorites, and switch between dark and light theme modes.

If the NASA API is temporarily unavailable, the application automatically shows demo fallback data so the project still works smoothly.

---

## 🌌 API Used

**NASA APOD API**  
https://api.nasa.gov/

---

## ✨ Features Implemented

### ✅ Milestone 2 Features
- Integrated NASA APOD API using `fetch()`
- Displayed API data dynamically on the webpage
- Added loading state
- Added error handling
- Made the website responsive

### ✅ Milestone 3 Features
- **Searching**
  - Search by title
  - Search by description

- **Filtering**
  - All Media
  - Images
  - Videos
  - Favorites

- **Sorting**
  - Newest First
  - Oldest First
  - Title A-Z
  - Title Z-A

- **Button Interaction**
  - Add to Favorites
  - Remove Favorite
  - Reset filters

- **Dark / Light Theme Toggle**

- **Local Storage**
  - Saves favorites
  - Saves selected theme

### ✅ Extra Improvement
- Fallback demo data is shown when live NASA data is unavailable

---

## 🛠 Technologies Used

- HTML
- CSS
- JavaScript
- Fetch API
- Local Storage

---

## 📂 Project Structure

```text
NASA/
  index.html
  style.css
  script.js
  README.md