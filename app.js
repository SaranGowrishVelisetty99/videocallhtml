const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const startCallBtn = document.getElementById('start-call-btn');
const endCallBtn = document.getElementById('end-call-btn');

let localStream;
let remoteStream;
let rtcPeerConnection;

// Set up media devices and create an offer
async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        rtcPeerConnection = new RTCPeerConnection(configuration);

        // Add local stream to the connection
        localStream.getTracks().forEach(track => rtcPeerConnection.addTrack(track, localStream));

        // Set up event handlers for the connection
        rtcPeerConnection.onicecandidate = handleIceCandidate;
        rtcPeerConnection.ontrack = handleTrack;

        // Create an offer and set it as the local description
        const offer = await rtcPeerConnection.createOffer();
        await rtcPeerConnection.setLocalDescription(offer);

        // Enable the end call button
        endCallBtn.disabled = false;

        // Send the offer to the other peer (signaling is not implemented here)
        // The other peer should handle this offer and send back an answer
        console.log('Send this offer to the other peer:', offer);
    } catch (error) {
        console.error('Error starting the call:', error);
    }
}

// Handle incoming ice candidates
function handleIceCandidate(event) {
    if (event.candidate) {
        // Send the candidate to the other peer (signaling is not implemented here)
        console.log('Send this ice candidate to the other peer:', event.candidate);
    }
}

// Handle incoming video stream
function handleTrack(event) {
    remoteStream = event.streams[0];
    remoteVideo.srcObject = remoteStream;
}

// End the call and close the connection
function endCall() {
    if (rtcPeerConnection) {
        rtcPeerConnection.close();
        rtcPeerConnection = null;
    }

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }

    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
        remoteStream = null;
    }

    localVideo.srcObject = null;
    remoteVideo.srcObject = null;

    endCallBtn.disabled = true;
}

// Set up event listeners
startCallBtn.addEventListener('click', startCall);
endCallBtn.addEventListener('click', endCall);
