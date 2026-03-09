const handleLogin = () => {
  const user = document.getElementById("user-name").value;
  const pass = document.getElementById("user-pass").value;

  if (user === "admin" && pass === "admin123") {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("dashboard-content").classList.remove("hidden");
  } else {
    alert("Invalid credentials! Use: admin / admin123");
  }
};

let allIssues = [];

const toggleSpinner = (show) => {
  const spinner = document.getElementById("loading-spinner");
  show ? spinner.classList.remove("hidden") : spinner.classList.add("hidden");
};

const filterIssues = (status, btn) => {
  const buttons = document.querySelectorAll(".btn-sm");
  buttons.forEach((b) => b.classList.remove("bg-gray-200", "font-bold"));
  btn.classList.add("bg-gray-200", "font-bold");
};

const searchIssues = () => {
  const query = document.getElementById("search-input").value;
  console.log("Searching for:", query);
};
