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

        // INIT: Cek Local Storage saat aplikasi mulai
        initApp() {
            const savedConfig = localStorage.getItem('vispeak_config');

            if (savedConfig) {
                try {
                    const data = JSON.parse(savedConfig);

                    // Load kata-kata jika ada
                    if (data.commands && data.commands.length > 0) {
                        this.commands = data.commands;
                    }

                    // Load sensor jika ada
                    if (data.shortBlinkDurationSeconds) this.shortBlinkDurationSeconds = data.shortBlinkDurationSeconds;
                    if (data.longBlinkDurationSeconds) this.longBlinkDurationSeconds = data.longBlinkDurationSeconds;
                    if (data.blinkThreshold) this.blinkThreshold = data.blinkThreshold;

                    console.log("Konfigurasi sebelumnya dimuat.");
                } catch (e) {
                    console.error("Gagal load config:", e);
                }
            }
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
            if (Date.now() - this.lastActionTime < this.cooldownDuration) {
                this.isInCooldown = true; this.isBlinking = false; this.blinkStartTime = null; return;
            } else { this.isInCooldown = false; }

            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                const landmarks = results.multiFaceLandmarks[0];
                const leftEAR = this.calculateEAR(landmarks, [33, 160, 158, 133, 153, 145]);
                const rightEAR = this.calculateEAR(landmarks, [362, 385, 387, 263, 373, 380]);
                const avgEAR = (leftEAR + rightEAR) / 2;
                const now = Date.now();

                if (avgEAR < this.blinkThreshold) {
                    if (!this.isBlinking) { this.blinkStartTime = now; this.isBlinking = true; }
                    const currentDuration = now - this.blinkStartTime;
                    const shortMs = this.shortBlinkDurationSeconds * 1000;
                    const longMs = this.longBlinkDurationSeconds * 1000;
                    if (currentDuration >= shortMs) {
                        this.isHoldingBlink = true;
                        this.holdPercentage = Math.min(((currentDuration - shortMs) / (longMs - shortMs)) * 100, 100);
                    }
                } else {
                    this.isBlinking = false; this.isHoldingBlink = false; this.holdPercentage = 0;
                    if (this.blinkStartTime) {
                        const duration = now - this.blinkStartTime;
                        const shortMs = this.shortBlinkDurationSeconds * 1000;
                        const longMs = this.longBlinkDurationSeconds * 1000;
                        if (duration >= longMs) this.triggerBlinkAction();
                        else if (duration >= shortMs) this.performSwipeAndNext();
                    }
                    this.blinkStartTime = null;
                }
            } else {
                this.isBlinking = false; this.isHoldingBlink = false; this.holdPercentage = 0; this.blinkStartTime = null;
            }
        },

        calculateEAR(landmarks, indices) {
            const p = indices.map(i => landmarks[i]);
            const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
            const vertical = (dist(p[1], p[2]) + dist(p[3], p[4])) / 2;
            const horizontal = dist(p[0], p[5]);
            return vertical / horizontal;
        },

        triggerBlinkAction() {
            const cmd = this.commands[this.currentIndex];
            if (cmd) {
                this.outputText = cmd.message;
                this.lastActionTime = Date.now(); this.isInCooldown = true;
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

        // SAVE: Simpan ke Local Storage
        saveSettings() {
            const dataToSave = {
                commands: this.commands,
                shortBlinkDurationSeconds: this.shortBlinkDurationSeconds,
                longBlinkDurationSeconds: this.longBlinkDurationSeconds,
                blinkThreshold: this.blinkThreshold
            };

            localStorage.setItem('vispeak_config', JSON.stringify(dataToSave));

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