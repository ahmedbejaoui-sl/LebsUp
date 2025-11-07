// ======================== LOAD USER ========================
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
  alert("⚠️ Please log in first!");
  window.location.href = "login.html";
} else {
  document.getElementById("email").textContent = currentUser.email;
  document.getElementById("phone").textContent = currentUser.phone;
  document.getElementById("style").textContent = currentUser.style || "Not chosen yet";
  if (currentUser.profileImage) {
    document.getElementById("profileImage").src = currentUser.profileImage;
  }
}

// ======================== PASSWORD CHANGE ========================
const changeBtn = document.getElementById("changePasswordBtn");
const codeSection = document.getElementById("codeSection");
const saveBtn = document.getElementById("savePasswordBtn");

let verificationCode = null;

changeBtn.addEventListener("click", () => {
  verificationCode = Math.floor(1000 + Math.random() * 9000);
  localStorage.setItem("verificationCode", verificationCode);
  alert(`📩 Verification code sent to ${currentUser.phone}: ${verificationCode}`);
  codeSection.classList.remove("hidden");
});

saveBtn.addEventListener("click", () => {
  const enteredCode = document.getElementById("codeInput").value.trim();
  const newPass = document.getElementById("newPassword").value.trim();

  if (enteredCode !== localStorage.getItem("verificationCode")) {
    alert("❌ Incorrect verification code!");
    return;
  }

  if (newPass.length < 4) {
    alert("⚠️ Password must be at least 4 characters!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const index = users.findIndex(u => u.email === currentUser.email);

  if (index !== -1) {
    users[index].password = newPass;
    localStorage.setItem("users", JSON.stringify(users));
    currentUser.password = newPass;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    alert("✅ Password changed successfully!");
    codeSection.classList.add("hidden");
    document.getElementById("codeInput").value = "";
    document.getElementById("newPassword").value = "";
  }
});

// ======================== LOGOUT ========================
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  alert("👋 Logged out!");
  window.location.href = "login.html";
});

// ======================== DARK/LIGHT MODE ========================
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
});

// ======================== PROFILE PICTURE UPLOAD ========================
const uploadPic = document.getElementById("uploadPic");
const profileImage = document.getElementById("profileImage");

uploadPic.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profileImage.src = reader.result;
      currentUser.profileImage = reader.result;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      let users = JSON.parse(localStorage.getItem("users")) || [];
      const idx = users.findIndex(u => u.email === currentUser.email);
      if (idx !== -1) {
        users[idx].profileImage = reader.result;
        localStorage.setItem("users", JSON.stringify(users));
      }
    };
    reader.readAsDataURL(file);
  }
});
