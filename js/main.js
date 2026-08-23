let dbApps = [
    {
        id: 1,
        title: "Toko Sembako",
        category: "android",
        status: "Featured",
        icon: "fa-store",
        shortDesc: "Manajemen penjualan, inventaris barang, dan laporan keuangan toko sembako otomatis.",
        fullDesc: "Sistem POS (Point of Sale) lengkap khusus untuk toko sembako dan kelontong. Dilengkapi pencatatan stok otomatis.",
        version: "v7.0",
        format: "APK File",
        downloads: 4120,
        downloadUrl: "tokoSembako v7.0.apk",
        changelog: "Peningkatan stabilitas aplikasi.",
        screenshots: [],
        reviews: [{ name: "Budi Santoso", rating: 5, comment: "Sangat membantu kasir!" }]
    },
    {
        id: 2,
        title: "Sayuti AutoClicker",
        category: "windows",
        status: "Trending",
        icon: "fa-laptop-code",
        shortDesc: "Software otomatisasi klik mouse untuk komputer Windows dengan preset mudah.",
        fullDesc: "Software utilitas Windows untuk melakukan klik otomatis berkecepatan tinggi.",
        version: "v1.2.0",
        format: "8 MB EXE",
        downloads: 1850,
        downloadUrl: "#",
        changelog: "Dukungan Multi-Point Clicking.",
        screenshots: [],
        reviews: [{ name: "Rian Gamer", rating: 5, comment: "Lancar jaya!" }]
    }
];

let favorites = JSON.parse(localStorage.getItem('sayuti_favs') || '[]');
let currentCategory = 'all';
let activeAppId = null;
let selectedRating = 5;

document.addEventListener('DOMContentLoaded', () => {
    loadDatabase();
    renderApps();
    updateFavBadge();
});

function loadDatabase() {
    const saved = localStorage.getItem('sayutihub_v2_db');
    if (saved) {
        try { dbApps = JSON.parse(saved); } catch(e) {}
    } else {
        saveDatabase();
    }
}

function saveDatabase() {
    localStorage.setItem('sayutihub_v2_db', JSON.stringify(dbApps));
}

function switchView(viewName) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById(viewName + 'View').classList.add('active');
    
    if(viewName === 'favorites') renderFavorites();
    if(viewName === 'analytics') renderAnalytics();
    if(viewName === 'admin') renderAdminTable();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setCategory(cat, btn) {
    currentCategory = cat;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
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
    const search = document.getElementById('searchInput').value.toLowerCase();
    const sort = document.getElementById('sortSelect').value;

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
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        filtered.forEach(app => {
            let stats = getAppRatingStats(app);
            let isFav = favorites.includes(app.id);
            let statusBadge = app.status ? `<span class="badge badge-${app.status.toLowerCase()}">${app.status}</span>` : '';
            
            let card = document.createElement('div');
            card.className = 'app-card';
            card.onclick = () => openDetailModal(app.id);
            card.innerHTML = `
                <button class="fav-btn-card ${isFav ? 'active' : ''}" onclick="toggleFavorite(event, ${app.id})">
                    <i class="fa-solid fa-heart"></i>
                </button>
                <div>
                    <div class="app-header">
                        <div class="app-icon"><i class="fa-solid ${app.icon}"></i></div>
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
                        <span><i class="fa-solid fa-download"></i> ${app.downloads}</span>
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
    if(document.getElementById('favoritesView').classList.contains('active')) renderFavorites();
}

function updateFavBadge() {
    document.getElementById('favCount').innerText = favorites.length;
}

function renderFavorites() {
    const grid = document.getElementById('favoritesGrid');
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

    document.getElementById('detailTitle').innerText = app.title;
    document.getElementById('detailDesc').innerText = app.fullDesc;
    document.getElementById('detailVersion').innerText = app.version;
    document.getElementById('detailFormat').innerText = app.format;
    document.getElementById('detailDownloads').innerText = app.downloads;
    document.getElementById('detailChangelog').innerText = app.changelog;
    document.getElementById('detailIcon').innerHTML = `<i class="fa-solid ${app.icon}"></i>`;
    document.getElementById('detailDownloadBtn').href = app.downloadUrl;

    renderReviews(app);
    document.getElementById('detailModal').classList.add('active');
}

function incrementDownload() {
    let app = dbApps.find(a => a.id === activeAppId);
    if (app) {
        app.downloads++;
        saveDatabase();
        document.getElementById('detailDownloads').innerText = app.downloads;
        showToast('Mengunduh ' + app.title + '...');
    }
}

function triggerDownload(event, appId) {
    event.stopPropagation();
    let app = dbApps.find(a => a.id === appId);
    if (app) {
        app.downloads++;
        saveDatabase();
        showToast('Mengunduh ' + app.title + '...');
    }
}

function renderReviews(app) {
    const list = document.getElementById('reviewsList');
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

function submitReview() {
    let name = document.getElementById('reviewName').value.trim();
    let comment = document.getElementById('reviewComment').value.trim();
    if (!name || !comment) { alert('Nama dan ulasan wajib diisi.'); return; }
    let app = dbApps.find(a => a.id === activeAppId);
    if (!app.reviews) app.reviews = [];
    app.reviews.push({ name, rating: selectedRating, comment });
    saveDatabase();
    renderReviews(app);
    renderApps();
    document.getElementById('reviewName').value = '';
    document.getElementById('reviewComment').value = '';
    showToast('Ulasan terkirim!');
}

function renderAnalytics() {
    let totalDl = dbApps.reduce((acc, curr) => acc + curr.downloads, 0);
    let totalRev = dbApps.reduce((acc, curr) => acc + (curr.reviews ? curr.reviews.length : 0), 0);
    document.getElementById('statTotalApps').innerText = dbApps.length;
    document.getElementById('statTotalDownloads').innerText = totalDl;
    document.getElementById('statTotalReviews').innerText = totalRev;
}

function openAdminLoginModal() { document.getElementById('adminLoginModal').classList.add('active'); }

function verifyAdminLogin() {
    let pin = document.getElementById('adminPinInput').value;
    if (pin === '157303') {
        closeModalDirect('adminLoginModal');
        switchView('admin');
        showToast('Berhasil masuk Admin!');
    } else {
        alert('PIN Salah!');
    }
}

function renderAdminTable() {
    const tbody = document.getElementById('adminAppTableBody');
    tbody.innerHTML = '';
    dbApps.forEach(app => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${app.title}</strong></td>
            <td>${app.category}</td>
            <td>${app.version}</td>
            <td>${app.downloads}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon-action" onclick="openAppFormModal(${app.id})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-icon-action danger" onclick="deleteApp(${app.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openAppFormModal(appId = null) {
    document.getElementById('editAppId').value = appId || '';
    
    let savedToken = localStorage.getItem('sayuti_gh_token');
    if (savedToken && document.getElementById('inputGithubToken')) {
        document.getElementById('inputGithubToken').value = savedToken;
    }

    if (appId) {
        let app = dbApps.find(a => a.id === appId);
        document.getElementById('formModalTitle').innerText = "Edit Aplikasi";
        document.getElementById('inputTitle').value = app.title;
        document.getElementById('inputCategory').value = app.category;
        document.getElementById('inputStatus').value = app.status || '';
        document.getElementById('inputIcon').value = app.icon;
        document.getElementById('inputShortDesc').value = app.shortDesc;
        document.getElementById('inputFullDesc').value = app.fullDesc;
        document.getElementById('inputVersion').value = app.version;
        document.getElementById('inputFormat').value = app.format;
        document.getElementById('inputDownloadUrl').value = app.downloadUrl;
        document.getElementById('inputChangelog').value = app.changelog;
    } else {
        document.getElementById('formModalTitle').innerText = "Tambah Aplikasi";
        document.getElementById('inputTitle').value = '';
        document.getElementById('inputShortDesc').value = '';
        document.getElementById('inputFullDesc').value = '';
        document.getElementById('inputVersion').value = '';
        document.getElementById('inputFormat').value = '';
        document.getElementById('inputDownloadUrl').value = '';
        document.getElementById('inputChangelog').value = '';
        if(document.getElementById('inputApkFile')) document.getElementById('inputApkFile').value = '';
    }
    document.getElementById('appFormModal').classList.add('active');
}

// Fungsi Utama: Menyimpan Aplikasi, Upload APK, & Sinkronisasi Otomatis ke GitHub
async function saveAppFromForm() {
    let id = document.getElementById('editAppId').value;
    let title = document.getElementById('inputTitle').value.trim();
    let apkFileInput = document.getElementById('inputApkFile') ? document.getElementById('inputApkFile').files[0] : null;
    let githubToken = document.getElementById('inputGithubToken') ? document.getElementById('inputGithubToken').value.trim() : '';
    
    if (!title) { alert('Nama aplikasi wajib diisi'); return; }

    let downloadUrl = document.getElementById('inputDownloadUrl').value || '#';
    let format = document.getElementById('inputFormat').value || 'APK File';
    let repoOwnerAndName = 'sayut303-dot/sayuti.my.id';

    if (githubToken) {
        localStorage.setItem('sayuti_gh_token', githubToken);
    }

    // Jika file APK dipilih dan token ada, upload file APK ke GitHub
    if (apkFileInput && githubToken) {
        showToast('Mengunggah file APK ke GitHub...');
        try {
            let base64Content = await toBase64(apkFileInput);
            let fileName = apkFileInput.name;
            
            let response = await fetch(`https://api.github.com/repos/${repoOwnerAndName}/contents/${fileName}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Upload ${fileName} via Admin Panel SayutiHub`,
                    content: base64Content
                })
            });

            if (response.ok) {
                downloadUrl = fileName; 
                format = 'APK File';
                showToast('APK Berhasil di-upload!');
            } else {
                let errData = await response.json();
                alert('Gagal upload APK ke GitHub: ' + (errData.message || 'Periksa kembali token Anda.'));
                return;
            }
        } catch (error) {
            alert('Terjadi kesalahan jaringan saat upload APK.');
            return;
        }
    }

    let appData = {
        title,
        category: document.getElementById('inputCategory').value,
        status: document.getElementById('inputStatus').value,
        icon: document.getElementById('inputIcon').value || 'fa-cube',
        shortDesc: document.getElementById('inputShortDesc').value,
        fullDesc: document.getElementById('inputFullDesc').value,
        version: document.getElementById('inputVersion').value || 'v1.0',
        format: format,
        downloadUrl: downloadUrl,
        changelog: document.getElementById('inputChangelog').value || 'Pembaruan rutin.',
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

    saveDatabase();

    // SINKRONISASI OTOMATIS: Update file js/main.js di GitHub agar muncul di HP orang lain
    if (githubToken) {
        try {
            showToast('Menyinkronkan database ke GitHub...');
            await updateMainJsOnGitHub(githubToken);
            showToast('Berhasil disimpan & disinkronkan ke publik!');
        } catch (err) {
            alert('Gagal sinkronisasi database ke GitHub: ' + err.message);
            return;
        }
    } else {
        alert('Perhatian: GitHub Token kosong. Data hanya tersimpan di HP Anda dan belum disinkronkan ke publik.');
    }

    closeModalDirect('appFormModal');
    renderAdminTable();
    renderApps();
}

// Helper untuk memperbarui file js/main.js secara otomatis di GitHub
async function updateMainJsOnGitHub(githubToken) {
    let repoOwnerAndName = 'sayut303-dot/sayuti.my.id';
    let filePath = 'js/main.js';
    
    // Ambil SHA file js/main.js yang ada di GitHub saat ini
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

// Helper Enkode & Dekode Base64 yang aman untuk teks Unicode/Emoji
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
        saveDatabase();
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
        } else {
            showToast('Dihapus secara lokal.');
        }
    }
}

function openShareModal() {
    let app = dbApps.find(a => a.id === activeAppId);
    if (!app) return;
    document.getElementById('qrImg').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(app.downloadUrl)}`;
    document.getElementById('shareModal').classList.add('active');
}

function copyAppShareLink() {
    let app = dbApps.find(a => a.id === activeAppId);
    navigator.clipboard.writeText(app.downloadUrl);
    showToast('Tautan disalin!');
    closeModalDirect('shareModal');
}

function closeModal(e, modalId) {
    if (e.target === document.getElementById(modalId)) {
        document.getElementById(modalId).classList.remove('active');
    }
}

function closeModalDirect(modalId) { document.getElementById(modalId).classList.remove('active'); }

function showToast(msg) {
    let t = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}
