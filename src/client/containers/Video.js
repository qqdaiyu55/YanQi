import React from 'react'
// var WebTorrent = require('webtorrent')
import WebTorrent from 'webtorrent/webtorrent.min'
import { formatVideoTime } from '../modules/Library'

const client = new WebTorrent({ dht: false })
var torrentID = ''
var loaded = false

// Announces list
global.WEBTORRENT_ANNOUNCE = [
  'udp://[2604:a880:1:20::f:e001]:8000',
  'ws://[2604:a880:1:20::f:e001]:8000'
]

// Display webtorrent video
var displayVideo = (props) => {
  client.add(props.torrentID, function(torrent) {
    torrent.on('download', function () {
      if (!loaded) {
        $('#video-container .loader-inner').hide()
        $('#video-controls').css('visibility', 'visible')
        loaded = true
      }
    })
    const file = torrent.files.find(function (file) {
      return file.name.endsWith('.mp4')
    })

    file.appendTo("#video-container .video-wrapper")

    // A trick to get loaded video intrinsic height
    setInterval(() => {
      let video_height = $("#video-container video").height()
      let video_wrapper_height = $("#video-container .video-wrapper").height()
      if (video_height !== video_wrapper_height) {
        $('#video-container .video-wrapper').css('height', video_height)
      }
    }, 1000)
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

    // Click video: play or pause
    $('#video-container .video-wrapper').click(() => {
      playVid.click()
    })

    // Mouse move over the video: show controls and top bar
    videoContainer.mousemove(() => {
      userActivity = true
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
      if (video.paused) {
        video.play()
        playVid.find('.icon').css('background-image', 'url(/img/pause-button.svg)')
        $('#video-components .fs-overlay').show()
      }
      else {
        video.pause()
        playVid.find('.icon').css('background-image', 'url(/img/play-button.svg)')
        $('#video-components .fs-overlay').hide()
      }
    })

    // Click progress bar: skip
    progressBar.click((e) => {
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
      }
    })
  }

  // Update video player: time, progress bar
  updateplayer() {
    var video = $('#video-container video').get(0)
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
    progressIndicator.css('left', (progressBar.width()*percentage/100 - 6) + 'px')
    timer.text(this.getFormatedTime())
    if (video.ended || video.paused) {
        playIcon.css('background-image', 'url(/img/play-button.svg)')
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

    videoControls.addClass('fullscreen')
    videoContainer.addClass('fullscreen')
    videoContainer.draggable('disable')
    topBar.addClass('fullscreen')

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

    videoControls.removeClass('fullscreen')
    videoContainer.removeClass('fullscreen')
    videoContainer.draggable('enable')
    topBar.removeClass('fullscreen')

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
  removeOverlay() {
    $('#video-components .fs-overlay').hide()
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
          {/* <div className="loader-inner ball-pulse"></div> */}
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
            <div className='caption'>
              <div className='icon'></div>
            </div>
            <div className="scale">
              <div className="icon"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { Video, displayVideo, switchVideo }
