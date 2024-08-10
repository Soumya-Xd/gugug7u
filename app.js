document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-recording');
    const stopButton = document.getElementById('stop-recording');
    const videoPreview = document.getElementById('video-preview');
    const registrationForm = document.getElementById('registration-form');

    let mediaRecorder;
    let recordedChunks = [];
    let voiceCommand = '';
    let recognition;

    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        voiceCommand = document.getElementById('voice-command').value;

        console.log('User registered with:', { name, phone, voiceCommand });

        startButton.disabled = false;

        initializeVoiceRecognition();
    });

    async function startRecording() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Your browser does not support media recording.');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            videoPreview.srcObject = stream;
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                videoPreview.src = URL.createObjectURL(blob);
                recordedChunks = [];
                uploadToCloud(blob);
            };

            mediaRecorder.start();
            startButton.disabled = true;
            stopButton.disabled = false;
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    }

    function stopRecording() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            startButton.disabled = false;
            stopButton.disabled = true;
        }
    }

    async function uploadToCloud(blob) {
        try {
            const formData = new FormData();
            formData.append('file', blob, 'video.webm');

            // Replace with your actual cloud storage URL
            const response = await fetch('https://your-cloud-storage-url/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload video');
            }

            console.log('Video uploaded successfully');
        } catch (error) {
            console.error('Error uploading video:', error);
        }
    }

    function initializeVoiceRecognition() {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Your browser does not support voice recognition.');
            return;
        }

        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            console.log('Detected voice command:', transcript);
            if (transcript.toLowerCase() === voiceCommand.toLowerCase()) {
                startRecording();
            }
        };

        recognition.start();
    }

    startButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
});
