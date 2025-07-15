
const API_KEY = "b22ad2978ce422c7c76049788b3a242d";
const chatBox = document.getElementById("chat-box");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");

// Genre map for basic keyword matching
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
    appendMessage("Searching for movies...", "bot");
    const movie = await fetchMovieByGenre(genreId);
    if (movie) {
      setTimeout(() => {
        appendMessage(`🎬 *${movie.title}*\n📅 ${movie.release_date}\n⭐ ${movie.vote_average}/10\n\n${movie.overview}`, "bot");
      }, 800);
    } else {
      appendMessage("I couldn't find a movie right now. Try another genre?", "bot");
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
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&with_genres=${genreId}`);
    const data = await res.json();
    const results = data.results;
    if (results && results.length > 0) {
      const random = results[Math.floor(Math.random() * results.length)];
      return random;
    }
  } catch (error) {
    console.error("API Error:", error);
  }
  return null;
}
