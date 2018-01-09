import React from 'react'
// var WebTorrent = require('webtorrent')
import WebTorrent from 'webtorrent/webtorrent.min'
import { formatVideoTime, BytestoSize } from '../modules/Library'

const client = new WebTorrent({ dht: false })
var torrentID = ''
var loaded = false

// Announces list
global.WEBTORRENT_ANNOUNCE = [
  'udp://[2604:a880:1:20::2f90:7001]:8000',
  'ws://[2604:a880:1:20::2f90:7001]:8000'
]

// Display webtorrent video
var displayVideo = (props) => {
  // Show overlay
  $('#video-components .fs-overlay').css({ 'visibility': 'visible', 'opacity': '1', 'width': '100vw', 'height': '100vh' })
  $('#video-topbar .title').html(props.title)

  client.add(props.torrentID, function(torrent) {
    // torrent.on('download', () => {
    //   console.log(torrent.progress, torrent.numPeers, torrent.downloadSpeed)
    // })
    const file = torrent.files.find(function (file) {
      return file.name.endsWith('.mp4')
    })

    file.appendTo("#video-container .video-wrapper")
  })

  torrentID = props.torrentID
}
var switchVideo = (props) => {
  client.remove(torrentID)
  $("#video-container .video-wrapper").html('')

  displayVideo(props)
}


class Video extends React.Component {
  constructor(props) {
    super()
    this.state = {
      videoLoaded: false,
      progress: 0
    }

    this.showOverlay = this.showOverlay.bind(this)
    this.removeOverlay = this.removeOverlay.bind(this)
    this.closeVideo = this.closeVideo.bind(this)

    this.updateplayer = this.updateplayer.bind(this)
    this.getFormatedTime = this.getFormatedTime.bind(this)
    this.getTimeState = this.getTimeState.bind(this)
    this.toggleMute = this.toggleMute.bind(this)
    this.changeVolume = this.changeVolume.bind(this)
    this.fullScreen = this.fullScreen.bind(this)
    this.exitFullScreen = this.exitFullScreen.bind(this)
  }
  componentDidMount() {
    var topBar = $('#video-topbar')
    var videoContainer = $('#video-container')
    var videoControls = $('#video-controls')
    var playVid = $('#video-controls .play-vid')
    var video = $('#video-container video').get(0)
    var volume = $('#video-controls .volume .icon')
    var volumeIntensity = $('#video-controls .volume .intensityBar')
    var progressBar = $('#video-controls .progress-bar')
    var expandButton = $('#video-controls .scale')
    var timeState = $('#video-controls .time')
    var update
    var autohideControls
    var userActivity = false

    videoContainer.draggable()
    $('.loader-inner').loaders()

    update = setInterval(this.updateplayer, 500)

    // Bind keyboards
    $(window).keypress((e) => {
      // Press SPACE: play or pause
      if (e.keyCode === 0 || e.keyCode === 32) {
        e.preventDefault()
        playVid.click()
      }
    })
    $(window).keyup((e) => {
      var video = $('#video-container video').get(0)
      if (!video) return

      // Press ESC
      if (e.keyCode === 27 && expandButton.hasClass('active')) {
        e.preventDefault()
        expandButton.toggleClass('active')
        this.exitFullScreen()
      }

      // Press Right Arrow: skip 10 seconds
      if (e.keyCode === 39) {
        e.preventDefault()
        video.currentTime += 10
        this.updateplayer()
      }

      // Press Left Arrow: back 10 seconds
      if (e.keyCode === 37) {
        e.preventDefault()
        video.currentTime -= 10
        this.updateplayer()
      }
    })

    // Mouse move over the video: show controls and top bar
    videoContainer.mousemove(() => {
      userActivity = true
    })
    videoContainer.mouseleave(() => {
      userActivity = false
      videoControls.removeClass('is-visible')
      topBar.removeClass('is-visible')
      videoContainer.css('cursor', 'none')
    })
    var activityCheck = setInterval(() => {
      if (userActivity) {
        // Reset the activity tracker
        userActivity = false

        videoControls.addClass('is-visible')
        topBar.addClass('is-visible')
        videoContainer.css('cursor', 'auto')
        clearTimeout(autohideControls)
        // In X seconds, if no more activity has occurred
        // the user will be considered inactive
        autohideControls = setTimeout(function() {
          videoControls.removeClass('is-visible')
          topBar.removeClass('is-visible')
          videoContainer.css('cursor', 'none')
        }, 2000)
      }
    }, 100)


    // Click button: play or pause
    playVid.click(() => {
      var video = $('#video-container video').get(0)
      var videoControls = $('#video-controls')
      if (video.paused) {
        video.play()
        playVid.find('.icon').css('background-image', 'url(/img/pause-button.svg)')
        this.showOverlay()
      }
      else {
        video.pause()
        playVid.find('.icon').css('background-image', 'url(/img/play-button.svg)')
        this.removeOverlay()
      }
    })

    // Click progress bar: skip
    progressBar.click((e) => {
      var video = $('#video-container video').get(0)
      var videoControls = $('#video-controls')
      var mouseX = e.pageX - progressBar.offset().left,
          width  = progressBar.outerWidth()
      video.currentTime = (mouseX / width) * video.duration
      this.updateplayer()
    })

    // Mouse moves the progress bar: show time information
    progressBar.mousemove((e) =>
      timeState.text(this.getTimeState(e))
    )

    // Click volume button: mute or unmute
    volume.click(() => {
      this.toggleMute()
    })

    // Click volume intensity: change video volume
    volumeIntensity.click((e) => {
      this.changeVolume(e)
    })

    // Click expand button: enter or exit full screen
    expandButton.click(() => {
       expandButton.toggleClass('active')
       if (expandButton.hasClass('active')) {
         this.fullScreen()
      } else {
         this.exitFullScreen()
         expandButton.find('.icon').css('background-image', 'url(/img/fullscreen.svg)')
      }
    })

    // Get webtorrent status: progress, peers, speed
    // client.on('torrent', () => {
    //   this.
    // })
    setInterval(() => {
      if (this.state.videoLoaded) {
        this.setState({ progress: client.progress })
      }
    }, 1000)
  }
  componentWillUpdate() {
    $('.loader-inner').loaders()
  }

  // Update video player: time, progress bar
  updateplayer() {
    var video = $('#video-container video').get(0)
    if (video) {
      if (!this.state.videoLoaded) {
        this.setState({ videoLoaded: true })
      }
      var videoHeigth = $('#video-container video').height()
      var playIcon = $('#video-controls .play-vid .icon')
      var progressBar = $('#video-controls .progress-bar')
      var progress = $('#video-controls .progress-bar .progress')
      var progressIndicator = $('#video-controls .progress-bar .progress-indicator')
      var timer = $('#video-controls .progress-container .timer')
      var percentage = (video.currentTime / video.duration) * 100

      if ($('#video-container').height() !== videoHeigth) {
        $('#video-container').height(videoHeigth)
      }

      progress.css('width', percentage + '%')
      progressIndicator.css('left', (progressBar.width() * percentage / 100 - 6) + 'px')
      timer.text(this.getFormatedTime())
      if (video.ended || video.paused) {
        playIcon.css('background-image', 'url(/img/play-button.svg)')
      } else {
        playIcon.css('background-image', 'url(/img/pause-button.svg)')
      }
    }
    else {
      if (this.state.videoLoaded) {
        this.setState({ videoLoaded: false })
        this.forceUpdate()
      }
    }
  }
  getFormatedTime() {
    var video = $('#video-container video').get(0)
    var seconds = Math.round(video.currentTime)
    return formatVideoTime(seconds)
  }
  getTimeState(e) {
    var video = $('#video-container video').get(0)
    var progressBar = $('#video-controls .progress-bar')
    var timeState  = $('#video-controls .time')

    var mouseX = e.pageX - progressBar.offset().left
    var width  = progressBar.outerWidth()

    timeState.css('left', (mouseX / width) * progressBar.width() + 18 + 'px');

    var currentSeconeds = Math.round((mouseX / width) * video.duration);
    return formatVideoTime(currentSeconeds)
  }
  toggleMute() {
    var video = $('#video-container video').get(0)
    var volume = $('#video-controls .volume .icon')
    var intensity = $('#video-controls .intensity')
    var volumeIndicator = $('#video-controls .volume-indicator')

    if (!video.muted) {
       video.muted = true
       volume.css('background-image', 'url(/img/mute-volume.svg)')
       intensity.hide()
       volumeIndicator.hide()
    } else {
       video.muted = false
       volume.css('background-image', 'url(/img/volume.svg)')
       intensity.show()
       volumeIndicator.show()
    }
  }
  changeVolume(e) {
    var video = $('#video-container video').get(0)
    var volume = $('#video-controls .volume .icon')
    var volumeIntensity = $('#video-controls .volume .intensityBar')
    var intensity = $('#video-controls .intensity')
    var volumeIndicator = $('#video-controls .volume-indicator')

    var mouseX = e.pageX - volumeIntensity.offset().left,
        width  = volumeIntensity.outerWidth();

    video.volume = mouseX / width
    video.muted = false
    volume.css('background-image', 'url(/img/volume.svg)')
    intensity.css('width', mouseX + 'px');
    intensity.show()
    volumeIndicator.css('left', (mouseX / width) * volumeIntensity.width() - 6 + 'px')
    volumeIndicator.show()
  }
  fullScreen() {
    var videoContainer = $('#video-container')
    var videoContainerHTML = videoContainer.get(0)
    var videoControls = $('#video-controls')
    var topBar = $('#video-topbar')
    var expandButton = $('#video-controls .scale')

    videoControls.addClass('fullscreen')
    videoContainer.addClass('fullscreen')
    videoContainer.draggable('disable')
    topBar.addClass('fullscreen')
    expandButton.find('.icon').css('background-image', 'url(/img/fullscreen-exit.svg)')

    if (videoContainerHTML.requestFullscreen) {
       videoContainerHTML.requestFullscreen()
    } else if (videoContainerHTML.webkitRequestFullscreen) {
       videoContainerHTML.webkitRequestFullscreen()
    } else if (videoContainerHTML.mozRequestFullscreen) {
       videoContainerHTML.mozRequestFullscreen()
    } else if (videoContainerHTML.msRequestFullscreen) {
       videoContainerHTML.msRequestFullscreen()
    } else {
       console.log('Error: entering fullscreen.')
    }
  }
  exitFullScreen() {
    var videoContainer = $('#video-container')
    var videoControls = $('#video-controls')
    var topBar = $('#video-topbar')
    var expandButton = $('#video-controls .scale')

    videoControls.removeClass('fullscreen')
    videoContainer.removeClass('fullscreen')
    videoContainer.draggable('enable')
    topBar.removeClass('fullscreen')
    expandButton.find('.icon').css('background-image', 'url(/img/fullscreen.svg)')

    if (document.webkitExitFullscreen) {
       document.webkitExitFullscreen()
    } else if (document.mozCancelFullScreen) {
       document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
       document.msExitFullscreen()
    } else {
       console.log('Error: exiting fullscreen.')
    }
  }
  showOverlay() {
    $('#video-components .fs-overlay').css({ 'visibility': 'visible', 'opacity': '1', 'width': '100vw', 'height': '100vh' })
  }
  removeOverlay() {
    $('#video-components .fs-overlay').css({ 'visibility': 'hidden', 'opacity': '0', 'width': '0', 'height': '0' })
  }
  // Close the popup (hide it) and remove video
  closeVideo() {
    $("#video-components").hide()
    client.remove(torrentID)

    $("#video-container .video-wrapper").html('')
  }
  render() {
    return (
      <div id='video-components'>
        <div className='fs-overlay' onClick={this.removeOverlay}></div>
        <div id="video-container">
          {!this.state.videoLoaded && <div className="loader-inner ball-pulse"></div>}
          <div id='video-topbar'>
            {/* <div className='overlay'></div> */}
            <div className='close' onClick={this.closeVideo}></div>
            <div className='title'>Title</div>
          </div>
          <div className="video-wrapper">
            {/* <video src='/img/test.mp4' constrols autoPlay></video> */}
          </div>
          <div id="video-controls">
            <div className='overlay'></div>
            <div className="play-vid">
              <div className="icon"></div>
            </div>
            <div className="progress-container">
              <div className="timer">00:00</div>
              <div className="progress-bar">
                <div className="progress"></div>
                <div className='progress-indicator'></div>
              </div>
              <div className="time">00:00</div>
            </div>
            <div className="volume">
              <div className="icon"></div>
              <div className="intensityBar">
                <div className="intensity"></div>
                <div className='volume-indicator'></div>
              </div>
            </div>
            <div className='subtitle'>
              <div className='icon'></div>
            </div>
            <div className="scale">
              <div className="icon"></div>
            </div>
          </div>
          <ProgressRing radius={25} stroke={4} videoLoaded={this.state.videoLoaded} />
        </div>
      </div>
    );
  }
}

class ProgressRing extends React.Component {
  constructor(props) {
    super(props)

    this.normalizedRadius = this.props.radius - this.props.stroke * 2
    this.circumference = this.normalizedRadius * 2 * Math.PI
    this.radius = this.props.radius
    this.stroke = this.props.stroke

    this.state = {
      progress: 0
    }

    this.getBuffer = this.getBuffer.bind(this)
  }
  componentDidMount() {
    setInterval(() => {
      if (this.props.videoLoaded) {
        this.setState({ progress: client.progress })
      }
    }, 1000)
  }
  getBuffer() {
    console.log('CLICKED')
    client.torrents[0].files[0].getBuffer()
  }
  render() {
    var torrent = client.torrents[0]
    var downloadSpeed = 0,
        uploadSpeed = 0,
        downloaded = 0,
        uploaded = 0,
        numPeers = 0
    if (torrent) {
      downloadSpeed = torrent.downloadSpeed
      uploadSpeed = torrent.uploadSpeed
      downloaded = torrent.downloaded
      uploaded = torrent.uploaded
      numPeers = torrent.numPeers
    }

    var progress = this.state.progress
    if (downloaded == 0) {
      progress = 0
    }
    if (progress == 0 && downloaded > 2000) {
      progress = 1
    }
    const strokeDashoffset = this.circumference - progress * this.circumference

    return (
      <div id='video-status'>
        <svg
          height={this.radius * 2}
          width={this.radius * 2}
        >
          <circle
            // stroke='#3498db'
            stroke='#e50914'
            fill='transparent'
            strokeWidth={this.stroke}
            strokeDasharray={this.circumference + ' ' + this.circumference}
            strokeLinecap='round'
            style={{ strokeDashoffset }}
            r={this.normalizedRadius}
            cx={this.radius}
            cy={this.radius}
          />
          <circle
            stroke='rgba(255,255,255,.3)'
            fill='transparent'
            strokeWidth={this.stroke}
            r={this.normalizedRadius}
            cx={this.radius}
            cy={this.radius}
          />
          {progress == 1 ? 
            <text
              id='video-get-buffer'
              fill='#8cc0e2'
              fontFamily='FontAwesome'
              fontSize='15px'
              textAnchor='middle'
              alignmentBaseline='central'
              cursor='pointer'
              x={this.radius}
              y={this.radius}
              onClick={this.getBuffer}
            >
              {'\uf019'}
            </text>
          :
            <text
              fill='white'
              fontFamily='Arial, FontAwesome, sans-serif'
              fontSize='13px'
              textAnchor='middle'
              alignmentBaseline='central'
              x={this.radius}
              y={this.radius}
            >
              {Math.trunc(progress * 100)}
            </text>
          }
        </svg>

        <div className='speed-status' data-type="peer">
          {numPeers} peers
        </div>
        <div className='speed-status' data-type='download'>
          {BytestoSize(downloaded, 1)}, {BytestoSize(downloadSpeed, 1)+'/s'}
        </div>
        <div className='speed-status' data-type='upload'>
          {BytestoSize(uploadSpeed, 1)}, {BytestoSize(uploadSpeed, 1)+'/s'}
        </div>
      </div>
    )
  }
}

export { Video, displayVideo, switchVideo }
