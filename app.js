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
