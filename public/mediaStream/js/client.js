const videoPlay = document.getElementById('player')
const audioSource = document.getElementById('audioSource')
const audioOutput = document.getElementById('audioOutput')
const videoSource = document.getElementById('videoSource')

if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia is not supported!')
} else {
  const constraints = {
    video: true,
    audio: true,
  }
  navigator.mediaDevices.getUserMedia(constraints).then(gotMediaStream).then(gotDevices).catch(handleError)
}

function gotMediaStream(stream) {
  videoPlay.srcObject = stream
  // 回傳 enumerateDevices Promise, 讓取得成功後可接續使用 .then 操作
  return navigator.mediaDevices.enumerateDevices()
}

function handleError(err) {
  console.log(`getUserMedia err: ${err}`)
}

function gotDevices(deviceInfos) {
  deviceInfos.forEach(function (deviceInfo) {
    console.log(
      `${deviceInfo.kind}: label = ${deviceInfo.label}: id = ${deviceInfo.deviceId}: groupId = ${deviceInfo.groupId}`
    )
    const option = document.createElement('option')
    option.text = deviceInfo.label
    option.value = deviceInfo.deviceId
    if (deviceInfo.kind === 'audioinput') {
      audioSource.appendChild(option)
    } else if (deviceInfo.kind === 'audiooutput') {
      audioOutput.appendChild(option)
    } else if (deviceInfo.kind === 'videoinput') {
      videoSource.appendChild(option)
    }
  })
}
