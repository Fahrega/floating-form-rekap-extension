if (!document.getElementById('rekap-ext-widget')) {

    const DEFAULT_TOKO = [
        'Berkah Jaya Store',
        'Rizki Official',
        'Maju Bersama Shop',
        'Toko Sejahtera',
        'Karya Mandiri',
        'Sinar Abadi Shop',
        'Toko Makmur Jaya',
        'Harapan Jaya Store',
    ];

    const INPUT_STYLE = 'padding:5px 8px;border:1px solid #cbd5e1;border-radius:5px;font-size:12px;box-sizing:border-box;outline:none;width:100%;';

    const widgetHTML = `
        <div id="rekap-ext-header" style="background:#f8fafc;padding:7px 10px;border-bottom:1px solid #e2e8f0;cursor:grab;display:flex;justify-content:space-between;align-items:center;gap:4px;">
            <div style="display:flex;gap:4px;flex:1;min-width:0;">
                <button id="tab-form" style="background:#2563eb;color:white;border:none;padding:4px 8px;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;">✍️ Input</button>
                <button id="tab-list" style="background:#e2e8f0;color:#475569;border:none;padding:4px 8px;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;">📋 Rekap <span id="rekap-badge" style="background:#ef4444;color:white;border-radius:10px;padding:1px 5px;font-size:10px;margin-left:2px;">0</span></button>
                <button id="tab-toko" style="background:#e2e8f0;color:#475569;border:none;padding:4px 8px;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;">🏪 Toko</button>
            </div>
            <button id="rekap-ext-close" title="Tutup" style="background:none;border:none;font-size:16px;cursor:pointer;color:#64748b;padding:0;line-height:1;flex-shrink:0;">&times;</button>
        </div>

        <!-- VIEW 1: Input Form -->
        <div id="rekap-view-form" style="padding:10px;display:flex;flex-direction:column;gap:6px;background:white;overflow-y:auto;max-height:430px;">
            <div>
                <label style="font-size:10px;color:#64748b;font-weight:700;display:block;margin-bottom:2px;text-transform:uppercase;letter-spacing:0.5px;">Toko</label>
                <select id="rekap-toko" style="${INPUT_STYLE}border-color:#2563eb;color:#1e3a8a;font-weight:600;background:white;"></select>
            </div>
            <input type="date" id="rekap-tanggal" style="${INPUT_STYLE}">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                <input type="text" id="rekap-invoice" placeholder="Invoice / Id Pesanan" style="${INPUT_STYLE}width:auto;">
                <input type="text" id="rekap-resi" placeholder="No. Resi" style="${INPUT_STYLE}width:auto;">
            </div>
            <input type="text" id="rekap-nama" placeholder="Nama Customer" style="${INPUT_STYLE}">
            <input type="text" id="rekap-telp" placeholder="Nomor Telepon" style="${INPUT_STYLE}">
            <textarea id="rekap-alamat" placeholder="Alamat" rows="2" style="${INPUT_STYLE}resize:none;font-family:inherit;"></textarea>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                <input type="text" id="rekap-produk" placeholder="Produk (SKU)" style="${INPUT_STYLE}width:auto;">
                <input type="text" id="rekap-total" placeholder="Total Pembayaran" style="${INPUT_STYLE}width:auto;">
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                <input type="text" id="rekap-platform" placeholder="Platform" style="${INPUT_STYLE}width:auto;">
                <input type="text" id="rekap-ekspedisi" placeholder="Ekspedisi" style="${INPUT_STYLE}width:auto;">
            </div>
            <input type="text" id="rekap-metode" placeholder="Metode Pembayaran" style="${INPUT_STYLE}">
            <button id="rekap-ext-add" style="width:100%;padding:7px;background:#f8fafc;color:#334155;border:1px solid #cbd5e1;border-radius:5px;font-weight:600;font-size:12px;cursor:pointer;">➕ Simpan ke Rekap</button>
            <div id="rekap-form-msg" style="text-align:center;font-size:11px;color:#16a34a;min-height:14px;font-weight:500;"></div>
        </div>

        <!-- VIEW 2: Rekap List -->
        <div id="rekap-view-list" style="padding:10px;display:none;flex-direction:column;gap:8px;background:white;">
            <div style="font-size:11px;color:#475569;display:flex;justify-content:space-between;align-items:center;">
                <span>Total: <b id="rekap-ext-count">0</b> data</span>
                <span id="rekap-ext-clear" style="color:#ef4444;cursor:pointer;font-weight:500;background:#fee2e2;padding:3px 7px;border-radius:4px;font-size:11px;">Hapus Semua</span>
            </div>
            <div style="max-height:210px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:5px;padding:6px;background:#f8fafc;">
                <div id="rekap-empty-state" style="text-align:center;font-size:11px;color:#94a3b8;padding:16px 0;">Belum ada data</div>
                <div id="rekap-ext-list" style="display:flex;flex-direction:column;gap:5px;"></div>
            </div>
            <button id="rekap-ext-copy" style="width:100%;padding:9px;background:#2563eb;color:white;border:none;border-radius:5px;font-weight:600;font-size:12px;cursor:pointer;">📋 Salin Semua ke Spreadsheet</button>
            <div id="rekap-list-msg" style="text-align:center;font-size:11px;color:#16a34a;min-height:14px;font-weight:500;"></div>
        </div>

        <!-- VIEW 3: Manajemen Toko -->
        <div id="rekap-view-toko" style="padding:10px;display:none;flex-direction:column;gap:8px;background:white;">
            <div style="display:flex;gap:6px;">
                <input type="text" id="rekap-toko-baru" placeholder="Nama toko baru..." style="${INPUT_STYLE}border-radius:5px;">
                <button id="rekap-toko-tambah" style="padding:5px 10px;background:#2563eb;color:white;border:none;border-radius:5px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0;">+ Tambah</button>
            </div>
            <input type="text" id="rekap-toko-search" placeholder="🔍 Cari toko..." style="${INPUT_STYLE}">
            <div style="max-height:280px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:5px;background:#f8fafc;">
                <div id="rekap-toko-empty" style="text-align:center;font-size:11px;color:#94a3b8;padding:16px 0;display:none;">Tidak ada toko</div>
                <div id="rekap-toko-list" style="display:flex;flex-direction:column;"></div>
            </div>
            <div id="rekap-toko-msg" style="text-align:center;font-size:11px;color:#16a34a;min-height:14px;font-weight:500;"></div>
        </div>
    `;

    const widget = document.createElement('div');
    widget.id = 'rekap-ext-widget';
    widget.style.cssText = 'position:fixed;top:20px;right:20px;width:300px;background:white;border-radius:10px;box-shadow:0 8px 20px rgba(0,0,0,0.15);border:1px solid #e2e8f0;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;display:none;flex-direction:column;overflow:hidden;';
    widget.innerHTML = widgetHTML;
    document.body.appendChild(widget);

    let dataKumpulan = [];
    let daftarToko = [];

    // ── Helpers ──────────────────────────────────────────────────────────

    function rebuildTokoSelect(selectedVal) {
        const sel = document.getElementById('rekap-toko');
        const prev = selectedVal !== undefined ? selectedVal : sel.value;
        sel.innerHTML = daftarToko.map(t => `<option value="${t}">${t}</option>`).join('');
        if (daftarToko.includes(prev)) sel.value = prev;
    }

    function renderTokoList(filter) {
        const listEl = document.getElementById('rekap-toko-list');
        const emptyEl = document.getElementById('rekap-toko-empty');
        const q = (filter || '').toLowerCase();
        const filtered = daftarToko.filter(t => t.toLowerCase().includes(q));
        listEl.innerHTML = '';
        emptyEl.style.display = filtered.length === 0 ? 'block' : 'none';
        filtered.forEach(nama => {
            const row = document.createElement('div');
            row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#334155;';
            row.innerHTML = `<span>${nama}</span><button data-toko="${nama}" style="background:none;border:none;cursor:pointer;color:#ef4444;font-size:14px;padding:0 2px;line-height:1;">×</button>`;
            row.querySelector('button').addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.toko;
                daftarToko = daftarToko.filter(t => t !== target);
                chrome.storage.local.set({ rekapTokoList: daftarToko });
                rebuildTokoSelect();
                renderTokoList(document.getElementById('rekap-toko-search').value);
            });
            listEl.appendChild(row);
        });
    }

    function buildListItem(d) {
        const item = document.createElement('div');
        item.style.cssText = 'font-size:10px;color:#334155;background:white;padding:5px 6px;border:1px solid #cbd5e1;border-radius:4px;line-height:1.5;';
        item.innerHTML = `<b>${d.nama || 'Tanpa Nama'}</b> — <span style="color:#2563eb">${d.toko}</span><br><span style="color:#64748b">${d.invoice || '-'} | ${d.resi || '-'} | ${d.platform || '-'}</span>`;
        return item;
    }

    function refreshRekapUI() {
        const listEl = document.getElementById('rekap-ext-list');
        listEl.innerHTML = '';
        dataKumpulan.forEach(d => listEl.appendChild(buildListItem(d)));
        const count = dataKumpulan.length;
        document.getElementById('rekap-badge').innerText = count;
        document.getElementById('rekap-ext-count').innerText = count;
        document.getElementById('rekap-empty-state').style.display = count > 0 ? 'none' : 'block';
    }

    // ── Tab switching ─────────────────────────────────────────────────────

    const tabs = {
        form: { btn: null, view: null },
        list: { btn: null, view: null },
        toko: { btn: null, view: null },
    };

    function switchTab(active) {
        Object.entries(tabs).forEach(([key, t]) => {
            const isActive = key === active;
            t.btn.style.background = isActive ? '#2563eb' : '#e2e8f0';
            t.btn.style.color = isActive ? 'white' : '#475569';
            t.view.style.display = isActive ? 'flex' : 'none';
        });
    }

    // ── Restore from storage ──────────────────────────────────────────────

    chrome.storage.local.get(['rekapData', 'rekapToko', 'rekapTanggal', 'rekapOpen', 'rekapTokoList'], (result) => {
        daftarToko = (result.rekapTokoList && result.rekapTokoList.length > 0)
            ? result.rekapTokoList
            : [...DEFAULT_TOKO];

        rebuildTokoSelect(result.rekapToko || daftarToko[0]);
        renderTokoList('');

        if (result.rekapData && result.rekapData.length > 0) {
            dataKumpulan = result.rekapData;
            refreshRekapUI();
        }
        if (result.rekapTanggal) {
            document.getElementById('rekap-tanggal').value = result.rekapTanggal;
        }
        if (result.rekapOpen) {
            widget.style.display = 'flex';
        }

        // Wire tabs after DOM ready
        tabs.form.btn  = document.getElementById('tab-form');
        tabs.form.view = document.getElementById('rekap-view-form');
        tabs.list.btn  = document.getElementById('tab-list');
        tabs.list.view = document.getElementById('rekap-view-list');
        tabs.toko.btn  = document.getElementById('tab-toko');
        tabs.toko.view = document.getElementById('rekap-view-toko');

        tabs.form.btn.addEventListener('click', () => switchTab('form'));
        tabs.list.btn.addEventListener('click', () => switchTab('list'));
        tabs.toko.btn.addEventListener('click', () => switchTab('toko'));
    });

    // ── Sync lintas tab ───────────────────────────────────────────────────

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'local') return;
        if (changes.rekapData) {
            dataKumpulan = changes.rekapData.newValue || [];
            refreshRekapUI();
        }
        if (changes.rekapTokoList) {
            daftarToko = changes.rekapTokoList.newValue || [];
            rebuildTokoSelect();
            renderTokoList(document.getElementById('rekap-toko-search').value);
        }
    });

    // ── Toggle from toolbar ───────────────────────────────────────────────

    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.action === 'toggle') {
            const willShow = widget.style.display === 'none';
            widget.style.display = willShow ? 'flex' : 'none';
            chrome.storage.local.set({ rekapOpen: willShow });
        }
    });

    // ── Drag ──────────────────────────────────────────────────────────────

    const header = document.getElementById('rekap-ext-header');
    let isDragging = false, offsetX, offsetY;
    header.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        isDragging = true;
        header.style.cursor = 'grabbing';
        const rect = widget.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        widget.style.left = (e.clientX - offsetX) + 'px';
        widget.style.top = (e.clientY - offsetY) + 'px';
        widget.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        header.style.cursor = 'grab';
    });

    // ── Close ─────────────────────────────────────────────────────────────

    document.getElementById('rekap-ext-close').addEventListener('click', () => {
        widget.style.display = 'none';
        chrome.storage.local.set({ rekapOpen: false });
    });

    // ── Toko persist on change ────────────────────────────────────────────

    document.getElementById('rekap-toko').addEventListener('change', () => {
        chrome.storage.local.set({ rekapToko: document.getElementById('rekap-toko').value });
    });

    document.getElementById('rekap-tanggal').addEventListener('change', () => {
        chrome.storage.local.set({ rekapTanggal: document.getElementById('rekap-tanggal').value });
    });

    // ── Tambah toko baru ──────────────────────────────────────────────────

    document.getElementById('rekap-toko-tambah').addEventListener('click', () => {
        const input = document.getElementById('rekap-toko-baru');
        const nama = input.value.trim();
        const msg = document.getElementById('rekap-toko-msg');
        if (!nama) return;
        if (daftarToko.includes(nama)) {
            msg.innerText = '⚠️ Toko sudah ada!';
            msg.style.color = '#eab308';
            setTimeout(() => { msg.innerText = ''; }, 2000);
            return;
        }
        daftarToko.push(nama);
        chrome.storage.local.set({ rekapTokoList: daftarToko });
        rebuildTokoSelect();
        renderTokoList(document.getElementById('rekap-toko-search').value);
        input.value = '';
        msg.innerText = `✓ "${nama}" ditambahkan!`;
        msg.style.color = '#16a34a';
        setTimeout(() => { msg.innerText = ''; }, 2000);
    });

    document.getElementById('rekap-toko-baru').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('rekap-toko-tambah').click();
    });

    // ── Search toko ───────────────────────────────────────────────────────

    document.getElementById('rekap-toko-search').addEventListener('input', (e) => {
        renderTokoList(e.target.value);
    });

    // ── Simpan data ───────────────────────────────────────────────────────

    document.getElementById('rekap-ext-add').addEventListener('click', () => {
        const tanggal   = document.getElementById('rekap-tanggal').value || '';
        const invoice   = document.getElementById('rekap-invoice').value || '';
        const resi      = document.getElementById('rekap-resi').value || '';
        const nama      = document.getElementById('rekap-nama').value || '';
        const telp      = document.getElementById('rekap-telp').value || '';
        const alamat    = document.getElementById('rekap-alamat').value || '';
        const produk    = document.getElementById('rekap-produk').value || '';
        const total     = document.getElementById('rekap-total').value || '';
        const platform  = document.getElementById('rekap-platform').value || '';
        const toko      = document.getElementById('rekap-toko').value || '';
        const ekspedisi = document.getElementById('rekap-ekspedisi').value || '';
        const metode    = document.getElementById('rekap-metode').value || '';

        if (!invoice && !resi && !nama) return;

        dataKumpulan.push({ tanggal, invoice, resi, nama, telp, alamat, produk, total, platform, toko, ekspedisi, metode });
        chrome.storage.local.set({ rekapData: dataKumpulan, rekapToko: toko, rekapTanggal: tanggal });
        refreshRekapUI();

        const msgEl = document.getElementById('rekap-form-msg');
        msgEl.innerText = '✓ Berhasil disimpan!';
        setTimeout(() => { msgEl.innerText = ''; }, 2000);

        ['rekap-invoice','rekap-resi','rekap-nama','rekap-telp','rekap-alamat',
         'rekap-produk','rekap-total','rekap-platform','rekap-ekspedisi','rekap-metode']
        .forEach(id => { document.getElementById(id).value = ''; });

        document.getElementById('rekap-invoice').focus();
    });

    // ── Hapus semua rekap ─────────────────────────────────────────────────

    document.getElementById('rekap-ext-clear').addEventListener('click', () => {
        if (confirm('Yakin ingin menghapus semua data rekap?')) {
            dataKumpulan = [];
            chrome.storage.local.set({ rekapData: [] });
            refreshRekapUI();
        }
    });

    // ── Salin semua ───────────────────────────────────────────────────────

    document.getElementById('rekap-ext-copy').addEventListener('click', () => {
        const msg = document.getElementById('rekap-list-msg');
        if (dataKumpulan.length === 0) {
            msg.innerText = '⚠️ Daftar masih kosong!';
            msg.style.color = '#eab308';
            setTimeout(() => { msg.innerText = ''; }, 2000);
            return;
        }

        const escapeCell = (v) => {
            const s = String(v ?? '');
            if (s.includes('\t') || s.includes('\n') || s.includes('"')) {
                return '"' + s.replace(/"/g, '""') + '"';
            }
            return s;
        };

        const textToCopy = dataKumpulan.map(d =>
            [
                escapeCell(d.tanggal),
                escapeCell(d.invoice),
                d.resi ? "'" + d.resi : '',
                escapeCell(d.nama),
                escapeCell(d.telp),
                escapeCell(d.alamat),
                escapeCell(d.produk),
                escapeCell(d.total),
                escapeCell(d.platform),
                escapeCell(d.toko),
                escapeCell(d.ekspedisi),
                escapeCell(d.metode),
            ].join('\t')
        ).join('\n');

        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            const copyBtn = document.getElementById('rekap-ext-copy');
            const original = copyBtn.innerText;
            copyBtn.innerText = `✓ ${dataKumpulan.length} Data Tersalin!`;
            copyBtn.style.backgroundColor = '#16a34a';
            msg.innerText = 'Data berhasil disalin!';
            msg.style.color = '#16a34a';
            setTimeout(() => {
                copyBtn.innerText = original;
                copyBtn.style.backgroundColor = '#2563eb';
                msg.innerText = '';
            }, 2000);
        } catch (err) {
            msg.innerText = '❌ Gagal menyalin';
            msg.style.color = '#ef4444';
        }

        document.body.removeChild(textarea);
    });

    // ── Auto-show flag (fallback inject) ──────────────────────────────────

    if (window.__rekapAutoShow) {
        widget.style.display = 'flex';
        window.__rekapAutoShow = false;
        chrome.storage.local.set({ rekapOpen: true });
    }

} else {
    const widget = document.getElementById('rekap-ext-widget');
    if (widget.style.display === 'none') {
        widget.style.display = 'flex';
        chrome.storage.local.set({ rekapOpen: true });
    }
}
