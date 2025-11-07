// ===== THEME TOGGLE =====
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// ===== ADD NEW QUESTIONS =====
const form = document.getElementById("question-form");
const questionsList = document.getElementById("questions-list");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim() || "Anonymous";
  const questionText = document.getElementById("question").value.trim();

  if (!questionText) return;

  const newQuestion = document.createElement("div");
  newQuestion.classList.add("question-card");
  newQuestion.innerHTML = `
    <h3>${username} asks:</h3>
    <p>${questionText}</p>
    <small style="color:#777;">(Awaiting answer...)</small>
  `;

  questionsList.appendChild(newQuestion);
  form.reset();
  newQuestion.scrollIntoView({ behavior: "smooth" });
});