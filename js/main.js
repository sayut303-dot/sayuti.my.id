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
    }
];

let favorites = JSON.parse(localStorage.getItem('sayuti_favs') || '[]');
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

    const githubToken = localStorage.getItem('sayuti_gh_token');
    if (githubToken) updateMainJsOnGitHub(githubToken).catch(e => console.warn('Sinkronisasi gagal:', e));
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

    let githubToken = localStorage.getItem('sayuti_gh_token');
    if (githubToken) {
        try { await updateMainJsOnGitHub(githubToken); } catch(e) {}
    }
}

function renderAnalytics() {
    let totalDl = getTotalDownloads();
    let totalRev = dbApps.reduce((acc, curr) => acc + (curr.reviews ? curr.reviews.length : 0), 0);
    if(document.getElementById('statTotalApps')) document.getElementById('statTotalApps').innerText = dbApps.length;
    if(document.getElementById('statTotalDownloads')) document.getElementById('statTotalDownloads').innerText = formatNumber(totalDl);
    if(document.getElementById('statTotalReviews')) document.getElementById('statTotalReviews').innerText = totalRev;
}

function openAdminLoginModal() { 
    let modal = document.getElementById('adminLoginModal');
    if(modal) modal.classList.add('active'); 
}

function verifyAdminLogin() {
    let pinInput = document.getElementById('adminPinInput');
    let pin = pinInput ? pinInput.value : '';
    if (pin === '157303') {
        isAdminLoggedIn = true;
        closeModalDirect('adminLoginModal');
        switchView('admin');
        showToast('Berhasil masuk Admin!');
        if(pinInput) pinInput.value = '';
    } else {
        alert('PIN Salah!');
    }
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
    const tokenInput = document.getElementById('quickApkGithubToken');
    if (title) title.textContent = app.title;
    if (fileInput) fileInput.value = '';
    if (tokenInput) tokenInput.value = localStorage.getItem('sayuti_gh_token') || '';
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
    const tokenInput = document.getElementById('quickApkGithubToken');
    if (button) {
        button.disabled = isUploading;
        button.style.opacity = isUploading ? '0.65' : '1';
        button.style.cursor = isUploading ? 'wait' : 'pointer';
        button.innerHTML = isUploading
            ? '<i class="fa-solid fa-spinner fa-spin"></i> Sedang memproses...'
            : '<i class="fa-solid fa-upload"></i> Upload dan Ganti APK Lama';
    }
    if (fileInput) fileInput.disabled = isUploading;
    if (tokenInput) tokenInput.disabled = isUploading;
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

function putGithubContentsWithProgress(apiUrl, token, payload, onProgress) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', apiUrl, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.setRequestHeader('Accept', 'application/vnd.github+json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.upload.onprogress = event => {
            if (event.lengthComputable && onProgress) {
                onProgress(Math.round((event.loaded / event.total) * 100));
            }
        };
        xhr.onload = () => {
            let data = {};
            try { data = JSON.parse(xhr.responseText || '{}'); } catch (e) {}
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(data);
                return;
            }
            const detail = data.message || ('GitHub menolak upload (HTTP ' + xhr.status + ').');
            const error = new Error(detail);
            error.status = xhr.status;
            reject(error);
        };
        xhr.onerror = () => reject(new Error('Koneksi terputus saat mengunggah. Periksa internet lalu coba lagi.'));
        xhr.onabort = () => reject(new Error('Upload dibatalkan.'));
        xhr.send(JSON.stringify(payload));
    });
}

// Upload APK untuk aplikasi yang sudah ada. File lama ditimpa pada path yang sama.
async function uploadApkOnly() {
    const app = dbApps.find(item => String(item.id) === String(quickApkAppId));
    const fileInput = document.getElementById('quickApkFile');
    const tokenInput = document.getElementById('quickApkGithubToken');
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;
    const token = tokenInput ? tokenInput.value.trim() : '';

    if (!app) { alert('Pilih aplikasi yang akan diperbarui.'); return; }
    if (!file) { alert('Pilih file APK terbaru terlebih dahulu.'); return; }
    if (!/\.apk$/i.test(file.name)) { alert('File harus berformat .apk'); return; }
    if (!token) { alert('Masukkan GitHub Token untuk mengunggah APK.'); return; }

    // GitHub Contents API menerima JSON berisi Base64, sehingga file besar cepat melewati batas.
    const maxBytes = 70 * 1024 * 1024;
    if (file.size > maxBytes) {
        alert('APK berukuran ' + (file.size / 1024 / 1024).toFixed(1) +
            ' MB. Batas upload langsung saat ini 70 MB. Untuk file lebih besar perlu GitHub Releases/penyimpanan khusus.');
        return;
    }

    const repo = 'sayut303-dot/sayuti.my.id';
    const oldPath = typeof app.downloadUrl === 'string' ? app.downloadUrl.trim() : '';
    const isRepoPath = oldPath && oldPath !== '#' &&
        !/^https?:\/\//i.test(oldPath) && !/^data:/i.test(oldPath) &&
        !oldPath.startsWith('/');
    // Untuk aplikasi yang sudah memakai file di repo, PERTAHANKAN path lama.
    // PUT dengan SHA akan mengganti file lama, bukan menambah APK dengan nama baru.
    const filePath = isRepoPath ? oldPath : file.name;
    const encodedPath = filePath.split('/').map(part => encodeURIComponent(part)).join('/');
    const apiUrl = 'https://api.github.com/repos/' + repo + '/contents/' + encodedPath;
    const headers = {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github+json'
    };

    let apkUploaded = false;
    setQuickApkUploading(true);
    setQuickApkProgress(0, 'Menyiapkan pembaruan...');
    try {
        localStorage.setItem('sayuti_gh_token', token);
        setQuickApkProgress(2, 'Memeriksa file lama di GitHub...');
        const check = await fetch(apiUrl, { headers });
        let sha = null;
        if (check.ok) {
            const existing = await check.json();
            sha = existing.sha || null;
            if (!sha) throw new Error('GitHub tidak memberikan SHA file lama. Upload dihentikan agar file tidak tertimpa secara tidak aman.');
        } else if (check.status !== 404) {
            let detail = '';
            try { detail = (await check.json()).message || ''; } catch (e) {}
            throw new Error('Tidak bisa memeriksa file lama (HTTP ' + check.status + '). ' +
                (detail || 'Periksa token dan izin Contents: Read and write.'));
        }

        setQuickApkProgress(5, 'Membaca APK...');
        const base64 = await readFileAsBase64WithProgress(file, pct => {
            setQuickApkProgress(5 + pct * 0.2, 'Membaca APK (' + pct + '%)...');
        });
        const payload = {
            message: (sha ? 'Ganti APK lama: ' : 'Upload APK: ') + filePath,
            content: base64
        };
        if (sha) payload.sha = sha;

        setQuickApkProgress(25, sha ? 'Mengganti file APK lama...' : 'Mengunggah APK ke lokasi unduhan...');
        const uploaded = await putGithubContentsWithProgress(apiUrl, token, payload, pct => {
            setQuickApkProgress(25 + pct * 0.68, 'Transfer APK (' + pct + '%)...');
        });
        apkUploaded = true;

        // Pastikan GitHub mengonfirmasi path yang sama sebelum menyatakan sukses.
        if (uploaded && uploaded.content && uploaded.content.path && uploaded.content.path !== filePath) {
            throw new Error('GitHub menyimpan APK pada path yang berbeda dari yang diminta.');
        }

        // Path lama dipertahankan untuk aplikasi yang sudah memakai file lokal repo.
        // Dengan begitu katalog tidak perlu ditulis ulang setiap update APK, menghindari kegagalan sinkronisasi js/main.js.
        const needsCatalogSync = !isRepoPath || app.downloadUrl !== filePath || app.format !== 'APK File';
        app.downloadUrl = filePath;
        app.format = 'APK File';
        if (needsCatalogSync) {
            setQuickApkProgress(95, 'APK terkirim. Menyimpan tautan katalog...');
            await updateMainJsOnGitHub(token);
        }

        setQuickApkProgress(100, 'Pembaruan APK selesai!');
        renderAdminTable();
        renderApps();
        showToast('APK baru menggantikan file lama. Tautan unduhan tetap sama.');
        window.setTimeout(() => closeModalDirect('quickApkModal'), 900);
    } catch (error) {
        console.error('Upload APK cepat gagal:', error);
        const detail = error.message || 'Kesalahan tidak diketahui.';
        setQuickApkProgress(0, (apkUploaded ? 'APK sudah terunggah; langkah katalog perlu diperiksa: ' : 'Gagal: ') + detail);
        alert((apkUploaded
            ? 'APK sudah berhasil diunggah, tetapi langkah akhir belum selesai. Detail: '
            : 'Gagal memperbarui APK. Detail: ') + detail +
            '\n\nPeriksa: token GitHub memiliki Contents: Read and write, branch main tidak diblokir aturan repository, dan ukuran APK maksimal 70 MB.');
    } finally {
        setQuickApkUploading(false);
    }
}

function openAppFormModal(appId = null) {
    let editId = document.getElementById('editAppId');
    if(editId) editId.value = appId || '';
    
    let savedToken = localStorage.getItem('sayuti_gh_token');
    let tokenInput = document.getElementById('inputGithubToken');
    if (savedToken && tokenInput) {
        tokenInput.value = savedToken;
    }

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

async function saveAppFromForm() {
    let editIdElem = document.getElementById('editAppId');
    let titleElem = document.getElementById('inputTitle');
    let id = editIdElem ? editIdElem.value : '';
    let title = titleElem ? titleElem.value.trim() : '';
    
    let apkFileInput = document.getElementById('inputApkFile') ? document.getElementById('inputApkFile').files[0] : null;
    let iconFileInput = document.getElementById('inputIconFile') ? document.getElementById('inputIconFile').files[0] : null;
    let githubToken = document.getElementById('inputGithubToken') ? document.getElementById('inputGithubToken').value.trim() : '';
    
    if (!title) { alert('Nama aplikasi wajib diisi'); return; }
    if (!githubToken) { alert('GitHub Token wajib diisi untuk sinkronisasi publik!'); return; }

    localStorage.setItem('sayuti_gh_token', githubToken);

    let downloadUrl = document.getElementById('inputDownloadUrl') ? document.getElementById('inputDownloadUrl').value : '#';
    let format = document.getElementById('inputFormat') ? document.getElementById('inputFormat').value : 'APK File';
    let iconValue = document.getElementById('inputIcon') && document.getElementById('inputIcon').value ? document.getElementById('inputIcon').value.trim() : 'fa-cube';
    let repoOwnerAndName = 'sayut303-dot/sayuti.my.id';

    // 1. Upload APK. Saat mengedit aplikasi, gunakan path APK lama agar file lama
    // ditimpa dan tautan unduhan yang sudah ada tetap berfungsi.
    if (apkFileInput) {
        showToast('Mengunggah APK terbaru dan menggantikan versi lama...');
        try {
            const base64Content = await toBase64(apkFileInput);
            const existingApp = id ? dbApps.find(a => String(a.id) === String(id)) : null;
            const previousUrl = existingApp && typeof existingApp.downloadUrl === 'string'
                ? existingApp.downloadUrl.trim()
                : '';
            const isRepoFile = previousUrl && previousUrl !== '#' &&
                !/^https?:\/\//i.test(previousUrl) && !/^data:/i.test(previousUrl) &&
                !previousUrl.startsWith('/');
            const fileName = isRepoFile ? previousUrl : apkFileInput.name;
            const encodedFileName = fileName.split('/').map(part => encodeURIComponent(part)).join('/');
            const apiUrl = `https://api.github.com/repos/${repoOwnerAndName}/contents/${encodedFileName}`;
            const githubHeaders = {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github+json'
            };

            let existingSha = null;
            const checkRes = await fetch(apiUrl, { headers: githubHeaders });
            if (checkRes.ok) {
                const fileData = await checkRes.json();
                existingSha = fileData.sha;
            } else if (checkRes.status !== 404) {
                let message = 'Tidak dapat memeriksa file APK lama di GitHub.';
                try {
                    const errorData = await checkRes.json();
                    if (errorData.message) message += '\nGitHub: ' + errorData.message;
                } catch (e) {}
                throw new Error(message);
            }

            const bodyData = {
                message: existingSha
                    ? `Perbarui APK ${fileName} via Admin Panel SayutiHub`
                    : `Upload APK ${fileName} via Admin Panel SayutiHub`,
                content: base64Content
            };
            if (existingSha) bodyData.sha = existingSha;

            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: { ...githubHeaders, 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            if (!response.ok) {
                let errorData = {};
                try { errorData = await response.json(); } catch (e) {}
                throw new Error(errorData.message || 'Periksa token dan izin GitHub Anda.');
            }

            downloadUrl = fileName;
            format = 'APK File';
            showToast(existingSha
                ? 'APK lama berhasil digantikan dengan versi terbaru!'
                : 'APK berhasil di-upload!');
        } catch (error) {
            console.error('APK upload error:', error);
            alert('Gagal upload/update APK: ' + (error.message || 'Kesalahan tidak diketahui.'));
            return;
        }
    }

    // 2. Proses Upload File Logo/Ikon ke GitHub (jika ada)
    if (iconFileInput) {
        showToast('Memproses logo aplikasi...');

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

            // Raster besar otomatis diperkecil dan dikompresi menjadi WebP.
            // Ini menghindari payload Base64 besar dan lebih cocok untuk ikon aplikasi.
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
                        canvas.toBlob(blob => {
                            if (blob) resolve(blob);
                            else reject(new Error('Kompresi gambar gagal.'));
                        }, 'image/webp', 0.88);
                    });
                    uploadBlob = compressedBlob;
                    uploadName = uploadName.replace(/\.[^.]+$/, '') + '.webp';
                } catch (compressionError) {
                    console.warn('Kompresi logo gagal:', compressionError);
                    if (iconFileInput.size > 5 * 1024 * 1024) {
                        alert('Gambar terlalu besar untuk diproses browser. Coba JPG/PNG yang lebih sederhana atau SVG yang dioptimalkan.');
                        return;
                    }
                    // Untuk gambar kecil, coba unggah file asli bila browser tak mendukung kompresi.
                }
            } else if (iconFileInput.size > 5 * 1024 * 1024) {
                alert('SVG terlalu besar (maksimal 5 MB). Optimalkan SVG terlebih dahulu.');
                return;
            }

            // Batas setelah kompresi, bukan pada ukuran file asli.
            if (uploadBlob.size > 5 * 1024 * 1024) {
                alert('Ukuran logo setelah diproses masih lebih dari 5 MB. Coba gambar lain.');
                return;
            }

            const base64Icon = await toBase64(uploadBlob);
            const iconFileName = 'logo_' + Date.now() + '_' + uploadName;
            const encodedIconFileName = encodeURIComponent(iconFileName);

            const githubHeaders = {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github+json'
            };

            const repoCheck = await fetch(
                `https://api.github.com/repos/${repoOwnerAndName}`,
                { headers: githubHeaders }
            );

            if (!repoCheck.ok) {
                let errText = 'Token GitHub tidak dapat mengakses repository.';
                try {
                    const errData = await repoCheck.json();
                    if (errData.message) errText += '\n\nGitHub: ' + errData.message;
                } catch (e) {}
                alert(errText);
                return;
            }

            showToast('Mengunggah logo ke GitHub...');
            const responseIcon = await fetch(
                `https://api.github.com/repos/${repoOwnerAndName}/contents/${encodedIconFileName}`,
                {
                    method: 'PUT',
                    headers: {
                        ...githubHeaders,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `Upload logo ${iconFileName} via Admin Panel SayutiHub`,
                        content: base64Icon
                    })
                }
            );

            if (responseIcon.ok) {
                iconValue = iconFileName;
                showToast('Logo berhasil di-upload!');
            } else {
                let errMessage = 'Gagal upload logo.';
                try {
                    const errData = await responseIcon.json();
                    if (errData.message) errMessage += '\n\nGitHub: ' + errData.message;
                } catch (e) {}
                alert(errMessage);
                return;
            }
        } catch (error) {
            console.error('Logo upload error:', error);
            alert('Error upload logo: ' + (error.message || 'Kesalahan tidak diketahui.'));
            return;
        }
    }

    // 3.
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
        showToast('Menyinkronkan database ke GitHub...');
        await updateMainJsOnGitHub(githubToken);
        showToast('Berhasil disimpan & disinkronkan ke publik!');
    } catch (err) {
        alert('Gagal sinkronisasi ke GitHub: ' + err.message);
        return;
    }

    closeModalDirect('appFormModal');
    renderAdminTable();
    renderApps();
}

async function updateMainJsOnGitHub(githubToken) {
    let repoOwnerAndName = 'sayut303-dot/sayuti.my.id';
    let filePath = 'js/main.js';
    
    let getRes = await fetch(`https://api.github.com/repos/${repoOwnerAndName}/contents/${filePath}`, {
        headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
    
    if (!getRes.ok) throw new Error('Gagal mengambil file js/main.js dari GitHub.');
    let fileData = await getRes.json();
    let sha = fileData.sha;
    
    let currentCode = decodeBase64Unicode(fileData.content);
    let newDbAppsString = `let dbApps = ${JSON.stringify(dbApps, null, 4)};`;
    
    let startIndex = currentCode.indexOf('let dbApps =');
    let endIndex = currentCode.indexOf('let favorites =');
    
    if (startIndex !== -1 && endIndex !== -1) {
        let updatedCode = currentCode.substring(0, startIndex) + newDbAppsString + '\n\n' + currentCode.substring(endIndex);
        
        let putRes = await fetch(`https://api.github.com/repos/${repoOwnerAndName}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Update dbApps automatically via Admin Panel',
                content: encodeBase64Unicode(updatedCode),
                sha: sha
            })
        });
        
        if (!putRes.ok) {
            let errData = await putRes.json();
            throw new Error(errData.message || 'Gagal memperbarui file js/main.js.');
        }
    } else {
        throw new Error('Format file js/main.js tidak dikenali.');
    }
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
});

function encodeBase64Unicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

function decodeBase64Unicode(base64) {
    return decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

async function deleteApp(id) {
    if (confirm('Hapus aplikasi ini?')) {
        dbApps = dbApps.filter(a => a.id !== id);
        renderAdminTable();
        renderApps();
        
        let githubToken = localStorage.getItem('sayuti_gh_token');
        if (githubToken) {
            try {
                showToast('Menghapus & menyinkronkan ke GitHub...');
                await updateMainJsOnGitHub(githubToken);
                showToast('Berhasil dihapus dari publik!');
            } catch (err) {
                alert('Gagal sinkronisasi penghapusan: ' + err.message);
            }
        }
    }
}

function openShareModal() {
    let app = dbApps.find(a => a.id === activeAppId);
    if (!app) return;
    let qrImg = document.getElementById('qrImg');
    if(qrImg) qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(app.downloadUrl)}`;
    let shareModal = document.getElementById('shareModal');
    if(shareModal) shareModal.classList.add('active');
}

function copyAppShareLink() {
    let app = dbApps.find(a => a.id === activeAppId);
    if (!app) return;
    navigator.clipboard.writeText(app.downloadUrl);
    showToast('Tautan disalin!');
    closeModalDirect('shareModal');
}

function closeModal(e, modalId) {
    let modalElem = document.getElementById(modalId);
    if (e.target === modalElem) {
        modalElem.classList.remove('active');
    }
}

function closeModalDirect(modalId) { 
    let modal = document.getElementById(modalId);
    if(modal) modal.classList.remove('active'); 
}

function showToast(msg) {
    let t = document.getElementById('toast');
    let tMsg = document.getElementById('toastMsg');
    if (tMsg) tMsg.innerText = msg;
    if (t) {
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
    }
}
