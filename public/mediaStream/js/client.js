const videoPlay = document.getElementById('player')
const audioSource = document.getElementById('audioSource')
const audioOutput = document.getElementById('audioOutput')
const videoSource = document.getElementById('videoSource')

function start() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia is not supported!')
    return
  } else {
    // 取得裝置 id
    const deviceId = videoSource.value
    const constraints = {
      video: {
        width: 520,
        height: 180,
        // 幀速率
        frameRate: {
          ideal: 10, // 理想
          max: 60, // 最大
        },
        facingMode: 'environment', // environment 後鏡頭, user 前鏡頭
        deviceId: deviceId ? deviceId : undefined, // 更新裝置 id
      },
      audio: {
        noiseSuppression: true, // 降噪
        echoCancellation: true, // 消除回音
      },
    }
    navigator.mediaDevices.getUserMedia(constraints).then(gotMediaStream).then(gotDevices).catch(handleError)
  }
}
start()

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

// 監聽更改鏡頭
videoSource.onchange = start
