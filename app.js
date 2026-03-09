let masterData = [];

// Login
function startLogin() {
  const userValue = document.getElementById("input-user").value;
  const passValue = document.getElementById("input-pass").value;

  if (userValue === "admin" && passValue === "admin123") {
    alert("loging successfull");
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("main-dashboard").classList.remove("hidden");
    fetchIssues();
  } else {
    alert("Login failed!");
  }
}

// Fetch all
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
    console.log("Fetch error", err);
  }
  showLoader(false);
}

// Render Complex Cards (Matching Screenshot)
function renderData(dataList) {
  const container = document.getElementById("cards-list");
  container.innerHTML = "";

  // Stats
  document.getElementById("issue-total").innerText =
    `${dataList.length} Issues`;
  document.getElementById("open-count").innerText = masterData.filter(
    (i) => i.status === "open",
  ).length;
  document.getElementById("closed-stat").innerText = masterData.filter(
    (i) => i.status === "closed",
  ).length;

  dataList.forEach((item) => {
    const isCurrentlyOpen = item.status === "open";
    // Green for Open, Purple for Closed
    const themeColor = isCurrentlyOpen ? "[#2DA44E]" : "[#8250DF]";

    const div = document.createElement("div");
    // Card style matching screenshot
    div.className = `bg-white border border-gray-200 border-t-4 border-t-${themeColor} rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full space-y-3`;

    div.onclick = () => getSingleIssue(item.id);

    // Date formatting (handling API format)
    let formattedDate = "Unknown Date";
    if (item.updatedAt) {
      formattedDate = item.updatedAt.split("T")[0]; // Simple YYYY-MM-DD
    } else if (item.createdAt) {
      formattedDate = item.createdAt.split("T")[0];
    }

    // --- Screenshot Elements Handling ---

    // 1. Top Row: Status Icon, Issue ID, and Priority Tag
    const topRow = `
            <div class="flex justify-between items-center text-xs">
                <div class="flex items-center gap-2 font-medium text-gray-600">
                    ${
                      isCurrentlyOpen
                        ? `<svg viewBox="0 0 16 16" width="16" height="16" class="fill-current text-[#2DA44E]"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path></svg>`
                        : `<svg viewBox="0 0 16 16" width="16" height="16" class="fill-current text-[#8250DF]"><path d="M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5Z"></path><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path></svg>`
                    }
                    <span>#${item.id || "00"}</span>
                </div>
                <span class="px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-bold text-[10px] uppercase tracking-wider">${item.priority || "low"}</span>
            </div>
        `;

    // 2. Title and Description
    const textContent = `
            <div>
                <h2 class="font-bold text-base mb-1.5 text-gray-950 line-clamp-2 hover:text-blue-600">${item.title}</h2>
                <p class="text-xs text-gray-600 line-clamp-3 mb-3">${item.description}</p>
            </div>
        `;

    // 3. Dynamic Labels (Matching screenshot red boxes)
    // Handling API label string "bug, enhancement" -> separate tags
    let labelTags = `<span class="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium border border-gray-200 uppercase">No Labels</span>`;
    if (item.label && item.label !== "undefined") {
      const labelsArray = item.label.split(",").map((l) => l.trim());
      labelTags = labelsArray
        .map(
          (l) => `
                <span class="px-3 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-semibold border border-red-100 uppercase tracking-tight">${l}</span>
            `,
        )
        .join("");
    }

    const labelsRow = `<div class="flex flex-wrap gap-1.5 pt-1">${labelTags}</div>`;

    // 4. Bottom Row: Author and Updated Date
    const footerRow = `
            <div class="flex justify-between items-center pt-4 mt-auto border-t border-gray-100 text-[11px] text-gray-500 font-medium">
                <div class="flex items-center gap-2">
                    <span class="w-6 h-6 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center font-bold uppercase border border-gray-200">${item.author ? item.author[0] : "?"}</span>
                    <span>${item.author || "unknown"}</span>
                </div>
                <span>Updated: ${formattedDate}</span>
            </div>
        `;

    // Assemble Card
    div.innerHTML = topRow + textContent + labelsRow + footerRow;
    container.appendChild(div);
  });
}

// Filter
function changeTab(type, element) {
  const tabs = document.querySelectorAll("#tab-group button");
  tabs.forEach((t) => {
    t.classList.remove("bg-[#4433ff]", "text-white");
    t.classList.add(
      "btn-ghost",
      "bg-white",
      "text-gray-700",
      "border",
      "border-gray-300",
    );
  });
  element.classList.add("bg-[#4433ff]", "text-white");
  element.classList.remove(
    "btn-ghost",
    "bg-white",
    "text-gray-700",
    "border",
    "border-gray-300",
  );

  if (type === "all") renderData(masterData);
  else renderData(masterData.filter((x) => x.status === type));
}

// Search
async function handleSearch() {
  const text = document.getElementById("search-box").value;
  if (!text) return;
  showLoader(true);
  try {
    const res = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`,
    );
    const result = await res.json();
    renderData(result.data);
  } catch (e) {
    console.log(e);
  }
  showLoader(false);
}

// Modal Single
async function getSingleIssue(id) {
  try {
    const res = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
    );
    const result = await res.json();
    const d = result.data;

    const modalContent = document.getElementById("modal-body-content");
    modalContent.innerHTML = `
            <div class="flex items-center gap-2 mb-3 text-sm text-gray-500">
                <span class="font-bold text-gray-900">Issue #${d.id}</span> |
                <span class="px-2 py-0.5 rounded bg-gray-100 text-xs font-mono">${d.label}</span>
            </div>
            <h3 class="font-bold text-2xl mb-5 text-gray-950">${d.title}</h3>
            <p class="text-gray-700 mb-6 leading-relaxed">${d.description}</p>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <p><strong>Author:</strong> ${d.author}</p>
                <p><strong>Status:</strong> <span class="uppercase font-bold ${d.status === "open" ? "text-green-600" : "text-purple-600"}">${d.status}</span></p>
                <p><strong>Priority:</strong> ${d.priority}</p>
                <p><strong>Created:</strong> ${d.createdAt ? d.createdAt.split("T")[0] : "N/A"}</p>
            </div>
        `;
    document.getElementById("details_modal").showModal();
  } catch (err) {
    console.log(err);
  }
}

function showLoader(status) {
  const loader = document.getElementById("spinner");
  status ? loader.classList.remove("hidden") : loader.classList.add("hidden");
}
