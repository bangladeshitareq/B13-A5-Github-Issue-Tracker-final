let masterData = [];

function startLogin() {
  const userValue = document.getElementById("input-user").value;
  const passValue = document.getElementById("input-pass").value;
  if (userValue === "admin" && passValue === "admin123") {
    alert("Login Successful");
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("main-dashboard").classList.remove("hidden");
    fetchIssues();
  } else {
    alert("Invalid Credentials");
  }
}

async function fetchIssues() {
  try {
    const response = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    const result = await response.json();
    masterData = result.data;
    renderData(masterData);
  } catch (err) {
    console.log(err);
  }
}

function renderData(dataList) {
  const container = document.getElementById("cards-list");
  container.innerHTML = "";

  document.getElementById("issue-total").innerText =
    `${dataList.length} Issues`;
  document.getElementById("open-count").innerText = masterData.filter(
    (i) => i.status === "open",
  ).length;
  document.getElementById("closed-stat").innerText = masterData.filter(
    (i) => i.status === "closed",
  ).length;

  dataList.forEach((item) => {
    const isOpen = item.status === "open";
    const color = isOpen ? "[#2DA44E]" : "[#8250DF]";

    // Label logic for "Challenge" part (Matching screenshot boxes)
    let labelHTML = "";
    if (item.label && item.label !== "undefined") {
      const labels = item.label.split(",");
      labelHTML = labels
        .map(
          (l) => `
                <span class="px-3 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200 text-[10px] font-bold uppercase">
                    ${l.trim()}
                </span>
            `,
        )
        .join("");
    } else {
      labelHTML = `<span class="px-3 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200 text-[10px] font-bold uppercase">No Labels</span>`;
    }

    const div = document.createElement("div");
    div.className = `github-card bg-white border-t-4 border-t-${color} rounded-xl p-5 flex flex-col h-full cursor-pointer`;
    div.onclick = () => getSingleIssue(item.id);

    div.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-2 text-xs text-gray-400 font-bold">
                    ${
                      isOpen
                        ? `<svg viewBox="0 0 16 16" width="16" height="16" class="fill-current text-[#2DA44E]"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path></svg>`
                        : `<svg viewBox="0 0 16 16" width="16" height="16" class="fill-current text-[#8250DF]"><path d="M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.5Z"></path><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path></svg>`
                    }
                    <span>#${item.id}</span>
                </div>
                <span class="bg-red-50 text-red-600 px-2 py-0.5 rounded-md text-[9px] font-bold border border-red-100 uppercase">${item.priority || "high"}</span>
            </div>
            <h2 class="font-bold text-sm text-gray-900 mb-1 line-clamp-1">${item.title}</h2>
            <p class="text-[11px] text-gray-500 mb-4 line-clamp-2">${item.description}</p>

            <div class="flex flex-wrap gap-2 mb-4">${labelHTML}</div>

            <div class="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-[10px]">
                <div class="flex items-center gap-2">
                    <span class="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 border border-gray-200 uppercase">${item.author[0]}</span>
                    <span class="font-bold text-gray-600">${item.author}</span>
                </div>
                <span class="text-gray-400">Updated: ${item.updatedAt ? item.updatedAt.split("T")[0] : "2024-01-15"}</span>
            </div>
        `;
    container.appendChild(div);
  });
}

function changeTab(type, el) {
  document.querySelectorAll("#tab-group button").forEach((b) => {
    b.classList.remove("bg-[#4433ff]", "text-white");
    b.classList.add("bg-white", "text-gray-700", "border-gray-300");
  });
  el.classList.add("bg-[#4433ff]", "text-white");
  el.classList.remove("bg-white", "text-gray-700", "border-gray-300");
  if (type === "all") renderData(masterData);
  else renderData(masterData.filter((x) => x.status === type));
}

async function handleSearch() {
  const text = document.getElementById("search-box").value;
  if (!text) return;
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`,
  );
  const result = await res.json();
  renderData(result.data);
}

async function getSingleIssue(id) {
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
  );
  const result = await res.json();
  const d = result.data;
  document.getElementById("modal-body-content").innerHTML = `
        <h3 class="font-bold text-xl mb-4">#${d.id} - ${d.title}</h3>
        <p class="text-gray-600 text-sm mb-6">${d.description}</p>
        <div class="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4 text-xs">
            <p><strong>Author:</strong> ${d.author}</p>
            <p><strong>Status:</strong> ${d.status}</p>
            <p><strong>Label:</strong> ${d.label}</p>
            <p><strong>Priority:</strong> ${d.priority}</p>
        </div>
    `;
  document.getElementById("details_modal").showModal();
}
