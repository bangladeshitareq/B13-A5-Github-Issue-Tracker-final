let masterData = [];

// Login Success Logic
function startLogin() {
    const user = document.getElementById('input-user').value;
    const pass = document.getElementById('input-pass').value;

    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('success_modal').showModal();
    } else {
        alert("Invalid Username or Password");
    }
}

function closeSuccessModal() {
    document.getElementById('success_modal').close();
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');
    fetchIssues();
}

async function fetchIssues() {
    showLoader(true);
    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await res.json();
        masterData = data.data;
        renderData(masterData);
    } catch (e) { console.error(e); }
    showLoader(false);
}

function renderData(dataList) {
    const container = document.getElementById('cards-list');
    container.innerHTML = "";

    document.getElementById('issue-total').innerText = `${dataList.length} Issues Found`;
    document.getElementById('open-count').innerText = masterData.filter(i => i.status === 'open').length;
    document.getElementById('closed-count').innerText = masterData.filter(i => i.status === 'closed').length;

    dataList.forEach(item => {
        const isOpen = item.status === 'open';
        const topBorder = isOpen ? 'border-t-green-500' : 'border-t-purple-600';
        
        // Label logic for safe UI
        const labelText = (item.label && item.label.trim() !== "") ? item.label : "General Issue";
        const labelStyle = (item.label && item.label.trim() !== "") ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500";

        const card = document.createElement('div');
        card.className = `bg-white border-t-4 ${topBorder} rounded-lg p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col h-full border border-gray-100`;
        card.onclick = () => getSingleIssue(item.id);

        card.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <span class="${labelStyle} px-3 py-1 rounded-full text-[10px] font-black uppercase border">
                    ${labelText}
                </span>
                <span class="${isOpen ? 'text-green-600' : 'text-purple-600'} text-[10px] font-bold uppercase">
                    ${isOpen ? '🟢 Open' : '🟣 Closed'}
                </span>
            </div>
            <h2 class="font-bold text-sm mb-2 text-gray-800 line-clamp-2">${item.title}</h2>
            <p class="text-xs text-gray-500 mb-6 flex-grow line-clamp-3">${item.description}</p>
            <div class="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold uppercase">${item.author[0]}</div>
                    <span class="text-[11px] font-bold text-gray-700">${item.author}</span>
                </div>
                <span class="text-[9px] bg-gray-100 px-2 py-0.5 rounded text-gray-400 font-bold uppercase">${item.priority}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function changeTab(type, btn) {
    const btns = document.querySelectorAll('#tab-group button');
    btns.forEach(b => { 
        b.classList.remove('bg-gray-200', 'font-bold', 'border-gray-300');
        b.classList.add('btn-ghost', 'text-gray-500', 'border-none');
    });
    btn.classList.add('bg-gray-200', 'font-bold', 'border-gray-300');
    btn.classList.remove('btn-ghost', 'text-gray-500', 'border-none');

    if (type === 'all') renderData(masterData);
    else renderData(masterData.filter(i => i.status === type));
}

async function handleSearch() {
    const q = document.getElementById('search-box').value;
    if (!q) return;
    showLoader(true);
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${q}`);
    const data = await res.json();
    renderData(data.data);
    showLoader(false);
}

async function getSingleIssue(id) {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const data = await res.json();
    const issue = data.data;

    const modalBody = document.getElementById('modal-body-content');
    modalBody.innerHTML = `
        <div class="mb-4"><span class="bg-blue-600 text-white text-[10px] px-2 py-1 rounded font-bold uppercase">${issue.label || 'N/A'}</span></div>
        <h3 class="font-black text-2xl text-gray-800 mb-4">${issue.title}</h3>
        <p class="text-gray-600 text-sm mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-200 italic">"${issue.description}"</p>
        <div class="grid grid-cols-2 gap-4 text-xs font-bold uppercase text-gray-400">
            <div><p>Reporter</p><p class="text-gray-800 text-sm">${issue.author}</p></div>
            <div><p>Priority</p><p class="text-orange-500 text-sm">${issue.priority}</p></div>
        </div>
    `;
    document.getElementById('details_modal').showModal();
}

function showLoader(is) {
    const s = document.getElementById('spinner');
    is ? s.classList.remove('hidden') : s.classList.add('hidden');
}
