const me = document.querySelector("#me")
const myfriend = document.querySelector("#myfriend")
const h1 = document.querySelector("h1")
const call = document.querySelector("#call")
let pc1;
let pc2;
const videoScope = {
    audio: true,
    video: { width: 640, height: 480 }
}
function handleMyStream(stream) {
    h1.style.color = "green"
    h1.textContent = "Connect Success"
    const videoTracks = window.videoTracks = stream.getVideoTracks()
    const audioTracks = window.audioTracks = stream.getAudioTracks()
    window.localStream = stream;
    me.srcObject = stream
    me.onloadedmetadata = function () {
        me.play()
        me.volume = 1
    }

}
function gotRemoteStream(e) {
    if (myfriend.srcObject !== e.streams[0]) {
        myfriend.srcObject = e.streams[0];
        myfriend.play()
    }
}

async function initCamera(e) {
    try {
        const stream = await window.navigator.mediaDevices.getUserMedia(videoScope)
        handleMyStream(stream)
    } catch (error) {
        console.error(error);
        h1.style.color = "red"
        h1.textContent = error.message.toString()
    }
}
const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};

document.addEventListener("DOMContentLoaded", () => {
    initCamera()
})

call.onclick = async () => {
    const config = {}
    console.log("establish peer to perr connection!")
    const videoTracks = window.localStream.getVideoTracks();
    const audioTracks = window.localStream.getAudioTracks();
    pc1 = new RTCPeerConnection(config)
    pc2 = new RTCPeerConnection(config)
    pc2.addEventListener('icecandidate', e => onIceCandidate(pc2, e));
    pc2.addEventListener('track', gotRemoteStream);
    window.localStream.getTracks().forEach(track => {
        pc1.addTrack(track, window.localStream)
    })
    try {
        const offer = await pc1.createOffer(offerOptions);
        await onCreateOfferSuccess(offer);
    } catch (err) {
        console.error(err)
    }
}


async function onCreateOfferSuccess(desc) {
    try {
        await pc1.setLocalDescription(desc)
        // onSetLocalSuccess(pc1)
    } catch (error) {
        console.error(error)
    }
    try {
        await pc2.setRemoteDescription(desc)
        // onSetRemoteSuccess(pc2)
    } catch (error) {
        console.error(error)
    }
    try {
        const answer = await pc2.createAnswer()
        await onCreateAnswerSuccess(answer)
    } catch (error) {
        console.error(error)

    }
}

async function onCreateAnswerSuccess(desc) {
    try {
        await pc2.setLocalDescription(desc)
        // onsetLocalSuccess(pc2)
    } catch (error) {
        console.error(error)
    }
    try {
        await pc1.setRemoteDescription(desc)
    } catch (error) {
        console.error(error)

    }
}

async function onIceCandidate(pc, event) {
    console.log({event});
    
    try {
        await (getOtherPc(pc).addIceCandidate(event.candidate))
    } catch (error) {
        console.error(error)
    }
}
// function onIceStateChange(pc, event) {
//   if (pc) {
//     console.log('ICE state change event: ', event);
//   }
// }
function getOtherPc(pc) {
    return (pc === pc1) ? pc2 : pc1;
}