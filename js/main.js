// Toast helper global: memakai elemen #toast yang sudah tersedia di index.html.
window.showToast = window.showToast || function(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMsg');
    if (!toast) {
        console.info('[SayutiHub]', message);
        return;
    }
    if (msg) msg.textContent = String(message || '');
    toast.classList.add('show');
    if (window._sayutiToastTimer) window.clearTimeout(window._sayutiToastTimer);
    window._sayutiToastTimer = window.setTimeout(function() {
        toast.classList.remove('show');
    }, 2600);
};
function showToast(message) {
    return window.showToast(message);
}

let dbApps = [
    {
        "id": 1,
        "title": "Toko Sembako",
        "category": "android",
        "status": "Featured",
        "icon": "fa-store",
        "shortDesc": "Manajemen penjualan, inventaris barang, dan laporan keuangan toko sembako otomatis.",
        "fullDesc": "Sistem POS (Point of Sale) lengkap khusus untuk toko sembako dan kelontong. Dilengkapi pencatatan stok otomatis.",
        "version": "v7.0",
        "format": "APK File",
        "downloads": 4121,
        "downloadUrl": "tokoSembako v7.0.apk",
        "changelog": "Peningkatan stabilitas aplikasi.",
        "screenshots": [],
        "reviews": [
            {
                "name": "Budi Santoso",
                "rating": 5,
                "comment": "Sangat membantu kasir!"
            }
        ]
    },
    {
        "id": 2,
        "title": "Sayuti AutoClicker",
        "category": "windows",
        "status": "Trending",
        "icon": "fa-laptop-code",
        "shortDesc": "Software otomatisasi klik mouse untuk komputer Windows dengan preset mudah.",
        "fullDesc": "Software utilitas Windows untuk melakukan klik otomatis berkecepatan tinggi.",
        "version": "v1.2.0",
        "format": "8 MB EXE",
        "downloads": 1850,
        "downloadUrl": "#",
        "changelog": "Dukungan Multi-Point Clicking.",
        "screenshots": [],
        "reviews": [
            {
                "name": "Rian Gamer",
                "rating": 5,
                "comment": "Lancar jaya!"
            }
        ]
    },
    {
        "title": "KlikWaCepat",
        "category": "android",
        "status": "Featured",
        "icon": "logo_1787495641002_1000262996.jpg",
        "shortDesc": "Kirim pesan WhatsApp tanpa perlu menyimpan nomor ke kontak.",
        "fullDesc": "Aplikasi praktis dan ringan untuk memulai percakapan WhatsApp ke nomor baru secara instan tanpa harus menyimpannya terlebih dahulu ke daftar kontak HP Anda. Cukup masukkan nomor tujuan dan langsung chat dengan cepat!\n",
        "version": "V2.1",
        "format": "APK File",
        "downloadUrl": "KlikWaCepat v2.1.apk",
        "changelog": "Rilis perdana aplikasi Klik untuk Chat versi 2.1.0.",
        "id": 1787488454945,
        "downloads": 241,
        "reviews": [],
        "screenshots": []
    },
    {
        "title": "NETmeter",
        "category": "android",
        "status": "New",
        "icon": "logo_1789563104872_1000267274.jpg",
        "shortDesc": "NETmeter adalah aplikasi pemantau kecepatan internet secara real-time yang dilengkapi fitur Speed Test untuk mengukur kecepatan Download, Upload, Ping, dan kualitas koneksi internet.",
        "fullDesc": "NETmeter adalah aplikasi monitoring jaringan yang membantu Anda memantau kondisi dan kecepatan koneksi internet dengan mudah. Kecepatan internet dapat ditampilkan secara real-time sehingga Anda bisa mengetahui penggunaan jaringan secara langsung dari perangkat.\nFitur utama:\n📶 Monitor kecepatan internet secara real-time\n🚀 Speed Test untuk mengukur kecepatan Download\n📤 Mengukur kecepatan Upload\n⚡ Menampilkan Ping/Latency\n📊 Informasi koneksi jaringan\n🔔 Pemantauan kecepatan melalui notifikasi/status bar\n📱 Tampilan sederhana, modern, dan ringan\n🌐 Membantu mengetahui kondisi koneksi saat menggunakan Wi-Fi maupun data seluler\nNETmeter dirancang agar pengguna dapat mengetahui performa koneksi internet dengan cepat tanpa tampilan yang rumit.",
        "version": "V1.0.0",
        "format": "APK File",
        "downloadUrl": "NETmeter.apk",
        "changelog": "Rilis perdana NETmeter dengan fitur monitoring kecepatan internet real-time, Speed Test Download & Upload, Ping/Latency, serta indikator kecepatan pada notifikasi. Dilengkapi tampilan modern dan ringan.",
        "id": 1789563107175,
        "downloads": 3,
        "reviews": [],
        "screenshots": []
    },
    {
        "id": 1790000000001,
        "title": "Nonton",
        "category": "android",
        "status": "New",
        "icon": "fa-film",
        "shortDesc": "Nikmati hiburan streaming film dan serial dalam satu aplikasi dengan tampilan praktis dan pemutar video terintegrasi.",
        "fullDesc": "Nonton adalah aplikasi hiburan streaming yang memudahkan Anda menjelajahi dan menikmati berbagai tayangan film serta serial melalui satu tempat. Dengan tampilan sederhana dan navigasi yang praktis, Anda dapat membuka katalog tayangan dan memutar video langsung dari aplikasi.\n\nFitur utama:\n🎬 Akses halaman katalog streaming film dan serial\n▶️ Pemutaran video melalui pemutar terintegrasi\n📱 Praktis digunakan langsung dari perangkat Android\n🌐 Terhubung ke layanan streaming VidBox\n✨ Antarmuka sederhana untuk pengalaman menonton yang nyaman\n\nCatatan: Ketersediaan tayangan dan pemutaran bergantung pada layanan streaming serta koneksi internet. Nonton bukan aplikasi resmi Netflix dan tidak berafiliasi dengan Netflix.",
        "version": "v1.0.0",
        "format": "APK File",
        "downloads": 0,
        "downloadUrl": "Nonton.apk",
        "changelog": "Rilis perdana aplikasi Nonton dengan akses streaming dan pemutar video terintegrasi.",
        "screenshots": [],
        "reviews": []
    }
];

let favorites = (() => {
    try {
        const savedFavorites = JSON.parse(localStorage.getItem('sayuti_favs') || '[]');
        return Array.isArray(savedFavorites) ? savedFavorites : [];
    } catch (error) {
        console.warn('Data favorit lokal rusak; memulai daftar favorit kosong.', error);
        return [];
    }
})();
let currentCategory = 'all';
let activeAppId = null;
let selectedRating = 5;

// === Sinkronisasi jumlah unduhan ===
function getTotalDownloads() {
    return dbApps.reduce((total, app) => total + (Number(app.downloads) || 0), 0);
}

function formatNumber(value) {
    return new Intl.NumberFormat('id-ID').format(Number(value) || 0);
}

function saveDownloadCounts() {
    const counts = {};
    dbApps.forEach(app => counts[app.id] = Number(app.downloads) || 0);
    localStorage.setItem('sayuti_download_counts', JSON.stringify(counts));
}

function loadDownloadCounts() {
    try {
        const counts = JSON.parse(localStorage.getItem('sayuti_download_counts') || '{}');
        dbApps.forEach(app => {
            if (Object.prototype.hasOwnProperty.call(counts, app.id)) {
                app.downloads = Number(counts[app.id]) || 0;
            }
        });
    } catch (e) { console.warn('Gagal memuat counter unduhan', e); }
}



function restoreDownloadCounts() {
    try {
        const saved = JSON.parse(localStorage.getItem('sayuti_downloads') || '[]');
        if (!Array.isArray(saved)) return;

        saved.forEach(item => {
            const app = dbApps.find(a => a.id === item.id);
            if (app && Number.isFinite(Number(item.downloads))) {
                app.downloads = Number(item.downloads);
            }
        });
    } catch (e) {
        console.warn('Gagal memulihkan counter unduhan:', e);
    }
}

function getTotalDownloads() {
    return dbApps.reduce((total, app) => {
        return total + (Number(app.downloads) || 0);
    }, 0);
}

document.addEventListener('DOMContentLoaded', () => {
    loadDownloadCounts();
    renderApps();
    updateFavBadge();
});

let isAdminLoggedIn = false;

function switchView(viewName) {
    if (viewName === 'admin' && !isAdminLoggedIn) {
        openAdminLoginModal();
        return;
    }
    if (viewName === 'analytics' && !isAdminLoggedIn) {
        openAdminLoginModal();
        return;
    }
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    let targetView = document.getElementById(viewName + 'View');
    if (targetView) targetView.classList.add('active');
    const heroHeader = document.getElementById('mainHeader');
    if (heroHeader) heroHeader.style.display = viewName === 'home' ? '' : 'none';
    
    if(viewName === 'favorites') renderFavorites();
    if(viewName === 'analytics') renderAnalytics();
    if(viewName === 'admin') { renderAdminTable(); renderAnalytics(); }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderApps();
}

function getAppRatingStats(app) {
    if (!app.reviews || app.reviews.length === 0) return { average: 5.0, count: 0 };
    let sum = app.reviews.reduce((acc, item) => acc + item.rating, 0);
    return { average: (sum / app.reviews.length).toFixed(1), count: app.reviews.length };
}

function renderApps() {
    const grid = document.getElementById('appGrid');
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    
    if (!grid) return;

    const search = searchInput ? searchInput.value.toLowerCase() : '';
    const sort = sortSelect ? sortSelect.value : 'default';

    let filtered = dbApps.filter(app => {
        let matchesCat = true;
        if (currentCategory === 'featured') matchesCat = app.status === 'Featured';
        else if (currentCategory === 'trending') matchesCat = app.status === 'Trending';
        else if (currentCategory !== 'all') matchesCat = app.category === currentCategory;

        let matchesSearch = app.title.toLowerCase().includes(search) || app.shortDesc.toLowerCase().includes(search);
        return matchesCat && matchesSearch;
    });

    filtered.sort((a, b) => {
        let statsA = getAppRatingStats(a);
        let statsB = getAppRatingStats(b);
        if (sort === 'name-asc') return a.title.localeCompare(b.title);
        if (sort === 'rating-desc') return statsB.average - statsA.average;
        if (sort === 'downloads-desc') return b.downloads - statsA.downloads;
        return b.id - a.id;
    });

    grid.innerHTML = '';
    if (filtered.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        filtered.forEach(app => {
            let stats = getAppRatingStats(app);
            let isFav = favorites.includes(app.id);
            let statusBadge = app.status ? `<span class="badge badge-${app.status.toLowerCase()}">${app.status}</span>` : '';
            
            let iconContent = app.icon && app.icon.startsWith('fa-') 
                ? `<i class="fa-solid ${app.icon}"></i>` 
                : `<img src="${app.icon}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" alt="${app.title}">`;

            let card = document.createElement('div');
            card.className = 'app-card';
            card.onclick = () => openDetailModal(app.id);
            card.innerHTML = `
                <button class="fav-btn-card ${isFav ? 'active' : ''}" onclick="toggleFavorite(event, ${app.id})">
                    <i class="fa-solid fa-heart"></i>
                </button>
                <div>
                    <div class="app-header">
                        <div class="app-icon">${iconContent}</div>
                        <div class="app-title-group">
                            <h3>${app.title}</h3>
                            <div class="badges">
                                <span class="badge badge-cat">${app.category}</span>
                                ${statusBadge}
                            </div>
                        </div>
                    </div>
                    <p class="app-desc">${app.shortDesc}</p>
                    <div class="app-rating">
                        <i class="fa-solid fa-star"></i> <span>${stats.average} (${stats.count})</span>
                    </div>
                </div>
                <div>
                    <div class="app-meta">
                        <span><i class="fa-solid fa-download"></i> ${formatNumber(app.downloads)}</span>
                        <span><i class="fa-solid fa-code-branch"></i> ${app.version}</span>
                    </div>
                    <a href="${app.downloadUrl}" class="btn-download" onclick="triggerDownload(event, ${app.id})">
                        <i class="fa-solid fa-download"></i> Unduh ${app.format}
                    </a>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

function toggleFavorite(event, appId) {
    event.stopPropagation();
    if (favorites.includes(appId)) {
        favorites = favorites.filter(id => id !== appId);
        showToast('Dihapus dari favorit');
    } else {
        favorites.push(appId);
        showToast('Ditambahkan ke favorit!');
    }
    localStorage.setItem('sayuti_favs', JSON.stringify(favorites));
    updateFavBadge();
    renderApps();
    let favView = document.getElementById('favoritesView');
    if(favView && favView.classList.contains('active')) renderFavorites();
}

function updateFavBadge() {
    let badge = document.getElementById('favCount');
    if (badge) badge.innerText = favorites.length;
}

function renderFavorites() {
    const grid = document.getElementById('favoritesGrid');
    if (!grid) return;
    let favApps = dbApps.filter(app => favorites.includes(app.id));
    grid.innerHTML = '';
    if (favApps.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">Belum ada aplikasi favorit.</p>';
        return;
    }
    favApps.forEach(app => {
        let card = document.createElement('div');
        card.className = 'app-card';
        card.onclick = () => openDetailModal(app.id);
        card.innerHTML = `
            <h3 style="font-size:1rem; margin-bottom:4px;">${app.title}</h3>
            <p class="app-desc">${app.shortDesc}</p>
            <a href="${app.downloadUrl}" class="btn-download" onclick="triggerDownload(event, ${app.id})">Unduh</a>
        `;
        grid.appendChild(card);
    });
}

function openDetailModal(appId) {
    activeAppId = appId;
    let app = dbApps.find(a => a.id === appId);
    if (!app) return;

    let iconContent = app.icon && app.icon.startsWith('fa-') 
        ? `<i class="fa-solid ${app.icon}"></i>` 
        : `<img src="${app.icon}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" alt="${app.title}">`;

    if(document.getElementById('detailTitle')) document.getElementById('detailTitle').innerText = app.title;
    if(document.getElementById('detailDesc')) document.getElementById('detailDesc').innerText = app.fullDesc;
    if(document.getElementById('detailVersion')) document.getElementById('detailVersion').innerText = app.version;
    if(document.getElementById('detailFormat')) document.getElementById('detailFormat').innerText = app.format;
    if(document.getElementById('detailDownloads')) document.getElementById('detailDownloads').innerText = formatNumber(app.downloads);
    if(document.getElementById('detailChangelog')) document.getElementById('detailChangelog').innerText = app.changelog;
    if(document.getElementById('detailIcon')) document.getElementById('detailIcon').innerHTML = iconContent;
    if(document.getElementById('detailDownloadBtn')) {
        const btn = document.getElementById('detailDownloadBtn');
        btn.href = app.downloadUrl;
        btn.onclick = (event) => triggerDownload(event, app.id);
    }

    renderReviews(app);
    let modal = document.getElementById('detailModal');
    if(modal) modal.classList.add('active');
}

function triggerDownload(event, appId) {
    event.stopPropagation();
    let app = dbApps.find(a => a.id === appId);
    if (!app) return;
    app.downloads = (Number(app.downloads) || 0) + 1;
    saveDownloadCounts();
    renderApps();
    renderAnalytics();
    if (activeAppId === app.id) openDetailModal(app.id);

    showToast('Mengunduh ' + app.title + '...');
}

function renderReviews(app) {
    const list = document.getElementById('reviewsList');
    if (!list) return;
    list.innerHTML = '';
    if (!app.reviews || app.reviews.length === 0) {
        list.innerHTML = '<p style="font-size:0.78rem; color:var(--text-muted);">Belum ada ulasan.</p>';
        return;
    }
    app.reviews.forEach(r => {
        let stars = '<i class="fa-solid fa-star"></i>'.repeat(r.rating);
        let item = document.createElement('div');
        item.style.cssText = "background:rgba(255,255,255,0.03); padding:6px 8px; border-radius:6px; font-size:0.78rem;";
        item.innerHTML = `<strong>${r.name}</strong> <span style="color:var(--accent-amber)">${stars}</span><br><span style="color:var(--text-muted);">${r.comment}</span>`;
        list.appendChild(item);
    });
}

function setRating(r) { selectedRating = r; }

async function submitReview() {
    let nameElem = document.getElementById('reviewName');
    let commentElem = document.getElementById('reviewComment');
    let name = nameElem ? nameElem.value.trim() : '';
    let comment = commentElem ? commentElem.value.trim() : '';
    
    if (!name || !comment) { alert('Nama dan ulasan wajib diisi.'); return; }
    let app = dbApps.find(a => a.id === activeAppId);
    if (!app) return;
    if (!app.reviews) app.reviews = [];
    app.reviews.push({ name, rating: selectedRating, comment });
    
    renderReviews(app);
    renderApps();
    if(nameElem) nameElem.value = '';
    if(commentElem) commentElem.value = '';
    showToast('Ulasan terkirim!');
}

function renderAnalytics() {
    let totalDl = getTotalDownloads();
    let totalRev = dbApps.reduce((acc, curr) => acc + (curr.reviews ? curr.reviews.length : 0), 0);
    if(document.getElementById('statTotalApps')) document.getElementById('statTotalApps').innerText = dbApps.length;
    if(document.getElementById('statTotalDownloads')) document.getElementById('statTotalDownloads').innerText = formatNumber(totalDl);
    if(document.getElementById('statTotalReviews')) document.getElementById('statTotalReviews').innerText = totalRev;
}

// Helper modal global: dipakai oleh tombol tutup, overlay, dan alur login.
function closeModalDirect(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function closeModal(event, modalId) {
    if (event && event.target === event.currentTarget) {
        closeModalDirect(modalId);
    }
}

function openAdminLoginModal() { 
    let modal = document.getElementById('adminLoginModal');
    if(modal) modal.classList.add('active'); 
}

const SAYUTI_UPLOAD_API = "https://sayutihub-upload.sayut303.workers.dev";
let sayutiAdminSession = sessionStorage.getItem("sayuti_admin_session") || "";
// Simpan juga pada window agar login dan upload memakai sesi yang sama pada tab ini.
function sayutiGetAdminSession() {
 const stored = sessionStorage.getItem("sayuti_admin_session") || "";
 const shared = window.__sayutiAdminSession || stored || sayutiAdminSession || "";
 if (shared) {
  sayutiAdminSession = shared;
  window.__sayutiAdminSession = shared;
 }
 return shared;
}
function sayutiClearAdminSession() {
 sayutiAdminSession = "";
 window.__sayutiAdminSession = "";
 sessionStorage.removeItem("sayuti_admin_session");
}
async function sayutiWorkerLogin(pin) {
 const r=await fetch(SAYUTI_UPLOAD_API+"/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin})});
 const d=await r.json().catch(()=>({})); if(!r.ok||!d.ok||!d.token)throw new Error(d.error||"Login Worker gagal (HTTP "+r.status+").");
 sayutiAdminSession=d.token;window.__sayutiAdminSession=d.token;sessionStorage.setItem("sayuti_admin_session",d.token);return true;
}
async function sayutiUploadApk(file,path,onProgress) {
 const session = sayutiGetAdminSession();
 if(!session)throw new Error("Sesi admin belum aktif. Silakan login melalui panel Admin pada tab yang sama, lalu ulangi upload.");
 return await new Promise((resolve,reject)=>{const x=new XMLHttpRequest();x.open("POST",SAYUTI_UPLOAD_API+"/upload?path="+encodeURIComponent(path),true);
 x.setRequestHeader("Authorization","Bearer "+session);x.setRequestHeader("Content-Type","application/vnd.android.package-archive");
 x.upload.onprogress=e=>{if(e.lengthComputable&&onProgress)onProgress(Math.round(e.loaded/e.total*100));};
 x.onload=()=>{let d={};try{d=JSON.parse(x.responseText||"{}");}catch(e){}if(x.status>=200&&x.status<300&&d.ok)resolve(d);else{if(x.status===401){sayutiClearAdminSession();}reject(new Error(d.error||"Upload gagal (HTTP "+x.status+")."));}};
 x.onerror=()=>reject(new Error("Koneksi terputus saat mengirim APK."));x.ontimeout=()=>reject(new Error("Upload melewati batas waktu."));x.timeout=600000;x.send(file);});
}

async function sayutiUploadIcon(file, path, onProgress) {
 const session = sayutiGetAdminSession();
 if (!session) throw new Error("Sesi admin belum aktif. Silakan login kembali.");
 return await new Promise((resolve, reject) => {
  const x = new XMLHttpRequest();
  x.open("POST", SAYUTI_UPLOAD_API + "/icon?path=" + encodeURIComponent(path), true);
  x.setRequestHeader("Authorization", "Bearer " + session);
  x.setRequestHeader("Content-Type", file.type || "application/octet-stream");
  x.upload.onprogress = e => { if (e.lengthComputable && onProgress) onProgress(Math.round(e.loaded / e.total * 100)); };
  x.onload = () => {
   let d = {}; try { d = JSON.parse(x.responseText || "{}"); } catch (e) {}
   if (x.status >= 200 && x.status < 300 && d.ok) resolve(d);
   else { if (x.status === 401) sayutiClearAdminSession(); reject(new Error(d.error || "Upload logo gagal (HTTP " + x.status + ").")); }
  };
  x.onerror = () => reject(new Error("Koneksi terputus saat mengirim logo."));
  x.ontimeout = () => reject(new Error("Upload logo melewati batas waktu."));
  x.timeout = 180000;
  x.send(file);
 });
}

async function sayutiSyncCatalog(onProgress) {
 const session = sayutiGetAdminSession();
 if(!session)throw new Error("Sesi admin belum aktif. Silakan login kembali melalui panel Admin.");if(onProgress)onProgress(10,"Mengirim data katalog...");
 const r=await fetch(SAYUTI_UPLOAD_API+"/catalog",{method:"POST",headers:{"Authorization":"Bearer "+session,"Content-Type":"application/json"},body:JSON.stringify({apps:dbApps})});
 const d=await r.json().catch(()=>({}));if(!r.ok||!d.ok){if(r.status===401){sayutiAdminSession="";sessionStorage.removeItem("sayuti_admin_session");}throw new Error(d.error||"Sinkronisasi katalog gagal (HTTP "+r.status+").");}
 if(onProgress)onProgress(100,"Katalog berhasil disimpan.");return d;
}

async function verifyAdminLogin() {
 const el=document.getElementById("adminPinInput");const pin=el?el.value.trim():"";if(!pin){alert("Masukkan PIN administrator.");return;}
 const btn=document.querySelector('#adminLoginModal button[onclick="verifyAdminLogin()"]');if(btn){btn.disabled=true;btn.textContent="Memeriksa...";}
 try{await sayutiWorkerLogin(pin);isAdminLoggedIn=true;closeModalDirect("adminLoginModal");switchView("admin");showToast("Berhasil masuk Admin!");if(el)el.value="";}
 catch(e){alert(e.message||"Login admin gagal.");}
 finally{if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-right-to-bracket"></i> Masuk ke Panel';}}
}

function renderAdminTable() {
    const tbody = document.getElementById('adminAppTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    dbApps.forEach(app => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${app.title}</strong></td>
            <td>${app.category}</td>
            <td>${app.version}</td>
            <td>${formatNumber(app.downloads)}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon-action" title="Upload APK terbaru" style="white-space:nowrap;padding:6px 9px;" onclick="openQuickApkUpload(${app.id})"><i class="fa-solid fa-upload"></i> Upload</button>
                    <button class="btn-icon-action" title="Edit detail aplikasi" onclick="openAppFormModal(${app.id})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-icon-action danger" title="Hapus aplikasi" onclick="deleteApp(${app.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Upload APK cepat: pilih aplikasi yang sudah ada, lalu unggah APK terbaru saja.
let quickApkAppId = null;

function openQuickApkUpload(appId) {
    const app = dbApps.find(item => String(item.id) === String(appId));
    if (!app) return;
    quickApkAppId = app.id;
    const title = document.getElementById('quickApkAppTitle');
    const fileInput = document.getElementById('quickApkFile');
    if (title) title.textContent = app.title;
    if (fileInput) fileInput.value = '';
    const modal = document.getElementById('quickApkModal');
    if (modal) modal.classList.add('active');
}

function setQuickApkProgress(percent, message) {
    const wrap = document.getElementById('quickApkProgressWrap');
    const bar = document.getElementById('quickApkProgressBar');
    const label = document.getElementById('quickApkProgressPercent');
    const status = document.getElementById('quickApkProgressStatus');
    if (wrap) wrap.style.display = 'block';
    const safePercent = Math.max(0, Math.min(100, Math.round(percent)));
    if (bar) {
        bar.style.width = safePercent + '%';
        bar.setAttribute('aria-valuenow', String(safePercent));
    }
    if (label) label.textContent = safePercent + '%';
    if (status && message) status.textContent = message;
}

function setQuickApkUploading(isUploading) {
    const button = document.querySelector('#quickApkModal button[onclick="uploadApkOnly()"]');
    const fileInput = document.getElementById('quickApkFile');
    if (button) {
        button.disabled = isUploading;
        button.style.opacity = isUploading ? '0.65' : '1';
        button.style.cursor = isUploading ? 'wait' : 'pointer';
        button.innerHTML = isUploading
            ? '<i class="fa-solid fa-spinner fa-spin"></i> Sedang memproses...'
            : '<i class="fa-solid fa-upload"></i> Upload dan Ganti APK Lama';
    }
    if (fileInput) fileInput.disabled = isUploading;
}

function readFileAsBase64WithProgress(file, onProgress) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onprogress = event => {
            if (event.lengthComputable && onProgress) {
                onProgress(Math.round((event.loaded / event.total) * 100));
            }
        };
        reader.onload = () => {
            const result = String(reader.result || '');
            const comma = result.indexOf(',');
            if (comma < 0) return reject(new Error('File APK tidak dapat dibaca.'));
            resolve(result.slice(comma + 1));
        };
        reader.onerror = () => reject(new Error('Gagal membaca file APK dari perangkat.'));
        reader.onabort = () => reject(new Error('Pembacaan file dibatalkan.'));
        reader.readAsDataURL(file);
    });
}

// Upload APK untuk aplikasi yang sudah ada. File lama ditimpa pada path yang sama.
async function uploadApkOnly() {
 const app=dbApps.find(item=>String(item.id)===String(quickApkAppId));const input=document.getElementById("quickApkFile");const file=input&&input.files?input.files[0]:null;
 if(!app){alert("Pilih aplikasi yang akan diperbarui.");return;}if(!file){alert("Pilih file APK terbaru terlebih dahulu.");return;}if(!/\.apk$/i.test(file.name)){alert("File harus berformat .apk");return;}if(file.size>25*1024*1024){alert("Ukuran APK maksimal 25 MB.");return;}
 const old=typeof app.downloadUrl==="string"?app.downloadUrl.trim():"";const local=old&&old!=="#"&&!/^https?:\/\//i.test(old)&&!/^data:/i.test(old)&&!old.startsWith("/");const path=local?old:file.name;
 setQuickApkUploading(true);setQuickApkProgress(2,"Menyiapkan upload...");
 try{await sayutiUploadApk(file,path,p=>setQuickApkProgress(5+p*.82,"Mengirim APK ("+p+"%)..."));app.downloadUrl=path;app.format="APK File";setQuickApkProgress(90,"APK tersimpan. Menyinkronkan katalog...");
 await sayutiSyncCatalog((p,m)=>setQuickApkProgress(90+p*.1,m));setQuickApkProgress(100,"Pembaruan APK selesai!");renderAdminTable();renderApps();showToast("APK berhasil diganti. Tautan unduhan tetap sama.");window.setTimeout(()=>closeModalDirect("quickApkModal"),900);}
 catch(e){console.error("Upload APK gagal:",e);setQuickApkProgress(0,"Gagal: "+e.message);alert("Gagal memperbarui APK: "+e.message);}finally{setQuickApkUploading(false);}
}

function openAppFormModal(appId = null) {
    let editId = document.getElementById('editAppId');
    if(editId) editId.value = appId || '';
    

    if (appId) {
        let app = dbApps.find(a => a.id === appId);
        if (app) {
            if(document.getElementById('formModalTitle')) document.getElementById('formModalTitle').innerText = "Edit Aplikasi";
            if(document.getElementById('inputTitle')) document.getElementById('inputTitle').value = app.title;
            if(document.getElementById('inputCategory')) document.getElementById('inputCategory').value = app.category;
            if(document.getElementById('inputStatus')) document.getElementById('inputStatus').value = app.status || '';
            if(document.getElementById('inputIcon')) document.getElementById('inputIcon').value = app.icon && app.icon.startsWith('fa-') ? app.icon : '';
            if(document.getElementById('inputShortDesc')) document.getElementById('inputShortDesc').value = app.shortDesc;
            if(document.getElementById('inputFullDesc')) document.getElementById('inputFullDesc').value = app.fullDesc;
            if(document.getElementById('inputVersion')) document.getElementById('inputVersion').value = app.version;
            if(document.getElementById('inputFormat')) document.getElementById('inputFormat').value = app.format;
            if(document.getElementById('inputDownloadUrl')) document.getElementById('inputDownloadUrl').value = app.downloadUrl;
            if(document.getElementById('inputChangelog')) document.getElementById('inputChangelog').value = app.changelog;
        }
    } else {
        if(document.getElementById('formModalTitle')) document.getElementById('formModalTitle').innerText = "Tambah Aplikasi";
        if(document.getElementById('inputTitle')) document.getElementById('inputTitle').value = '';
        if(document.getElementById('inputIcon')) document.getElementById('inputIcon').value = '';
        if(document.getElementById('inputShortDesc')) document.getElementById('inputShortDesc').value = '';
        if(document.getElementById('inputFullDesc')) document.getElementById('inputFullDesc').value = '';
        if(document.getElementById('inputVersion')) document.getElementById('inputVersion').value = '';
        if(document.getElementById('inputFormat')) document.getElementById('inputFormat').value = '';
        if(document.getElementById('inputDownloadUrl')) document.getElementById('inputDownloadUrl').value = '';
        if(document.getElementById('inputChangelog')) document.getElementById('inputChangelog').value = '';
        if(document.getElementById('inputApkFile')) document.getElementById('inputApkFile').value = '';
        if(document.getElementById('inputIconFile')) document.getElementById('inputIconFile').value = '';
    }
    let formModal = document.getElementById('appFormModal');
    if(formModal) formModal.classList.add('active');
}


function setAppFormProgress(percent, message) {
    const wrap = document.getElementById('appFormProgressWrap');
    const bar = document.getElementById('appFormProgressBar');
    const label = document.getElementById('appFormProgressPercent');
    const status = document.getElementById('appFormProgressStatus');
    if (wrap) wrap.style.display = 'block';
    const value = Math.max(0, Math.min(100, Math.round(percent)));
    if (bar) {
        bar.style.width = value + '%';
        bar.setAttribute('aria-valuenow', String(value));
    }
    if (label) label.textContent = value + '%';
    if (status && message) status.textContent = message;
}

async function saveAppFromForm() {
    let editIdElem = document.getElementById('editAppId');
    let titleElem = document.getElementById('inputTitle');
    let id = editIdElem ? editIdElem.value : '';
    let title = titleElem ? titleElem.value.trim() : '';
    
    let apkFileInput = document.getElementById('inputApkFile') ? document.getElementById('inputApkFile').files[0] : null;
    let iconFileInput = document.getElementById('inputIconFile') ? document.getElementById('inputIconFile').files[0] : null;
    
    if (!title) { alert('Nama aplikasi wajib diisi'); return; }
    setAppFormProgress(2, 'Memeriksa data aplikasi...');

    let downloadUrl = document.getElementById('inputDownloadUrl') ? document.getElementById('inputDownloadUrl').value : '#';
    let format = document.getElementById('inputFormat') ? document.getElementById('inputFormat').value : 'APK File';
    let iconValue = document.getElementById('inputIcon') && document.getElementById('inputIcon').value ? document.getElementById('inputIcon').value.trim() : 'fa-cube';
    let repoOwnerAndName = 'sayut303-dot/sayuti.my.id';

    // 1. Upload APK melalui Cloudflare Worker; file lama tetap memakai path yang sama.
    if (apkFileInput) {
        if (!/\.apk$/i.test(apkFileInput.name)) { alert('File harus berformat .apk'); return; }
        if (apkFileInput.size > 25 * 1024 * 1024) { alert('Ukuran APK maksimal 25 MB.'); return; }
        const existingApp = id ? dbApps.find(a => String(a.id) === String(id)) : null;
        const previousUrl = existingApp && typeof existingApp.downloadUrl === 'string' ? existingApp.downloadUrl.trim() : '';
        const isRepoFile = previousUrl && previousUrl !== '#' && !/^https?:\/\//i.test(previousUrl) && !/^data:/i.test(previousUrl) && !previousUrl.startsWith('/');
        const fileName = isRepoFile ? previousUrl : apkFileInput.name;
        try {
            setAppFormProgress(8, 'Mengunggah APK melalui server...');
            await sayutiUploadApk(apkFileInput, fileName, pct => setAppFormProgress(8 + pct * 0.62, 'Mengirim APK (' + pct + '%)...'));
            downloadUrl = fileName;
            format = 'APK File';
        } catch (error) {
            console.error('APK upload error:', error);
            alert('Gagal upload APK: ' + (error.message || 'Kesalahan tidak diketahui.'));
            return;
        }
    }

    // 2. Upload logo melalui Worker; GitHub PAT tidak pernah dikirim ke browser.
    if (iconFileInput) {
        setAppFormProgress(76, 'Memproses logo aplikasi...');
        try {
            const originalName = iconFileInput.name || 'logo';
            const extension = originalName.split('.').pop().toLowerCase();
            const detectedType = iconFileInput.type ||
                ({ png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
                   webp: 'image/webp', svg: 'image/svg+xml' }[extension] || '');
            const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
            if (!allowedTypes.includes(detectedType)) {
                alert('Format logo tidak didukung. Gunakan PNG, JPG, WebP, atau SVG.');
                return;
            }
            let uploadBlob = iconFileInput;
            let uploadName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_');
            if (detectedType !== 'image/svg+xml') {
                try {
                    const bitmap = await createImageBitmap(iconFileInput);
                    const maxDimension = 1024;
                    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
                    const canvas = document.createElement('canvas');
                    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
                    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
                    const ctx = canvas.getContext('2d');
                    if (!ctx) throw new Error('Browser tidak dapat memproses gambar.');
                    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
                    bitmap.close();
                    const compressedBlob = await new Promise((resolve, reject) => {
                        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Kompresi gambar gagal.')), 'image/webp', 0.88);
                    });
                    uploadBlob = compressedBlob;
                    uploadName = uploadName.replace(/\.[^.]+$/, '') + '.webp';
                } catch (compressionError) {
                    console.warn('Kompresi logo gagal:', compressionError);
                    if (iconFileInput.size > 5 * 1024 * 1024) {
                        alert('Gambar terlalu besar untuk diproses. Coba gambar yang lebih kecil.');
                        return;
                    }
                }
            } else if (iconFileInput.size > 5 * 1024 * 1024) {
                alert('SVG terlalu besar (maksimal 5 MB).');
                return;
            }
            if (uploadBlob.size > 5 * 1024 * 1024) {
                alert('Ukuran logo setelah diproses masih lebih dari 5 MB.');
                return;
            }
            const iconFileName = 'logo_' + Date.now() + '_' + uploadName;
            setAppFormProgress(82, 'Mengunggah logo melalui server...');
            await sayutiUploadIcon(new Blob([uploadBlob], { type: uploadBlob.type || detectedType }), iconFileName, pct => {
                setAppFormProgress(82 + pct * 0.06, 'Mengunggah logo (' + pct + '%)...');
            });
            iconValue = iconFileName;
            showToast('Logo berhasil di-upload!');
        } catch (error) {
            console.error('Logo upload error:', error);
            alert('Error upload logo: ' + (error.message || 'Kesalahan tidak diketahui.'));
            return;
        }
    }

    // 3. Simpan metadata aplikasi ke katalog.
    setAppFormProgress(88, 'Menyimpan informasi aplikasi...');
    let appData = {
        title,
        category: document.getElementById('inputCategory') ? document.getElementById('inputCategory').value : 'android',
        status: document.getElementById('inputStatus') ? document.getElementById('inputStatus').value : '',
        icon: iconValue,
        shortDesc: document.getElementById('inputShortDesc') ? document.getElementById('inputShortDesc').value : '',
        fullDesc: document.getElementById('inputFullDesc') ? document.getElementById('inputFullDesc').value : '',
        version: document.getElementById('inputVersion') ? document.getElementById('inputVersion').value : 'v1.0',
        format: format,
        downloadUrl: downloadUrl,
        changelog: document.getElementById('inputChangelog') ? document.getElementById('inputChangelog').value : 'Pembaruan rutin.',
    };

    if (id) {
        let idx = dbApps.findIndex(a => a.id == id);
        if (idx !== -1) {
            dbApps[idx] = { ...dbApps[idx], ...appData };
        }
    } else {
        appData.id = Date.now();
        appData.downloads = 0;
        appData.reviews = [];
        appData.screenshots = [];
        dbApps.push(appData);
    }
    saveDownloadCounts();

    try {
        setAppFormProgress(93, 'Menyinkronkan katalog ke GitHub...');
        showToast('Menyinkronkan database ke GitHub...');
        await sayutiSyncCatalog((pct, message) => {
            setAppFormProgress(93 + pct * 0.07, message || 'Menyinkronkan katalog...');
        });
        setAppFormProgress(100, 'Selesai! Aplikasi berhasil disimpan.');
        showToast('Berhasil disimpan & disinkronkan ke publik!');
    } catch (err) {
        setAppFormProgress(0, 'Gagal menyimpan: ' + (err.message || 'Kesalahan tidak diketahui.'));
        alert('Gagal sinkronisasi ke GitHub: ' + err.message);
        return;
    }

    closeModalDirect('appFormModal');
    renderAdminTable();
    renderApps();
}
