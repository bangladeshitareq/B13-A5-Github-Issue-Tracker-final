let masterData = []; // Main array to store issues

// Function for Login
function startLogin() {
  const userValue = document.getElementById("input-user").value;
  const passValue = document.getElementById("input-pass").value;

  if (userValue === "admin" && passValue === "admin123") {
    alert("loging successfull"); // User requested specific browser alert
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("main-dashboard").classList.remove("hidden");
    fetchIssues();
  } else {
    alert("Login failed! Check your username/password.");
  }
}

// Fetching all issues from API
async function fetchIssues() {
  showLoader(true);
  try {
    const response = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    const result = await response.json();
    masterData = result.data;
    renderData(masterData);
  } catch (err) {
    console.log("Error loading data", err);
  }
  showLoader(false);
}

// Rendering cards on the UI
function renderData(dataList) {
  const container = document.getElementById("cards-list");
  container.innerHTML = "";

  // Stats Logic
  document.getElementById("issue-total").innerText =
    `${dataList.length} Issues Found`;
  document.getElementById("open-count").innerText = masterData.filter(
    (i) => i.status === "open",
  ).length;
  document.getElementById("closed-count").innerText = masterData.filter(
    (i) => i.status === "closed",
  ).length;

  dataList.forEach((item) => {
    const isCurrentlyOpen = item.status === "open";
    const topBorder = isCurrentlyOpen
      ? "border-t-green-500"
      : "border-t-purple-600";

    const div = document.createElement("div");
    div.className = `bg-white border-t-4 ${topBorder} rounded-md p-4 shadow-sm hover:shadow-md cursor-pointer flex flex-col h-full`;

    // On click show modal details
    div.onclick = () => getSingleIssue(item.id);

    div.innerHTML = `
            <div class="flex justify-between mb-2 uppercase text-[10px] font-bold text-gray-400">
                <span>${item.label}</span>
                <span class="${isCurrentlyOpen ? "text-green-600" : "text-purple-600"}">${isCurrentlyOpen ? "🟢" : "🟣"} ${item.status}</span>
            </div>
            <h2 class="font-bold text-sm mb-1 text-gray-800 line-clamp-1">${item.title}</h2>
            <p class="text-xs text-gray-500 mb-4 flex-grow line-clamp-2">${item.description}</p>
            <div class="flex justify-between items-center pt-2 border-t border-gray-100">
                <div class="flex items-center gap-1">
                    <span class="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold uppercase">${item.author[0]}</span>
                    <span class="text-[10px] font-semibold text-gray-700">${item.author}</span>
                </div>
                <span class="text-[10px] italic text-gray-400 font-bold">${item.priority}</span>
            </div>
        `;
    container.appendChild(div);
  });
}

// Filter Tab Logic
function changeTab(type, element) {
  const allButtons = document.querySelectorAll("#tab-group button");
  allButtons.forEach((b) => {
    b.classList.remove("bg-gray-200", "font-bold");
    b.classList.add("btn-ghost", "text-gray-500");
  });
  element.classList.add("bg-gray-200", "font-bold");
  element.classList.remove("btn-ghost", "text-gray-500");

  if (type === "all") renderData(masterData);
  else renderData(masterData.filter((x) => x.status === type));
}

// Search Logic
async function handleSearch() {
  const text = document.getElementById("search-box").value;
  if (!text) return;

  showLoader(true);
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`,
  );
  const result = await res.json();
  renderData(result.data);
  showLoader(false);
}

// Modal Details Fetch
async function getSingleIssue(id) {
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
  );
  const result = await res.json();
  const info = result.data;

  const modalContent = document.getElementById("modal-body-content");
  modalContent.innerHTML = `
        <h3 class="font-bold text-xl mb-4">${info.title}</h3>
        <p class="text-gray-600 mb-4">${info.description}</p>
        <hr class="mb-4">
        <div class="grid grid-cols-2 gap-4 text-sm font-semibold">
            <p>User: ${info.author}</p>
            <p>Label: ${info.label}</p>
            <p>Priority: ${info.priority}</p>
            <p>Created: ${info.createdAt}</p>
        </div>
    `;
  document.getElementById("details_modal").showModal();
}

function showLoader(status) {
  const loader = document.getElementById("spinner");
  status ? loader.classList.remove("hidden") : loader.classList.add("hidden");
}
