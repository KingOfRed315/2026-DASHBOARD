// CHUYỂN TAB CHÍNH
function switchTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.currentTarget.classList.add('active');
}

// CHUYỂN BẤM GIỜ / HẸN GIỜ
function showFocus(type) {
    document.querySelectorAll('.focus-area').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.sub-item').forEach(b => b.classList.remove('active'));
    document.getElementById(type + '-box').classList.add('active');
    event.currentTarget.classList.add('active');
}

// LOGIC KHO TÀI LIỆU
function addLink(sub) {
    const n = document.getElementById(`name-${sub}`);
    const l = document.getElementById(`link-${sub}`);
    if(!n.value || !l.value) return;

    let list = JSON.parse(localStorage.getItem(`docs_${sub}`)) || [];
    list.push({ name: n.value, url: l.value });
    localStorage.setItem(`docs_${sub}`, JSON.stringify(list));
    
    n.value = ''; l.value = '';
    render(sub);
}

function render(sub) {
    const box = document.getElementById(`list-${sub}`);
    let list = JSON.parse(localStorage.getItem(`docs_${sub}`)) || [];
    box.innerHTML = list.map((item, idx) => `
        <div class="link-item">
            <a href="${item.url}" target="_blank">🔗 ${item.name}</a>
            <span onclick="delLink('${sub}', ${idx})" style="color:#e74c3c; cursor:pointer; font-weight:bold">X</span>
        </div>
    `).join('');
}

function delLink(sub, idx) {
    let list = JSON.parse(localStorage.getItem(`docs_${sub}`));
    list.splice(idx, 1);
    localStorage.setItem(`docs_${sub}`, JSON.stringify(list));
    render(sub);
}

// ĐỒNG HỒ HỆ THỐNG & COUNTDOWN
function updateTime() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString('vi-VN');
    
    const cd = (id, target) => {
        const diff = new Date(target) - now;
        if (diff < 0) return;
        const d = Math.floor(diff / 864e5), 
              h = Math.floor((diff % 864e5) / 36e5),
              m = Math.floor((diff % 36e5) / 6e4),
              s = Math.floor((diff % 6e4) / 1e3);
        document.getElementById(id).innerText = `${d}D : ${h.toString().padStart(2,'0')}H : ${m.toString().padStart(2,'0')}M : ${s.toString().padStart(2,'0')}S`;
    };
    cd('cd-act', '2026-05-24T07:30:00');
    cd('cd-thpt', '2026-06-11T07:30:00');
}

// TỰ ĐỘNG CHẠY KHI MỞ TRANG
window.onload = () => {
    ['toan', 'van', 'anh', 'tin'].forEach(s => render(s));
    setInterval(updateTime, 1000);
};

// --- PHẦN LOGIC BẤM GIỜ & HẸN GIỜ (ĐÃ FIX LỖI) ---
let swInt, swTime = 0, swRun = false;
function toggleSW() {
    const btn = document.getElementById('sw-btn');
    if (!swRun) {
        swInt = setInterval(() => {
            swTime += 10;
            let m = Math.floor(swTime / 60000), s = Math.floor((swTime % 60000) / 1000), ms = Math.floor((swTime % 1000) / 10);
            document.getElementById('sw-m').innerText = m.toString().padStart(2,'0');
            document.getElementById('sw-s').innerText = s.toString().padStart(2,'0');
            document.getElementById('sw-ms').innerText = '.' + ms.toString().padStart(2,'0');
        }, 10);
        btn.innerText = "DỪNG"; swRun = true;
    } else {
        clearInterval(swInt); btn.innerText = "TIẾP TỤC"; swRun = false;
    }
}
function resetSW() {
    clearInterval(swInt); swTime = 0; swRun = false;
    document.getElementById('sw-m').innerText = '00'; document.getElementById('sw-s').innerText = '00'; document.getElementById('sw-ms').innerText = '.00';
    document.getElementById('sw-btn').innerText = "BẮT ĐẦU";
}

let tmInt, tmTime = 0, tmRun = false;
function toggleTM() {
    const btn = document.getElementById('tm-btn');
    if (!tmRun) {
        if (tmTime === 0) {
            const h = parseInt(document.getElementById('in-h').value) || 0;
            const m = parseInt(document.getElementById('in-m').value) || 0;
            const s = parseInt(document.getElementById('in-s').value) || 0;
            tmTime = h * 3600 + m * 60 + s;
        }
        if (tmTime <= 0) return alert("Nhập thời gian!");
        tmInt = setInterval(() => {
            tmTime--;
            let h = Math.floor(tmTime / 3600), m = Math.floor((tmTime % 3600) / 60), s = tmTime % 60;
            document.getElementById('tm-h').innerText = h.toString().padStart(2,'0');
            document.getElementById('tm-m').innerText = m.toString().padStart(2,'0');
            document.getElementById('tm-s').innerText = s.toString().padStart(2,'0');
            if (tmTime <= 0) { clearInterval(tmInt); alert("Hết giờ!"); resetTM(); }
        }, 1000);
        btn.innerText = "TẠM DỪNG"; tmRun = true;
    } else {
        clearInterval(tmInt); btn.innerText = "TIẾP TỤC"; tmRun = false;
    }
}
function resetTM() {
    clearInterval(tmInt); tmTime = 0; tmRun = false;
    document.getElementById('tm-h').innerText = '00'; document.getElementById('tm-m').innerText = '00'; document.getElementById('tm-s').innerText = '00';
    document.getElementById('tm-btn').innerText = "KÍCH HOẠT";
}