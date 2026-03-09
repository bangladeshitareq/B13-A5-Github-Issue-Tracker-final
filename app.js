let allIssuesData = [];

// Login with custom success modal
const handleLogin = () => {
  const user = document.getElementById("user-name").value;
  const pass = document.getElementById("user-pass").value;

  if (user === "admin" && pass === "admin123") {
    document.getElementById("success_modal").showModal();
  } else {
    alert("Invalid Username or Password");
  }
};

// Redirect to dashboard after modal confirm
const goToDashboard = () => {
  document.getElementById("success_modal").close();
  document.getElementById("login-container").classList.add("hidden");
  document.getElementById("dashboard-content").classList.remove("hidden");
  loadIssuesFromServer();
};

// API Call
async function loadIssuesFromServer() {
  toggleSpinner(true);
  try {
    const res = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    const data = await res.json();
    allIssuesData = data.data;
    displayIssues(allIssuesData);
  } catch (e) {
    console.error(e);
  }
  toggleSpinner(false);
}

// Rendering UI with Label Highlight & Correct Data Mapping
function displayIssues(issues) {
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  // Stats
  document.getElementById("total-text").innerText =
    `${issues.length} Issues Found`;
  document.getElementById("count-open").innerText = allIssuesData.filter(
    (i) => i.status === "open",
  ).length;
  document.getElementById("count-closed").innerText = allIssuesData.filter(
    (i) => i.status === "closed",
  ).length;

  issues.forEach((item) => {
    const isOpen = item.status === "open";
    const borderCol = isOpen ? "border-t-green-500" : "border-t-purple-600";

    const card = document.createElement("div");
    card.className = `bg-white border-t-4 ${borderCol} rounded-lg p-5 shadow-sm hover:shadow-md cursor-pointer border-x border-b border-gray-100 flex flex-col h-full`;

    card.onclick = () => showDetails(item.id);

    card.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <span class="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded border border-blue-100 uppercase">
                    ${item.label || "No Label"}
                </span>
                <span class="text-[10px] font-bold ${isOpen ? "text-green-600" : "text-purple-600"} uppercase">
                    ${isOpen ? "🟢 Open" : "🟣 Closed"}
                </span>
            </div>
            <h3 class="font-bold text-sm text-gray-800 mb-2 line-clamp-1">${item.title}</h3>
            <p class="text-xs text-gray-500 mb-6 flex-grow line-clamp-2">${item.description}</p>
            <div class="flex justify-between items-center pt-3 border-t border-gray-50 mt-auto">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold uppercase">${item.author[0]}</div>
                    <span class="text-[10px] font-bold text-gray-700">${item.author}</span>
                </div>
                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">${item.priority}</span>
            </div>
        `;
    container.appendChild(card);
  });
}

// Tab Filter
function filterByStatus(status, btn) {
  const buttons = document.querySelectorAll("#tab-btns button");
  buttons.forEach((b) => {
    b.classList.remove("bg-gray-200", "font-bold", "border-gray-300");
    b.classList.add("btn-ghost", "text-gray-500", "border-none");
  });
  btn.classList.add("bg-gray-200", "font-bold", "border-gray-300");
  btn.classList.remove("btn-ghost", "text-gray-500", "border-none");

  if (status === "all") displayIssues(allIssuesData);
  else displayIssues(allIssuesData.filter((i) => i.status === status));
}

// Search Function
async function handleSearch() {
  const q = document.getElementById("search-input").value;
  if (!q) return;
  toggleSpinner(true);
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${q}`,
  );
  const data = await res.json();
  displayIssues(data.data);
  toggleSpinner(false);
}

// Modal Details
async function showDetails(id) {
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
  );
  const data = await res.json();
  const issue = data.data;

  document.getElementById("modal-content").innerHTML = `
        <span class="text-xs font-bold text-blue-600 uppercase mb-2 block">${issue.label}</span>
        <h2 class="text-2xl font-black mb-4">${issue.title}</h2>
        <p class="text-gray-500 text-sm mb-6 p-4 bg-gray-50 rounded border-l-4 border-gray-300 italic">"${issue.description}"</p>
        <div class="grid grid-cols-2 gap-4 text-xs font-bold uppercase">
            <div><p class="text-gray-400">Author</p><p>${issue.author}</p></div>
            <div><p class="text-gray-400">Priority</p><p class="text-orange-500">${issue.priority}</p></div>
            <div><p class="text-gray-400">Status</p><p>${issue.status}</p></div>
            <div><p class="text-gray-400">Created At</p><p>${issue.createdAt.split("T")[0]}</p></div>
        </div>
    `;
  document.getElementById("details_modal").showModal();
}

function toggleSpinner(show) {
  const l = document.getElementById("loading");
  show ? l.classList.remove("hidden") : l.classList.add("hidden");
}
