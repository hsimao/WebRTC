const videoPlay = document.getElementById('player')

if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia is not supported!')
} else {
  const constraints = {
    video: true,
    audio: true,
  }
  navigator.mediaDevices.getUserMedia(constraints).then(gotMediaStream).catch(handleError)
}

function gotMediaStream(stream) {
  videoPlay.srcObject = stream
}

function handleError(err) {
  console.log(`getUserMedia err: ${err}`)
}
