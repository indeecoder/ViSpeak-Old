document.addEventListener('alpine:init', () => {
    Alpine.data('appData', () => ({

        // State Variables
        currentView: 'main',
        isLoading: false,
        isTracking: false,
        cameraOn: false,
        cameraInstance: null,
        outputText: 'Menunggu...',

        // Data binding dari config
        commands: JSON.parse(JSON.stringify(APP_DATA.wordList)),
        currentIndex: 0,
        animationClass: '',

        // Setting default dari config
        shortBlinkDurationSeconds: APP_DATA.sensorSettings.shortBlink.default,
        longBlinkDurationSeconds: APP_DATA.sensorSettings.longBlink.default,
        blinkThreshold: APP_DATA.sensorSettings.sensitivity.default,

        // Tracking State
        blinkStartTime: null,
        isBlinking: false,
        isHoldingBlink: false,
        holdPercentage: 0,
        lastActionTime: 0,
        cooldownDuration: 2000,
        isInCooldown: false,

        // Dialog State
        showDialog: false,
        dialogTitle: '',
        dialogMessage: '',
        dialogType: 'info',

        // Computed Property
        get currentScanningCommand() {
            return this.commands[this.currentIndex];
        },

        // INIT
        initApp() {
            console.log("App started. Using config:", APP_DATA);
        },

        getStatusText() {
            if (this.isInCooldown) return APP_DATA.texts.main.statusProcessing;
            if (this.cameraOn && this.isTracking) return APP_DATA.texts.main.statusActive;
            if (this.cameraOn) return APP_DATA.texts.main.statusDetecting;
            return APP_DATA.texts.main.statusWaiting;
        },

        openDialog(title, message, type = 'info') {
            this.dialogTitle = title;
            this.dialogMessage = message;
            this.dialogType = type;
            this.showDialog = true;
        },
        closeDialog() { this.showDialog = false; },

        performSwipeAndNext() {
            if (this.isInCooldown) return;
            this.animationClass = 'animate-swipe-out';
            setTimeout(() => {
                this.currentIndex = (this.currentIndex + 1) % this.commands.length;
                this.animationClass = 'animate-swipe-in';
                setTimeout(() => { this.animationClass = ''; }, 300);
            }, 300);
        },

        async toggleCamera() {
            if (this.cameraOn) {
                this.cameraOn = false; this.isTracking = false; this.isInCooldown = false; this.blinkStartTime = null;
                if (this.cameraInstance) await this.cameraInstance.stop();
                const v = document.getElementById('input_video');
                const p = document.getElementById('preview_video');
                if (v.srcObject) {
                    v.srcObject.getTracks().forEach(t => t.stop());
                    v.srcObject = null;
                    p.srcObject = null;
                }
                this.currentIndex = 0;
            } else {
                this.setupBlinkTracking();
            }
        },

        async setupBlinkTracking() {
            const videoElement = document.getElementById('input_video');
            const previewElement = document.getElementById('preview_video');
            this.isLoading = true;

            if (!window.FaceMesh || !window.Camera) {
                this.isLoading = false;
                this.openDialog(APP_DATA.texts.dialog.errorTitle, APP_DATA.texts.dialog.errorMessage, "error");
                return;
            }

            const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
            faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
            faceMesh.onResults((results) => this.processFaceMeshResults(results));

            try {
                this.cameraInstance = new Camera(videoElement, {
                    onFrame: async () => { await faceMesh.send({image: videoElement}); },
                    width: 640, height: 480
                });
                await this.cameraInstance.start();
                this.cameraOn = true; this.isLoading = false;
                if (videoElement.srcObject) { previewElement.srcObject = videoElement.srcObject; previewElement.play(); }
                setTimeout(() => { this.isTracking = true; }, 1000);
            } catch (error) {
                this.isLoading = false; this.cameraOn = false;
                this.openDialog(APP_DATA.texts.dialog.errorCamera, error.message, "error");
            }
        },

        processFaceMeshResults(results) {
            if (!this.cameraOn) return;

            // Cooldown check
            if (Date.now() - this.lastActionTime < this.cooldownDuration) {
                this.isInCooldown = true;
                this.isBlinking = false;
                this.blinkStartTime = null;
                return;
            } else {
                this.isInCooldown = false;
            }

            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                const landmarks = results.multiFaceLandmarks[0];

                // Hitung EAR untuk kiri dan kanan
                const leftEAR = this.calculateEAR(landmarks, [33, 160, 158, 133, 153, 145]);
                const rightEAR = this.calculateEAR(landmarks, [362, 385, 387, 263, 373, 380]);
                const avgEAR = (leftEAR + rightEAR) / 2;

                const now = Date.now();

                // LOGIKA DETEKSI KEDIIP
                if (avgEAR < this.blinkThreshold) {
                    // Mata tertutup
                    if (!this.isBlinking) {
                        this.blinkStartTime = now;
                        this.isBlinking = true;
                    }

                    const currentDuration = now - this.blinkStartTime;
                    const shortMs = this.shortBlinkDurationSeconds * 1000;
                    const longMs = this.longBlinkDurationSeconds * 1000;

                    // Update progress bar jika sudah melewati batas short blink
                    if (currentDuration >= shortMs) {
                        this.isHoldingBlink = true;
                        // Hitung persentase (0% adalah shortMs, 100% adalah longMs)
                        let progress = ((currentDuration - shortMs) / (longMs - shortMs)) * 100;
                        this.holdPercentage = Math.min(progress, 100);
                    }
                } else {
                    // Mata terbuka kembali
                    this.isBlinking = false;
                    this.isHoldingBlink = false;
                    this.holdPercentage = 0;

                    if (this.blinkStartTime) {
                        const duration = now - this.blinkStartTime;
                        const shortMs = this.shortBlinkDurationSeconds * 1000;
                        const longMs = this.longBlinkDurationSeconds * 1000;

                        // Eksekusi jika durasi melewati Long Blink
                        if (duration >= longMs) {
                            this.triggerBlinkAction();
                        } 
                        // Geser jika durasi di antara Short dan Long
                        else if (duration >= shortMs) {
                            this.performSwipeAndNext();
                        }
                    }
                    this.blinkStartTime = null;
                }

            } else {
                // Wajah tidak terdeteksi
                this.isBlinking = false;
                this.isHoldingBlink = false;
                this.holdPercentage = 0;
                this.blinkStartTime = null;
            }
        },

        // FUNGSI KALKULASI EAR YANG SUDAH DIPERBAIKI (FIX BUG)
        calculateEAR(landmarks, indices) {
            // Ambil titik koordinat dari landmark
            const p1 = landmarks[indices[1]]; // Vertikal Atas 1
            const p2 = landmarks[indices[5]]; // Vertikal Bawah 1
            const p3 = landmarks[indices[2]]; // Vertikal Atas 2
            const p4 = landmarks[indices[4]]; // Vertikal Bawah 2
            const p5 = landmarks[indices[0]]; // Horizontal Kiri
            const p6 = landmarks[indices[3]]; // Horizontal Kanan

            // Fungsi jarak euclidean
            const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

            // Rumus EAR: (Jarak Vertikal 1 + Jarak Vertikal 2) / (2 * Jarak Horizontal)
            // Vertical distance adalah jarak antara kelopak atas dan bawah
            const vertical = (dist(p1, p2) + dist(p3, p4)) / 2;
            // Horizontal distance adalah lebar mata
            const horizontal = dist(p5, p6);

            // Hindari pembagian nol
            return vertical / (horizontal || 0.001);
        },

        triggerBlinkAction() {
            const cmd = this.commands[this.currentIndex];
            if (cmd) {
                this.outputText = cmd.message;
                this.lastActionTime = Date.now(); 
                this.isInCooldown = true;

                // Animasi Visual
                const mainCard = document.getElementById('mainCard');
                if(mainCard) {
                    mainCard.classList.remove('shadow-soft');
                    mainCard.classList.add('selected-flash', 'flash-border-success');
                    setTimeout(() => {
                        mainCard.classList.remove('selected-flash', 'flash-border-success');
                        mainCard.classList.add('shadow-soft');
                    }, 600);
                }

                this.speakText();
            }
        },

        saveSettings() {
            this.openDialog(APP_DATA.texts.dialog.successTitle, APP_DATA.texts.dialog.successMessage, "success");
            this.currentView = 'main';
        },

        speakText() {
            if ('speechSynthesis' in window && this.outputText) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(this.outputText);
                utterance.lang = 'id-ID'; utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
            }
        }
    }));
});