// const videoPlay = document.getElementById('videoPlayer')
const audioPlay = document.getElementById('audioPlayer')
const audioSource = document.getElementById('audioSource')
const audioOutput = document.getElementById('audioOutput')
const videoSource = document.getElementById('videoSource')
const filtersSelect = document.getElementById('filter')
const snapshot = document.getElementById('snapshot')
const picture = document.getElementById('picture')

function start() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia is not supported!')
    return
  } else {
    // 取得裝置 id
    const deviceId = videoSource.value
    const constraints = {
      // video: {
      //   width: 320,
      //   height: 240,
      //   // 幀速率
      //   frameRate: {
      //     ideal: 10, // 理想
      //     max: 60, // 最大
      //   },
      //   facingMode: 'environment', // environment 後鏡頭, user 前鏡頭
      //   deviceId: deviceId ? deviceId : undefined, // 更新裝置 id
      // },
      video: false,
      audio: true,
    }
    navigator.mediaDevices.getUserMedia(constraints).then(gotMediaStream).then(gotDevices).catch(handleError)
  }
}
start()

function gotMediaStream(stream) {
  // videoPlay.srcObject = stream
  audioPlay.srcObject = stream
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

filtersSelect.onchange = function () {
  videoPlay.className = filtersSelect.value
}

function pictureInit() {
  picture.width = 320
  picture.height = 240
}
pictureInit()

snapshot.onclick = function () {
  picture.className = filtersSelect.value
  picture.getContext('2d').drawImage(videoPlay, 0, 0, picture.width, picture.height)
}
