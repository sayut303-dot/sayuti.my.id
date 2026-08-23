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
        "downloads": 4120,
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
    }
];

let favorites = JSON.parse(localStorage.getItem('sayuti_favs') || '[]');
let currentCategory = 'all';
let activeAppId = null;
let selectedRating = 5;

document.addEventListener('DOMContentLoaded', () => {
    renderApps();
    updateFavBadge();
});

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

    let iconContent = app.icon && app.icon.startsWith('fa-') 
        ? `<i class="fa-solid ${app.icon}"></i>` 
        : `<img src="${app.icon}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" alt="${app.title}">`;

    document.getElementById('detailTitle').innerText = app.title;
    document.getElementById('detailDesc').innerText = app.fullDesc;
    document.getElementById('detailVersion').innerText = app.version;
    document.getElementById('detailFormat').innerText = app.format;
    document.getElementById('detailDownloads').innerText = app.downloads;
    document.getElementById('detailChangelog').innerText = app.changelog;
    document.getElementById('detailIcon').innerHTML = iconContent;
    document.getElementById('detailDownloadBtn').href = app.downloadUrl;

    renderReviews(app);
    document.getElementById('detailModal').classList.add('active');
}

function triggerDownload(event, appId) {
    event.stopPropagation();
    let app = dbApps.find(appIdKey => app.id === appId); 
    let githubToken = localStorage.getItem('sayuti_gh_token');
    if (app) {
        app.downloads++;
        if (githubToken) updateMainJsOnGitHub(githubToken).catch(e => {});
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

async function submitReview() {
    let name = document.getElementById('reviewName').value.trim();
    let comment = document.getElementById('reviewComment').value.trim();
    if (!name || !comment) { alert('Nama dan ulasan wajib diisi.'); return; }
    let app = dbApps.find(a => a.id === activeAppId);
    if (!app.reviews) app.reviews = [];
    app.reviews.push({ name, rating: selectedRating, comment });
    
    renderReviews(app);
    renderApps();
    document.getElementById('reviewName').value = '';
    document.getElementById('reviewComment').value = '';
    showToast('Ulasan terkirim!');

    let githubToken = localStorage.getItem('sayuti_gh_token');
    if (githubToken) {
        try { await updateMainJsOnGitHub(githubToken); } catch(e) {}
    }
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
        document.getElementById('inputIcon').value = app.icon && app.icon.startsWith('fa-') ? app.icon : '';
        document.getElementById('inputShortDesc').value = app.shortDesc;
        document.getElementById('inputFullDesc').value = app.fullDesc;
        document.getElementById('inputVersion').value = app.version;
        document.getElementById('inputFormat').value = app.format;
        document.getElementById('inputDownloadUrl').value = app.downloadUrl;
        document.getElementById('inputChangelog').value = app.changelog;
    } else {
        document.getElementById('formModalTitle').innerText = "Tambah Aplikasi";
        document.getElementById('inputTitle').value = '';
        document.getElementById('inputIcon').value = '';
        document.getElementById('inputShortDesc').value = '';
        document.getElementById('inputFullDesc').value = '';
        document.getElementById('inputVersion').value = '';
        document.getElementById('inputFormat').value = '';
        document.getElementById('inputDownloadUrl').value = '';
        document.getElementById('inputChangelog').value = '';
        if(document.getElementById('inputApkFile')) document.getElementById('inputApkFile').value = '';
        if(document.getElementById('inputIconFile')) document.getElementById('inputIconFile').value = '';
    }
    document.getElementById('appFormModal').classList.add('active');
}

async function saveAppFromForm() {
    let id = document.getElementById('editAppId').value;
    let title = document.getElementById('inputTitle').value.trim();
    let apkFileInput = document.getElementById('inputApkFile') ? document.getElementById('inputApkFile').files[0] : null;
    let iconFileInput = document.getElementById('inputIconFile') ? document.getElementById('inputIconFile').files[0] : null;
    let githubToken = document.getElementById('inputGithubToken') ? document.getElementById('inputGithubToken').value.trim() : '';
    
    if (!title) { alert('Nama aplikasi wajib diisi'); return; }
    if (!githubToken) { alert('GitHub Token wajib diisi untuk sinkronisasi publik!'); return; }

    localStorage.setItem('sayuti_gh_token', githubToken);

    let downloadUrl = document.getElementById('inputDownloadUrl').value || '#';
    let format = document.getElementById('inputFormat').value || 'APK File';
    let iconValue = document.getElementById('inputIcon').value.trim() || 'fa-cube';
    let repoOwnerAndName = 'sayut303-dot/sayuti.my.id';

    if (apkFileInput) {
        showToast('Mengunggah file APK ke GitHub...');
        try {
            let base64Content = await toBase64(apkFileInput);
            let fileName = apkFileInput.name;
            
            let existingSha = null;
            let checkRes = await fetch(`https://api.github.com/repos/${repoOwnerAndName}/contents/${fileName}`, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (checkRes.ok) {
                let fileData = await checkRes.json();
                existingSha = fileData.sha;
            }

            let bodyData = {
                message: `Upload ${fileName} via Admin Panel SayutiHub`,
                content: base64Content
            };
            if (existingSha) {
                bodyData.sha = existingSha;
            }
            
            let response = await fetch(`https://api.github.com/repos/${repoOwnerAndName}/contents/${fileName}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData)
            });

            if (response.ok) {
                downloadUrl = fileName; 
                format = 'APK File';
                showToast('APK Berhasil di-upload!');
            } else {
                let errData = await response.json();
                alert('Gagal upload APK: ' + (errData.message || 'Periksa token Anda.'));
                return;
            }
        } catch (error) {
            alert('Terjadi kesalahan jaringan saat upload APK.');
            return;
        }
    }

    if (iconFileInput) {
        showToast('Mengunggah logo aplikasi...');
        try {
            let base64Icon = await toBase64(iconFileInput);
            let iconFileName = 'logo_' + Date.now() + '_' + iconFileInput.name;
            
            let existingShaIcon = null;
            let checkIconRes = await fetch(`https://api.github.com/repos/${repoOwnerAndName}/contents/${iconFileName}`, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (checkIconRes.ok) {
                let fileDataIcon = await checkIconRes.json();
                existingShaIcon = fileDataIcon.sha;
            }

            let bodyIconData = {
                message: `Upload logo ${iconFileName} via Admin Panel`,
                content: base64Icon
            };
            if (existingShaIcon) {
                bodyIconData.sha = existingShaIcon;
            }
            
            let responseIcon = await fetch(`https://api.github.com/repos/${repoOwnerAndName}/contents/${iconFileName}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyIconData)
            });

            if (responseIcon.ok) {
                iconValue = iconFileName;
                showToast('Logo berhasil di-upload!');
            } else {
                let errData = await responseIcon.json();
                alert('Gagal upload logo: ' + (errData.message || 'Periksa token.'));
                return;
            }
        } catch (error) {
            alert('Terjadi kesalahan jaringan saat upload logo.');
            return;
        }
    }

    let appData = {
        title,
        category: document.getElementById('inputCategory').value,
        status: document.getElementById('inputStatus').value,
        icon: iconValue,
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
        appData.reviews = [
