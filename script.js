const API_KEY = "KlxyLWSuB1xyuNuILwHaWcMaY2JJm48EAQl4Fl1S";
const URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=1&thumbs=true`;
const loader = document.getElementById("loader");
const container = document.getElementById("apod-container");
const errorBox = document.getElementById("error");
const titleEl = document.getElementById("title");
const dateEl = document.getElementById("date");
const mediaEl = document.getElementById("media");
const explanationEl = document.getElementById("explanation");
function showLoader() {
  loader.classList.remove("hidden");
  container.classList.add("hidden");
  errorBox.classList.add("hidden");
}
function showError(message) {
  loader.classList.add("hidden");
  container.classList.add("hidden");
  errorBox.classList.remove("hidden");
  errorBox.textContent = message;
}
function renderMedia(data) {
  mediaEl.innerHTML = "";
  if (data.media_type==="image") {
    const img = document.createElement("img");
    img.src = data.url;
    img.alt = data.title;
    mediaEl.appendChild(img);
  }
  else if (data.media_type==="video") {
    if (data.thumbnail_url) {
      const thumb = document.createElement("img");
      thumb.src = data.thumbnail_url;
      thumb.alt = "Video thumbnail";
      mediaEl.appendChild(thumb);
    }

    const btn = document.createElement("a");
    btn.href = data.url;
    btn.target = "_blank";
    btn.textContent = "▶ Watch Video";
    btn.className = "video-btn";

    mediaEl.appendChild(btn);
  }
}

function showData(data) {
  loader.classList.add("hidden");
  container.classList.remove("hidden");

  titleEl.textContent = data.title;
  dateEl.textContent = `Date: ${data.date}`;
  explanationEl.textContent = data.explanation;

  renderMedia(data);
}

function fetchAPOD() {
  showLoader();

  fetch(URL)
    .then(res => {
      if (!res.ok) throw new Error("API error");
      return res.json();
    })
    .then(data => showData(data[0]))
    .catch(err => {
      console.error(err);
      showError("⚠️ Unable to load NASA data. Please try again.");
    });
}

fetchAPOD();