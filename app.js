let masterData = [];

// Login with Custom Modal logic
function startLogin() {
    const userValue = document.getElementById('input-user').value;
    const passValue = document.getElementById('input-pass').value;

    if (userValue === 'admin' && passValue === 'admin123') {
        document.getElementById('success_modal').showModal();
    } else {
        alert("Invalid credentials. Try admin / admin123");
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
        const response = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const result = await response.json();
        masterData = result.data;
        renderData(masterData);
    } catch (err) {
        console.error("API Error:", err);
    }
    showLoader(false);
}

// Updated Render Function to fix "NO LABEL" issue
function renderData(dataList) {
    const container = document.getElementById('cards-list');
    container.innerHTML = "";

    document.getElementById('issue-total').innerText = `${dataList.length} Issues Found`;
    document.getElementById('open-count').innerText = masterData.filter(i => i.status === 'open').length;
    document.getElementById('closed-count').innerText = masterData.filter(i => i.status === 'closed').length;

    dataList.forEach(item => {
        const isOpen = item.status === 'open';
        const topBorder = isOpen ? 'border-t-green-500' : 'border-t-purple-600';
        
        // লেবেল চেক করার লজিক: যদি লেবেল না থাকে তবে "General" দেখাবে
        const displayLabel = (item.label && item.label.trim() !== "") ? item.label : "General";
        const labelClass = (item.label && item.label.trim() !== "") 
                           ? "bg-blue-100 text-blue-700 border-blue-200" 
                           : "bg-gray-100 text-gray-500 border-gray-200";

        const card = document.createElement('div');
        card.className = `bg-white border-t-4 ${topBorder} rounded-lg p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col h-full border border-gray-100`;
        
        card.onclick = () => getSingleIssue(item.id);

        card.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <span class="${labelClass} px-3 py-1 rounded-full text-[10px] font-black uppercase border">
                    ${displayLabel}
                </span>
                <span class="${isOpen ? 'text-green-600' : 'text-purple-600'} text-[10px] font-bold uppercase flex items-center gap-1">
                    ${isOpen ? '🟢 OPEN' : '🟣 CLOSED'}
                </span>
            </div>
            <h2 class="font-extrabold text-sm mb-2 text-gray-800 line-clamp-2">${item.title}</h2>
            <p class="text-xs text-gray-500 mb-6 flex-grow line-clamp-3 leading-relaxed">${item.description}</p>
            <div class="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-[10px] font-black uppercase">${item.author[0]}</div>
                    <span class="text-[11px] font-bold text-gray-700">${item.author}</span>
                </div>
                <div class="flex flex-col items-end">
                   <span class="text-[9px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold uppercase tracking-tighter">${item.priority}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// ... বাকি ফাংশনগুলো (changeTab, handleSearch, getSingleIssue) আগের মতোই থাকবে।
