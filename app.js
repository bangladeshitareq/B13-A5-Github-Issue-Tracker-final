let masterData = [];

// Login with Custom Modal logic
function startLogin() {
  const userValue = document.getElementById("input-user").value;
  const passValue = document.getElementById("input-pass").value;

  if (userValue === "admin" && passValue === "admin123") {
    // Show success modal instead of native alert
    document.getElementById("success_modal").showModal();
  } else {
    alert("Invalid credentials. Try admin / admin123");
  }
}

// Handle Modal Continue button
function closeSuccessModal() {
  document.getElementById("success_modal").close();
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("main-dashboard").classList.remove("hidden");
  fetchIssues();
}

// Get issues from API
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
    console.error("API Error:", err);
  }
  showLoader(false);
}

// Display Issues on UI with Highlighted Labels
function renderData(dataList) {
  const container = document.getElementById("cards-list");
  container.innerHTML = "";

  // Stats Bar Update
  document.getElementById("issue-total").innerText =
    `${dataList.length} Issues Found`;
  document.getElementById("open-count").innerText = masterData.filter(
    (i) => i.status === "open",
  ).length;
  document.getElementById("closed-count").innerText = masterData.filter(
    (i) => i.status === "closed",
  ).length;

  dataList.forEach((item) => {
    const isOpen = item.status === "open";
    const topBorder = isOpen ? "border-t-green-500" : "border-t-purple-600";

    const card = document.createElement("div");
    card.className = `bg-white border-t-4 ${topBorder} rounded-lg p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col h-full border border-gray-100`;

    card.onclick = () => getSingleIssue(item.id);

    card.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-blue-200">
                    ${item.label}
                </span>
                <span class="${isOpen ? "text-green-600" : "text-purple-600"} text-[10px] font-bold uppercase flex items-center gap-1">
                    ${isOpen ? "🟢 OPEN" : "🟣 CLOSED"}
                </span>
            </div>
            <h2 class="font-extrabold text-sm mb-2 text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">${item.title}</h2>
            <p class="text-xs text-gray-500 mb-6 flex-grow line-clamp-3 leading-relaxed">${item.description}</p>
            <div class="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-black uppercase">${item.author[0]}</div>
                    <span class="text-[11px] font-bold text-gray-700">${item.author}</span>
                </div>
                <div class="flex flex-col items-end">
                   <span class="text-[9px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold uppercase tracking-tighter">${item.priority}</span>
                   <span class="text-[8px] text-gray-300 mt-1">${item.createdAt.split("T")[0]}</span>
                </div>
            </div>
        `;
    container.appendChild(card);
  });
}

// Tab Change logic
function changeTab(type, btn) {
  const btns = document.querySelectorAll("#tab-group button");
  btns.forEach((b) => {
    b.classList.remove("bg-gray-200", "font-bold", "border-gray-300");
    b.classList.add("btn-ghost", "text-gray-500", "border-none");
  });
  btn.classList.add("bg-gray-200", "font-bold", "border-gray-300");
  btn.classList.remove("btn-ghost", "text-gray-500", "border-none");

  if (type === "all") renderData(masterData);
  else renderData(masterData.filter((i) => i.status === type));
}

// Search Logic
async function handleSearch() {
  const query = document.getElementById("search-box").value;
  if (!query) return;

  showLoader(true);
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`,
  );
  const data = await res.json();
  renderData(data.data);
  showLoader(false);
}

// Single Issue Details (Modal)
async function getSingleIssue(id) {
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
  );
  const result = await res.json();
  const issue = result.data;

  const modalContent = document.getElementById("modal-body-content");
  modalContent.innerHTML = `
        <div class="flex items-center gap-2 mb-2">
            <span class="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">${issue.label}</span>
            <span class="text-xs text-gray-400 font-bold">#${issue.id}</span>
        </div>
        <h3 class="font-black text-2xl text-gray-800 mb-4">${issue.title}</h3>
        <p class="text-gray-600 leading-relaxed text-sm p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300 mb-6 italic">"${issue.description}"</p>
        <div class="grid grid-cols-2 gap-y-4 gap-x-8 text-xs bg-white p-4 rounded-xl border border-gray-100">
            <div><p class="text-gray-400 font-bold mb-1 uppercase">Reported By</p><p class="text-gray-800 font-black text-sm">${issue.author}</p></div>
            <div><p class="text-gray-400 font-bold mb-1 uppercase">Priority Level</p><p class="text-orange-500 font-black text-sm uppercase">${issue.priority}</p></div>
            <div><p class="text-gray-400 font-bold mb-1 uppercase">Status</p><p class="font-black text-sm uppercase">${issue.status}</p></div>
            <div><p class="text-gray-400 font-bold mb-1 uppercase">Created On</p><p class="text-gray-800 font-black text-sm">${new Date(issue.createdAt).toLocaleDateString()}</p></div>
        </div>
    `;
  document.getElementById("details_modal").showModal();
}

function showLoader(is) {
  const s = document.getElementById("spinner");
  is ? s.classList.remove("hidden") : s.classList.add("hidden");
}
