const API_KEY = "DEMO_KEY";
const BASE_URL = "https://api.nasa.gov/planetary/apod";

const loader = document.getElementById("loader");
const errorBox = document.getElementById("error");
const apodList = document.getElementById("apod-list");

const searchText = document.getElementById("search-text");
const searchDate = document.getElementById("search-date");
const filterType = document.getElementById("filter-type");
const sortOrder = document.getElementById("sort-order");
const themeToggle = document.getElementById("theme-toggle");
const resetFilters = document.getElementById("reset-filters");

let apodData = [];
let filteredData = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const placeholderImage =
  "https://via.placeholder.com/800x500?text=Space+Image";

const fallbackData = [
  {
    date: "2024-03-25",
    title: "Galaxy in Deep Space",
    explanation:
      "A beautiful deep space galaxy image used as fallback data when the NASA API is unavailable.",
    media_type: "image",
    url: "https://via.placeholder.com/800x500?text=Galaxy+in+Deep+Space"
  },
  {
    date: "2024-03-24",
    title: "Colorful Nebula View",
    explanation:
      "A colorful nebula captured by space telescopes. This entry helps demonstrate filtering and sorting.",
    media_type: "image",
    url: "https://via.placeholder.com/800x500?text=Colorful+Nebula+View"
  },
  {
    date: "2024-03-23",
    title: "Moon Surface Closeup",
    explanation:
      "A detailed view of the Moon surface for the NASA Mission Explorer project.",
    media_type: "image",
    url: "https://via.placeholder.com/800x500?text=Moon+Surface+Closeup"
  },
  {
    date: "2024-03-22",
    title: "Space Video Feature",
    explanation:
      "A sample space video entry to demonstrate media filtering between images and videos.",
    media_type: "video",
    url: "https://www.youtube.com/watch?v=21X5lGlDOfg",
    thumbnail_url: "https://img.youtube.com/vi/21X5lGlDOfg/hqdefault.jpg"
  }
];

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

function showError(message) {
  errorBox.classList.remove("hidden");
  errorBox.textContent = message;
}

function clearError() {
  errorBox.classList.add("hidden");
  errorBox.textContent = "";
}

function getMediaHTML(item) {
  if (item.media_type === "image") {
    return `
      <div class="media">
        <img src="${item.url}" alt="${item.title}" onerror="this.src='${placeholderImage}'">
      </div>
    `;
  }

  if (item.media_type === "video") {
    return `
      <div class="media">
        ${
          item.thumbnail_url
            ? `<img src="${item.thumbnail_url}" alt="${item.title}" onerror="this.src='${placeholderImage}'">`
            : ""
        }
        <a href="${item.url}" target="_blank" class="video-btn">▶ Watch Video</a>
      </div>
    `;
  }

  return "";
}

function renderCards(data) {
  apodList.innerHTML = "";

  if (data.length === 0) {
    apodList.innerHTML = `<p class="no-results">No results found.</p>`;
    return;
  }

  apodList.innerHTML = data
    .map(
      (item) => `
      <div class="card">
        <h2>${item.title}</h2>
        <p class="date">Date: ${item.date}</p>
        ${getMediaHTML(item)}
        <p class="explanation">${item.explanation}</p>
        <button class="fav-btn" onclick="toggleFavorite('${item.date}')">
          ${favorites.includes(item.date) ? "⭐ Remove Favorite" : "☆ Add to Favorites"}
        </button>
      </div>
    `
    )
    .join("");
}

function sortData(order) {
  filteredData.sort((a, b) => {
    if (order === "newest") return new Date(b.date) - new Date(a.date);
    if (order === "oldest") return new Date(a.date) - new Date(b.date);
    if (order === "az") return a.title.localeCompare(b.title);
    if (order === "za") return b.title.localeCompare(a.title);
    return 0;
  });
}

function applyFilters() {
  const query = searchText.value.toLowerCase().trim();
  const selectedDate = searchDate.value;
  const selectedType = filterType.value;
  const selectedSort = sortOrder.value;

  filteredData = apodData.filter((item) => {
    const matchesText =
      item.title.toLowerCase().includes(query) ||
      item.explanation.toLowerCase().includes(query);

    const matchesDate = selectedDate ? item.date === selectedDate : true;

    let matchesType = true;
    if (selectedType === "image" || selectedType === "video") {
      matchesType = item.media_type === selectedType;
    } else if (selectedType === "favorites") {
      matchesType = favorites.includes(item.date);
    }

    return matchesText && matchesDate && matchesType;
  });

  sortData(selectedSort);
  renderCards(filteredData);
}

function toggleFavorite(date) {
  if (favorites.includes(date)) {
    favorites = favorites.filter((favDate) => favDate !== date);
  } else {
    favorites.push(date);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  applyFilters();
}

async function fetchJSON(url) {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(`NASA API error: ${response.status}`);
  }

  if (!contentType.includes("application/json")) {
    throw new Error("API did not return JSON.");
  }

  return JSON.parse(rawText);
}

async function fetchRecentAPOD() {
  showLoader();
  clearError();

  try {
    const url = `${BASE_URL}?api_key=${API_KEY}&start_date=2024-03-20&end_date=2024-03-25&thumbs=true`;
    const data = await fetchJSON(url);

    if (!Array.isArray(data)) {
      throw new Error("Unexpected data format.");
    }

    apodData = data;
    applyFilters();
  } catch (error) {
    console.error("NASA API Error:", error);
    apodData = fallbackData;
    showError("⚠️ Live NASA data is unavailable right now. Showing demo data.");
    applyFilters();
  } finally {
    hideLoader();
  }
}

async function fetchByDate(date) {
  showLoader();
  clearError();

  try {
    const url = `${BASE_URL}?api_key=${API_KEY}&date=${date}&thumbs=true`;
    const data = await fetchJSON(url);

    apodData = [data];
    applyFilters();
  } catch (error) {
    console.error("NASA Date Error:", error);
    searchDate.value = "";
    apodData = fallbackData;
    showError("⚠️ Could not load selected date. Showing demo data instead.");
    applyFilters();
  } finally {
    hideLoader();
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const currentTheme = document.body.classList.contains("light-mode")
    ? "light"
    : "dark";
  localStorage.setItem("theme", currentTheme);
});

resetFilters.addEventListener("click", () => {
  searchText.value = "";
  searchDate.value = "";
  filterType.value = "all";
  sortOrder.value = "newest";
  clearError();
  fetchRecentAPOD();
});

searchText.addEventListener("input", applyFilters);
filterType.addEventListener("change", applyFilters);
sortOrder.addEventListener("change", applyFilters);

searchDate.addEventListener("change", () => {
  if (searchDate.value) {
    fetchByDate(searchDate.value);
  } else {
    fetchRecentAPOD();
  }
});

loadTheme();
fetchRecentAPOD();

window.toggleFavorite = toggleFavorite;