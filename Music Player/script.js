const songs = [
  { title: "Song 1 - Pop Vibes", src: "songs/song1.mp3", category: "pop" },
  { title: "Song 2 - Rock Anthem", src: "songs/song2.mp3", category: "rock" },
  { title: "Song 3 - Jazz Flow", src: "songs/song3.mp3", category: "jazz" },
  { title: "Song 4 - Chill Beats", src: "songs/song4.mp3", category: "pop" },
  { title: "Song 5 - Guitar Solo", src: "songs/song5.mp3", category: "rock" },
  { title: "Song 6 - Smooth Sax", src: "songs/song6.mp3", category: "jazz" }
];


const audioPlayer = document.getElementById("audioPlayer");
const playlistEl = document.getElementById("playlist");
const playPauseBtn = document.getElementById("playPauseBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const volumeControl = document.getElementById("volumeControl");
const searchBar = document.getElementById("searchBar");
const categoryFilter = document.getElementById("categoryFilter");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const songTitle = document.getElementById("songTitle");
const songCategory = document.getElementById("songCategory");

let currentIndex = 0;
let isPlaying = false;

// Format time mm:ss
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Render Playlist
function renderPlaylist(filter = "all", search = "") {
  playlistEl.innerHTML = "";
  songs
    .filter(song => (filter === "all" || song.category === filter))
    .filter(song => song.title.toLowerCase().includes(search.toLowerCase()))
    .forEach((song, index) => {
      const li = document.createElement("li");
      li.textContent = song.title;
      li.addEventListener("click", () => loadSong(index));
      if (index === currentIndex) li.classList.add("active");
      playlistEl.appendChild(li);
    });
}

function loadSong(index) {
  currentIndex = index;
  const song = songs[currentIndex];
  audioPlayer.src = song.src;
  songTitle.textContent = song.title;
  songCategory.textContent = `Category: ${song.category}`;
  updatePlaylistUI();
  playSong();
}

function playSong() {
  audioPlayer.play();
  isPlaying = true;
  playPauseBtn.textContent = "⏸ Pause";
}

function pauseSong() {
  audioPlayer.pause();
  isPlaying = false;
  playPauseBtn.textContent = "▶️ Play";
}

function updatePlaylistUI() {
  const items = playlistEl.querySelectorAll("li");
  items.forEach((item, idx) => {
    item.classList.toggle("active", idx === currentIndex);
  });
}

// Controls
playPauseBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
});

volumeControl.addEventListener("input", (e) => {
  audioPlayer.volume = e.target.value;
});

// Progress Bar
audioPlayer.addEventListener("timeupdate", () => {
  progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  totalTimeEl.textContent = formatTime(audioPlayer.duration || 0);
});

progressBar.addEventListener("input", () => {
  audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
});

// Auto play next
audioPlayer.addEventListener("ended", () => {
  nextBtn.click();
});

// Search & Filter
searchBar.addEventListener("input", () => {
  renderPlaylist(categoryFilter.value, searchBar.value);
});
categoryFilter.addEventListener("change", () => {
  renderPlaylist(categoryFilter.value, searchBar.value);
});

// Initialize
renderPlaylist();
loadSong(currentIndex);
