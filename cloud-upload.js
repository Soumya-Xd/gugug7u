async function uploadToCloud(blob) {
    const accessToken = 'YOUR_ACCESS_TOKEN'; // Replace with your actual Dropbox access token

    try {
        const formData = new FormData();
        formData.append('file', blob, 'video.webm');

        // Dropbox API upload endpoint
        const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/octet-stream',
                'Dropbox-API-Arg': JSON.stringify({
                    path: '/video.webm',
                    mode: 'add',
                    autorename: true,
                    mute: false
                })
            },
            body: blob
        });

        if (!response.ok) {
            throw new Error('Failed to upload video');
        }

        const result = await response.json();
        console.log('Video uploaded successfully', result);
    } catch (error) {
        console.error('Error uploading video:', error);
    }
}
