const APP_DATA = {
    // ==========================================
    // IDENTITAS APLIKASI
    // ==========================================
    header: {
        title: "ViSpeak",
        subtitle: "Speak With Eyes",
        icon: "fa-eye text-gray-600"
    },

    // ==========================================
    // TEMA WARNA
    // ==========================================
    colors: {
        primary: '#111111',    // Hitam (Warna Utama)
        success: '#10b981',    // Hijau (Sukses/Aktif)
        error: '#ef4444',      // Merah (Error)
        info: '#3b82f6',       // Biru
        background: '#fafafa', // Abu Muda (Latar Belakang)
        text: '#374151',       // Abu Teks
        border: '#e5e7eb',     // Abu Garis
        surface: '#ffffff'     // Putih (Kartu)
    },

    // ==========================================
    // DAFTAR KATA
    // ==========================================
    wordList: [
        { id: 'command1', label: 'command1', message: 'command1' },
        { id: 'command2', label: 'command2', message: 'command2' },
        { id: 'command3', label: 'command3', message: 'command3' },
        { id: 'command4', label: 'command4', message: 'command4' },
        { id: 'command5', label: 'command5', message: 'command5' },
        { id: 'command6', label: 'command6', message: 'command6' },
        { id: 'command7', label: 'command7', message: 'command7' },
        { id: 'command8', label: 'command8', message: 'command8' },
    ],

    // ==========================================
    // PENGATURAN SENSOR
    // ==========================================
    sensorSettings: {
        shortBlink: {
            label: 'Kedip Cepat (Geser)',
            min: 0.1, max: 0.5, step: 0.1, default: 0.2,
            hint: 'Durasi kedip singkat untuk ganti kata.'
        },
        longBlink: {
            label: 'Kedip Tahan (Eksekusi)',
            min: 0.5, max: 1.0, step: 0.1, default: 0.7,
            hint: 'Durasi kedip lama untuk memilih kata.'
        },
        sensitivity: {
            label: 'Batas Deteksi Kedip', 
            min: 0.10, max: 0.30, step: 0.01, default: 0.27,
            hint: 'Kalau sering "kedip" sendiri (mata sipit), TURUNKAN nilai ini. Kalau sulit terdeteksi, NAIKKAN.'
        }
    },

    // ==========================================
    // TEKS TOMBOL & LABEL
    // ==========================================
    texts: {
        loading: { title: "Memuat...", subtitle: "Persiapkan kamera." },
        main: {
            labelAction: "AKSI...",
            labelSlot: "Slot",
            statusActive: "Sensor Aktif",
            statusDetecting: "Mencari Wajah...",
            statusProcessing: "Proses...",
            statusWaiting: "Kamera Mati",
            instruction: "Kedip Cepat = Geser. Kedip Tahan = Pilih.",
            hintCameraOff: "Tekan tombol kamera untuk mulai.",
            btnCameraOn: "Nyalakan Kamera",
            btnCameraOff: "Matikan Kamera"
        },
        settings: {
            title: "Pengaturan",
            subtitle: "Atur kepekaan sensor di sini.",
            labelWordList: "Edit Kata-Kata",
            labelSensor: "Atur Sensor",
            placeholder: "Tulis pesan...",
            btnSave: "Simpan"
        },
        info: {
            title: "Panduan",
            subtitle: "Cara pakai aplikasi.",
            steps: [
                { title: "1. Nyalakan Kamera", desc: "Izinkan akses kamera di browser." },
                { title: "2. Deteksi Mata", desc: "Arahkan wajah ke kamera." },
                { title: "3. Kedip", desc: "Kedip untuk memilih kata." }
            ],
            privacy: {
                title: "Privasi Aman",
                desc: "Data diproses di browser, tidak ada yang terkirim ke server.",
                status: "0 KB DATA KELUAR"
            }
        },
        dialog: {
            successTitle: "Sukses",
            successMessage: "Pengaturan sudah disimpan di browser.",
            errorTitle: "Error",
            errorMessage: "Gagal memuat library.",
            errorCamera: "Kamera Error"
        }
    }
};