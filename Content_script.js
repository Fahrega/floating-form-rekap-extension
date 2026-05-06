// Cek apakah widget sudah pernah di-inject sebelumnya
if (!document.getElementById('rekap-ext-widget')) {
    
    // 1. Desain UI Widget (Sistem Tab)
    const widgetHTML = `
        <!-- Header / Area Drag & Navigasi Tab -->
        <div id="rekap-ext-header" style="background-color: #f8fafc; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; cursor: grab; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 8px;">
                <button id="tab-form" style="background: #2563eb; color: white; border: none; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">✍️ Input</button>
                <button id="tab-list" style="background: #e2e8f0; color: #475569; border: none; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">📋 Daftar <span id="rekap-badge" style="background: #ef4444; color: white; border-radius: 10px; padding: 2px 6px; font-size: 10px; margin-left: 4px;">0</span></button>
            </div>
            <button id="rekap-ext-close" title="Tutup" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #64748b; padding: 0; line-height: 1;">&times;</button>
        </div>

        <!-- VIEW 1: Input Form -->
        <div id="rekap-view-form" style="padding: 16px; display: flex; flex-direction: column; gap: 12px; background: white;">
            <input type="text" id="rekap-resi" placeholder="1. No. Resi" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; box-sizing: border-box; outline: none;">
            <input type="text" id="rekap-invoice" placeholder="2. Invoice" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; box-sizing: border-box; outline: none;">
            <input type="text" id="rekap-nama" placeholder="3. Nama Customer" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; box-sizing: border-box; outline: none;">
            <input type="text" id="rekap-telp" placeholder="4. No. Telp" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; box-sizing: border-box; outline: none;">
            <input type="text" id="rekap-produk" placeholder="5. Produk" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; box-sizing: border-box; outline: none;">
            
            <button id="rekap-ext-add" style="width: 100%; padding: 10px; background-color: #f8fafc; color: #334155; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background-color 0.2s;">➕ Simpan ke Daftar</button>
            <div id="rekap-form-msg" style="text-align: center; font-size: 12px; color: #16a34a; min-height: 16px; font-weight: 500;"></div>
        </div>

        <!-- VIEW 2: Data List (Disembunyikan pada awalnya) -->
        <div id="rekap-view-list" style="padding: 16px; display: none; flex-direction: column; gap: 12px; background: white;">
            <div style="font-size: 12px; color: #475569; display: flex; justify-content: space-between; align-items: center;">
                <span>Total: <b id="rekap-ext-count">0</b> data</span>
                <span id="rekap-ext-clear" style="color: #ef4444; cursor: pointer; font-weight: 500; background: #fee2e2; padding: 4px 8px; border-radius: 4px;">Hapus Semua</span>
            </div>
            
            <!-- Area List yang bisa di-scroll secara vertikal -->
            <div style="max-height: 210px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; background: #f8fafc;">
                <div id="rekap-empty-state" style="text-align: center; font-size: 12px; color: #94a3b8; padding: 20px 0;">Belum ada data di daftar</div>
                <div id="rekap-ext-list" style="display: flex; flex-direction: column; gap: 6px;"></div>
            </div>
            
            <button id="rekap-ext-copy" style="width: 100%; padding: 12px; background-color: #2563eb; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background-color 0.2s;">📋 Salin Semua ke Spreadsheet</button>
            <div id="rekap-list-msg" style="text-align: center; font-size: 12px; color: #16a34a; min-height: 16px; font-weight: 500;"></div>
        </div>
    `;

    // 2. Buat container untuk widget dan tempel ke halaman web
    const widget = document.createElement('div');
    widget.id = 'rekap-ext-widget';
    widget.style.cssText = 'position: fixed; top: 20px; right: 20px; width: 320px; background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border: 1px solid #e2e8f0; z-index: 2147483647; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: column; overflow: hidden;';
    widget.innerHTML = widgetHTML;
    document.body.appendChild(widget);

    // 3. Logika Drag and Drop
    const header = document.getElementById('rekap-ext-header');
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
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

    // 4. LOGIKA TAB MENU
    const tabForm = document.getElementById('tab-form');
    const tabList = document.getElementById('tab-list');
    const viewForm = document.getElementById('rekap-view-form');
    const viewList = document.getElementById('rekap-view-list');

    tabForm.addEventListener('click', () => {
        viewForm.style.display = 'flex';
        viewList.style.display = 'none';
        tabForm.style.background = '#2563eb'; tabForm.style.color = 'white';
        tabList.style.background = '#e2e8f0'; tabList.style.color = '#475569';
    });

    tabList.addEventListener('click', () => {
        viewForm.style.display = 'none';
        viewList.style.display = 'flex';
        tabList.style.background = '#2563eb'; tabList.style.color = 'white';
        tabForm.style.background = '#e2e8f0'; tabForm.style.color = '#475569';
    });

    // 5. Array Data & Tutup Widget
    let dataKumpulan = [];

    document.getElementById('rekap-ext-close').addEventListener('click', () => {
        widget.style.display = 'none';
    });

    // 6. Logika Tambah Data ke Daftar
    document.getElementById('rekap-ext-add').addEventListener('click', () => {
        const resi = document.getElementById('rekap-resi').value || '';
        const invoice = document.getElementById('rekap-invoice').value || '';
        const nama = document.getElementById('rekap-nama').value || '';
        const telp = document.getElementById('rekap-telp').value || '';
        const produk = document.getElementById('rekap-produk').value || '';

        if (!resi && !invoice && !nama) return;

        dataKumpulan.push({ resi, invoice, nama, telp, produk });

        // Update UI
        document.getElementById('rekap-badge').innerText = dataKumpulan.length;
        document.getElementById('rekap-ext-count').innerText = dataKumpulan.length;
        document.getElementById('rekap-empty-state').style.display = 'none';

        const item = document.createElement('div');
        item.style.cssText = 'font-size: 11px; color: #334155; background: white; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px;';
        item.innerHTML = `<b>${nama || 'Tanpa Nama'}</b><br><span style="color:#64748b">${resi || 'Tanpa Resi'}</span>`;
        document.getElementById('rekap-ext-list').prepend(item); 

        const msgForm = document.getElementById('rekap-form-msg');
        msgForm.innerText = '✓ Berhasil disimpan ke daftar!';
        setTimeout(() => { msgForm.innerText = ''; }, 2000);

        document.getElementById('rekap-resi').value = '';
        document.getElementById('rekap-invoice').value = '';
        document.getElementById('rekap-nama').value = '';
        document.getElementById('rekap-telp').value = '';
        document.getElementById('rekap-produk').value = '';
        document.getElementById('rekap-resi').focus();
    });

    // 7. Logika Hapus Semua
    document.getElementById('rekap-ext-clear').addEventListener('click', () => {
        if(confirm('Yakin ingin menghapus semua data di daftar?')) {
            dataKumpulan = [];
            document.getElementById('rekap-badge').innerText = '0';
            document.getElementById('rekap-ext-count').innerText = '0';
            document.getElementById('rekap-ext-list').innerHTML = '';
            document.getElementById('rekap-empty-state').style.display = 'block';
        }
    });

    // 8. Logika Salin SEMUA
    document.getElementById('rekap-ext-copy').addEventListener('click', () => {
        if (dataKumpulan.length === 0) {
            document.getElementById('rekap-list-msg').innerText = '⚠️ Daftar masih kosong!';
            document.getElementById('rekap-list-msg').style.color = '#eab308';
            setTimeout(() => { document.getElementById('rekap-list-msg').innerText = ''; }, 2000);
            return;
        }

        const textToCopy = dataKumpulan.map(data => 
            `${data.resi}\t${data.invoice}\t${data.nama}\t${data.telp}\t${data.produk}`
        ).join('\n');

        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            
            const copyBtn = document.getElementById('rekap-ext-copy');
            const originalText = copyBtn.innerText;
            copyBtn.innerText = `✓ ${dataKumpulan.length} Data Tersalin!`;
            copyBtn.style.backgroundColor = '#16a34a';
            
            document.getElementById('rekap-list-msg').innerText = 'Data berhasil disalin!';
            document.getElementById('rekap-list-msg').style.color = '#16a34a';

            setTimeout(() => {
                copyBtn.innerText = originalText;
                copyBtn.style.backgroundColor = '#2563eb';
                document.getElementById('rekap-list-msg').innerText = '';
            }, 2000);
            
        } catch (err) {
            document.getElementById('rekap-list-msg').innerText = '❌ Gagal menyalin';
            document.getElementById('rekap-list-msg').style.color = '#ef4444';
        }
        
        document.body.removeChild(textarea);
    });

} else {
    // Jika widget sudah ada, tampilkan atau sembunyikan saat ikon diklik
    const widget = document.getElementById('rekap-ext-widget');
    widget.style.display = widget.style.display === 'none' ? 'flex' : 'none';
}