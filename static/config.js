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
        primary: '#111111',    // Hitam (Warna utama teks & tombol)
        success: '#10b981',    // Hijau Emerald (Indikator aktif, sukses)
        error: '#ef4444',      // Merah (Peringatan error)
        info: '#3b82f6',       // Biru (Informasi tambahan)
        background: '#fafafa', // Abu Muda (Latar belakang halaman)
        text: '#374151',       // Abu Gelap (Warna teks paragraf)
        border: '#e5e7eb',     // Abu Muda (Garis pembatas)
        surface: '#ffffff'     // Putih (Warna latar kartu/box)
    },

    // ==========================================
    // DAFTAR KATA (Edit di sini)
    // ==========================================
    wordList: [
        { id: 'cmd1', label: 'command1', message: 'command1' },
        { id: 'cmd2', label: 'command2', message: 'command2' },
        { id: 'cmd3', label: 'command3', message: 'command3' },
        { id: 'cmd4', label: 'command4', message: 'command4' },
        { id: 'cmd5', label: 'command5', message: 'command5' },
        { id: 'cmd6', label: 'command6', message: 'command6' },
        { id: 'cmd7', label: 'command7', message: 'command7' },
        { id: 'cmd8', label: 'command8', message: 'command8' },
    ],

    // ==========================================
    // PENGATURAN SENSOR
    // ==========================================
    sensorSettings: {
        shortBlink: {
            label: 'Kedip Cepat (Geser)',
            min: 0.1, max: 0.5, step: 0.1, default: 0.3,
            hint: 'Durasi kedip singkat untuk ganti kata.'
        },
        longBlink: {
            label: 'Kedip Tahan (Eksekusi)',
            min: 0.5, max: 1.5, step: 0.1, default: 0.6,
            hint: 'Durasi kedip lama untuk memilih kata.'
        },
        sensitivity: {
            label: 'Batas Deteksi Kedip', 
            min: 0.10, max: 0.30, step: 0.01, default: 0.20,
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
            btnSave: "Simpan Sementara"
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
            successTitle: "Diterapkan",
            successMessage: "Pengaturan diterapkan sementara. Akan reset jika halaman di-refresh.",
            errorTitle: "Error",
            errorMessage: "Gagal memuat library MediaPipe.",
            errorCamera: "Kamera Error"
        }
    }
};