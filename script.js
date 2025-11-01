document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('submission-form');
    const submitButton = document.getElementById('submit-button');
    const fileInput = document.getElementById('file_upload');

    // Batasan Formspree: Max 25MB untuk tier gratis (sesuaikan jika Anda memiliki paket berbayar)
    const MAX_FILE_SIZE_MB = 25; 
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    // 1. Validasi Ukuran File (Interaktif)
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const fileSize = this.files[0].size;
            if (fileSize > MAX_FILE_SIZE_BYTES) {
                alert(`Error: Ukuran file melebihi batas ${MAX_FILE_SIZE_MB}MB. Mohon gunakan file yang lebih kecil.`);
                this.value = ''; // Kosongkan input file
                submitButton.disabled = true;
            } else {
                submitButton.disabled = false;
            }
        }
    });

    // 2. Penanganan Pengiriman Formulir (AJAX)
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Cek final sebelum kirim
        if (fileInput.files.length === 0 || (fileInput.files.length > 0 && fileInput.files[0].size > MAX_FILE_SIZE_BYTES)) {
             alert('Mohon periksa kembali file Anda dan pastikan ukurannya tidak melebihi batas.');
             return;
        }

        // Siapkan UI saat mengirim
        submitButton.disabled = true;
        submitButton.textContent = 'Sedang Mengunggah dan Mengirim...';
        
        const data = new FormData(event.target);
        
        try {
            // Mengirim data ke Formspree
            const response = await fetch(event.target.action, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('🎉 Produk Pendidikan Anda berhasil dikirim ke email Perusahaan untuk ditinjau. Terima kasih!');
                form.reset(); // Kosongkan formulir setelah sukses
            } else {
                const errorData = await response.json();
                alert(`Gagal mengirim formulir. Error: ${errorData.error || 'Terjadi kesalahan umum.'}`);
            }
        } catch (error) {
            alert('Terjadi kesalahan jaringan atau koneksi. Mohon coba lagi.');
        } finally {
            // Kembalikan UI normal
            submitButton.disabled = false;
            submitButton.textContent = 'Kirim Produk untuk Ditinjau';
        }
    });
});
