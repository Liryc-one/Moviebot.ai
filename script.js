const API_KEY = "b22ad2978ce422c7c76049788b3a242d";
const chatBox = document.getElementById("chat-box");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");

// Genre keyword to TMDb genre ID mapping
const genres = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  science: 878,
  scifi: 878,
  thriller: 53,
  war: 10752,
  western: 37
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage(userText, "user");
  input.value = "";

  const genreId = extractGenre(userText.toLowerCase());

  if (genreId) {
    appendMessage("🔍 Searching for a great movie...", "bot");
    const movie = await fetchMovieByGenre(genreId);
    if (movie) {
      setTimeout(() => {
        appendMovieMessage(movie);
      }, 800);
    } else {
      appendMessage("Sorry, I couldn't find any movie for that genre right now. Try another one?", "bot");
    }
  } else {
    appendMessage("Please specify a genre like action, comedy, horror, etc.", "bot");
  }
});

function appendMessage(text, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendMovieMessage(movie) {
  const movieMessage = document.createElement("div");
  movieMessage.classList.add("message", "bot");

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  movieMessage.innerHTML = `
    <strong>🎬 ${movie.title}</strong><br/>
    <small>📅 ${movie.release_date || "Unknown"} | ⭐ ${movie.vote_average}/10</small><br/>
    <p>${movie.overview || "No overview available."}</p>
    ${posterUrl ? `<img src="${posterUrl}" alt="Poster" class="poster" />` : ""}
  `;

  chatBox.appendChild(movieMessage);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function extractGenre(text) {
  for (let keyword in genres) {
    if (text.includes(keyword)) {
      return genres[keyword];
    }
  }
  return null;
}

async function fetchMovieByGenre(genreId) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&with_genres=${genreId}`
    );
    const data = await res.json();
    const results = data.results;
    if (results && results.length > 0) {
      return results[Math.floor(Math.random() * results.length)];
    }
  } catch (error) {
    console.error("API Error:", error);
  }
  return null;
}
