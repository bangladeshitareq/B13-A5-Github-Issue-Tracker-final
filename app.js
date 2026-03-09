/**
 * GitHub Issue Tracker - Main Script
 * Handles authentication, fetching issues, and dynamic UI rendering
 */

let masterData = [];

/**
 * Handle user login with basic credentials check
 */
function startLogin() {
  const user = document.getElementById("input-user").value;
  const pass = document.getElementById("input-pass").value;

  // Validate credentials based on demo requirements
  if (user === "admin" && pass === "admin123") {
    alert("Login Success"); // Requirement: Success feedback
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("main-dashboard").classList.remove("hidden");
    fetchIssues();
  } else {
    alert("Invalid Username or Password!");
  }
}

/**
 * Fetch all issues from the API
 */
async function fetchIssues() {
  try {
    const res = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    const data = await res.json();
    masterData = data.data;
    renderData(masterData);
  } catch (error) {
    console.error("Error fetching issues:", error);
  }
}

/**
 * Render issue cards dynamically to the dashboard
 * @param {Array} list - Array of issue objects
 */
function renderData(list) {
  const container = document.getElementById("cards-list");
  container.innerHTML = "";

  // Update statistics counters
  document.getElementById("issue-total").innerText = `${list.length} Issues`;
  document.getElementById("open-count").innerText = masterData.filter(
    (i) => i.status === "open",
  ).length;
  document.getElementById("closed-stat").innerText = masterData.filter(
    (i) => i.status === "closed",
  ).length;

  list.forEach((item) => {
    const isOpen = item.status === "open";
    const statusColor = isOpen ? "border-t-[#2DA44E]" : "border-t-[#8250DF]";

    // Generate highlighted labels HTML (Challenge Part)
    let labelHTML = "";
    if (item.label && item.label !== "undefined") {
      const labels = item.label.split(",");
      labelHTML = labels
        .map(
          (l) => `
                <span class="px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold uppercase">
                    ${l.trim()}
                </span>
            `,
        )
        .join("");
    } else {
      labelHTML = `<span class="px-2.5 py-1 rounded-full bg-gray-50 text-gray-400 border border-gray-200 text-[10px] font-bold uppercase">No Label</span>`;
    }

    const card = document.createElement("div");
    card.className = `issue-card bg-white border-t-4 ${statusColor} rounded-xl p-5 shadow-sm`;
    card.onclick = () => getSingleIssue(item.id);

    card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                    ${
                      isOpen
                        ? '<svg viewBox="0 0 16 16" width="16" height="16" class="fill-current text-[#2DA44E]"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path></svg>'
                        : '<svg viewBox="0 0 16 16" width="16" height="16" class="fill-current text-[#8250DF]"><path d="M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5Z"></path><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path></svg>'
                    }
                    <span>#${item.id}</span>
                </div>
                <span class="bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-red-100">${item.priority || "High"}</span>
            </div>
            <h2 class="font-bold text-sm text-gray-900 mb-1 line-clamp-1">${item.title}</h2>
            <p class="text-[11px] text-gray-500 mb-4 line-clamp-2">${item.description}</p>

            <div class="flex flex-wrap gap-2 mb-6">${labelHTML}</div>

            <div class="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-[10px]">
                <div class="flex items-center gap-2">
                    <span class="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold border border-gray-200 uppercase">${item.author[0]}</span>
                    <span class="font-bold text-gray-600">${item.author}</span>
                </div>
                <span class="text-gray-400 font-medium italic">Updated: ${item.updatedAt ? item.updatedAt.split("T")[0] : "2024-01-15"}</span>
            </div>
        `;
    container.appendChild(card);
  });
}

/**
 * Filter issues based on tab selection (All, Open, Closed)
 */
function changeTab(type, btn) {
  // Reset button styles
  document.querySelectorAll("#tab-group button").forEach((b) => {
    b.classList.remove("bg-[#4433ff]", "text-white", "border-none");
    b.classList.add("bg-white", "text-gray-700", "border-gray-300");
  });

  // Apply active styles
  btn.classList.add("bg-[#4433ff]", "text-white", "border-none");
  btn.classList.remove("bg-white", "text-gray-700", "border-gray-300");

  // Filter data
  if (type === "all") renderData(masterData);
  else renderData(masterData.filter((x) => x.status === type));
}

/**
 * Handle keyword search
 */
async function handleSearch() {
  const query = document.getElementById("search-box").value;
  if (!query) return;

  try {
    const res = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`,
    );
    const data = await res.json();
    renderData(data.data);
  } catch (error) {
    console.error("Search failed:", error);
  }
}

/**
 * Fetch and display details for a single issue in a modal
 */
async function getSingleIssue(id) {
  try {
    const res = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
    );
    const result = await res.json();
    const issue = result.data;

    document.getElementById("modal-body-content").innerHTML = `
            <div class="p-2">
                <h3 class="font-bold text-xl mb-4 text-gray-800">#${issue.id} - ${issue.title}</h3>
                <p class="text-gray-600 text-sm mb-6 leading-relaxed">${issue.description}</p>
                <div class="bg-gray-50 p-5 rounded-xl grid grid-cols-2 gap-4 text-[11px] font-bold border border-gray-100">
                    <p class="text-gray-500 uppercase">Author: <span class="text-blue-600">${issue.author}</span></p>
                    <p class="text-gray-500 uppercase">Status: <span class="text-gray-900">${issue.status}</span></p>
                    <p class="text-gray-500 uppercase">Label: <span class="text-red-500">${issue.label || "N/A"}</span></p>
                    <p class="text-gray-500 uppercase">Priority: <span class="text-red-500">${issue.priority || "High"}</span></p>
                </div>
            </div>
        `;
    document.getElementById("details_modal").showModal();
  } catch (error) {
    console.error("Error loading issue details:", error);
  }
}
