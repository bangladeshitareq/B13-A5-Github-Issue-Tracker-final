const handleLogin = () => {
  const user = document.getElementById("user-name").value;
  const pass = document.getElementById("user-pass").value;

  if (user === "admin" && pass === "admin123") {
    Swal.fire({
      title: "Success!",
      text: "Login Successful",
      icon: "success",
      confirmButtonText: "Continue",
    }).then((result) => {
      if (result.isConfirmed) {
        document.getElementById("login-container").classList.add("hidden");
        document.getElementById("dashboard-content").classList.remove("hidden");
        loadAllData();
      }
    });
  } else {
    Swal.fire({
      title: "Error!",
      text: "Invalid Credentials",
      icon: "error",
    });
  }
};

const loadAllData = async () => {
  toggleSpinner(true);
  try {
    const res = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    const data = await res.json();
    allIssues = data.data;
    displayIssues(allIssues);
  } catch (err) {
    console.error("Fetch error:", err);
  }
  toggleSpinner(false);
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
