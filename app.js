// Global state to store fetched data
let allIssues = [];

/**
 * Handle user login with admin credentials
 */
const handleLogin = () => {
  const userName = document.getElementById("user-name").value;
  const userPass = document.getElementById("user-pass").value;

  if (userName === "admin" && userPass === "admin123") {
    // Professional popup notification using SweetAlert2
    Swal.fire({
      title: "Success!",
      text: "Login Successful",
      icon: "success",
      confirmButtonText: "Continue",
      confirmButtonColor: "#2DA44E", // GitHub green color
      buttonsStyling: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Switch view from login to dashboard
        document.getElementById("login-container").classList.add("hidden");
        document.getElementById("dashboard-content").classList.remove("hidden");
        loadAllData();
      }
    });
  } else {
    Swal.fire({
      title: "Error!",
      text: "Invalid Username or Password",
      icon: "error",
      confirmButtonColor: "#d33",
    });
  }
};

/**
 * Fetch all issues from the API
 */
const loadAllData = async () => {
  toggleSpinner(true);
  try {
    const response = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    const result = await response.json();
    allIssues = result.data;
    displayIssues(allIssues);
  } catch (error) {
    console.error("Data fetching failed:", error);
  }
  toggleSpinner(false);
};

/**
 * Display issue cards in the UI
 * @param {Array} issues - List of issues to be rendered
 */
const displayIssues = (issues) => {
  const container = document.getElementById("issue-container");
  container.innerHTML = "";

  // Update Header Stats
  document.getElementById("total-stat").innerText = `${issues.length} Issues`;
  document.getElementById("open-stat").innerText = issues.filter(
    (i) => i.status === "open",
  ).length;
  document.getElementById("closed-stat").innerText = issues.filter(
    (i) => i.status === "closed",
  ).length;

  issues.forEach((issue) => {
    // Logic for conditional top border based on status
    const borderCol =
      issue.status === "open" ? "border-t-green-500" : "border-t-purple-600";
    const statusEmoji = issue.status === "open" ? "🟢" : "🟣";

    const card = document.createElement("div");
    card.className = `bg-white border-t-4 ${borderCol} rounded-md p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col`;

    // Modal trigger on card click (Requirement)
    card.onclick = () => showIssueDetails(issue.id);

    card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tight">${issue.label}</span>
                <span class="text-[10px] font-bold ${issue.status === "open" ? "text-green-600" : "text-purple-600"}">
                    ${statusEmoji} ${issue.status}
                </span>
            </div>
            <h3 class="font-bold text-sm text-[#1F2328] mb-1 line-clamp-1">${issue.title}</h3>
            <p class="text-xs text-gray-500 mb-4 line-clamp-2">${issue.description}</p>
            <div class="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                <div class="flex items-center gap-1">
                    <div class="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                        ${issue.author[0]}
                    </div>
                    <span class="text-[10px] text-gray-600 font-medium">${issue.author}</span>
                </div>
                <span class="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-semibold">${issue.priority}</span>
            </div>
        `;
    container.appendChild(card);
  });
};

/**
 * Filter issues by status (All, Open, Closed)
 */
const filterIssues = (status, btn) => {
  // UI: Manage active button styles
  const buttons = document.querySelectorAll(".btn-sm");
  buttons.forEach((b) => {
    b.classList.remove("bg-gray-200", "font-bold");
    b.classList.add("text-gray-500");
  });
  btn.classList.add("bg-gray-200", "font-bold");
  btn.classList.remove("text-gray-500");

  // Logic: Filter the global issues list
  if (status === "all") {
    displayIssues(allIssues);
  } else {
    const filtered = allIssues.filter((issue) => issue.status === status);
    displayIssues(filtered);
  }
};

/**
 * Search functionality via API
 */
const searchIssues = async () => {
  const query = document.getElementById("search-input").value;
  if (!query) return;

  toggleSpinner(true);
  try {
    const res = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`,
    );
    const data = await res.json();
    displayIssues(data.data);
  } catch (err) {
    console.error("Search failed:", err);
  }
  toggleSpinner(false);
};

/**
 * Show Modal with issue details
 */
const showIssueDetails = async (id) => {
  try {
    const res = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
    );
    const result = await res.json();
    const item = result.data;

    // Custom SweetAlert2 modal to show details
    Swal.fire({
      title: item.title,
      html: `
                <div class="text-left mt-4">
                    <p class="text-gray-600 text-sm mb-4">${item.description}</p>
                    <hr class="my-2">
                    <p class="text-xs"><strong>Author:</strong> ${item.author}</p>
                    <p class="text-xs"><strong>Status:</strong> ${item.status}</p>
                    <p class="text-xs"><strong>Priority:</strong> ${item.priority}</p>
                    <p class="text-xs"><strong>Label:</strong> ${item.label}</p>
                </div>
            `,
      confirmButtonText: "Close",
      confirmButtonColor: "#0969DA",
    });
  } catch (error) {
    console.error("Details fetch failed:", error);
  }
};

/**
 * Utility to show/hide loading spinner
 */
const toggleSpinner = (isLoading) => {
  const spinner = document.getElementById("loading-spinner");
  isLoading
    ? spinner.classList.remove("hidden")
    : spinner.classList.add("hidden");
};
