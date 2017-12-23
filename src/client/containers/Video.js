import React from 'react'
// var WebTorrent = require('webtorrent')
import WebTorrent from 'webtorrent/webtorrent.min'
import { formatNumberLength } from '../modules/Library'

const client = new WebTorrent({ dht: false })
var torrentID = ''
var loaded = false

// Announces list
global.WEBTORRENT_ANNOUNCE = [
  'udp://[2604:a880:1:20::f:e001]:8000',
  'ws://[2604:a880:1:20::f:e001]:8000'
]

// Display webtorrent video
function displayVideo(props) {
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
    setInterval(()=>{
      let video_height = $("#video-container video").height();
      let video_wrapper_height = $("#video-container .video-wrapper").height();
      if (video_height !== video_wrapper_height) {
        $('#video-container .video-wrapper').css('height', video_height);
      }
    }, 1000);
  })

  torrentID = props.torrentID
}
function switchVideo(props) {
  client.remove(torrentID);
  $("#video-container .video-wrapper").html('');

  displayVideo(props);
}


class Video extends React.Component {
  constructor(props) {
    super()

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
    $("#video-container").draggable()
    $('.loader-inner').loaders()

    var playVid     = $('#video-controls .play-vid'),
        video          = $('#video-container video').get(0),
        volume         = $('#video-controls .volume .icon'),
        volumeIntesity = $('#video-controls .volume .intensityBar'),
        progressBar    = $('#video-controls .progress-bar'),
        expandButton   = $('#video-controls .scale'),
        timeState      = $('#video-controls .time'),
        update

    update = setInterval(this.updateplayer, 1000)

    playVid.click(() => {
      if (video.paused) {
        video.play()
        playVid.find('.icon').css('background-image', 'url(/img/pause-button.svg)')
        // update = setInterval(this.updateplayer, 500)
      }
      else {
        video.pause()
        playVid.find('.icon').css('background-image', 'url(/img/play-button.svg)')
        // clearInterval(update)
      }
    })

    progressBar.click((e) => {
      var mouseX = e.pageX - progressBar.offset().left,
          width  = progressBar.outerWidth()
      video.currentTime = (mouseX / width) * video.duration;
      this.updateplayer()
    })

    progressBar.mousemove((e) =>
      timeState.text(this.getTimeState(e))
    )

    volume.click(() => {
      this.toggleMute()
    })

    volumeIntesity.click((e) => {
      this.changeVolume(e)
    })

    expandButton.click(() => {
       expandButton.toggleClass('active')
       if (expandButton.hasClass('active')) {
        //  $('#video-controls').addClass('is-visible')
         this.fullScreen()
      } else {
        //  $('#video-controls').removeClass('is-visible')
         this.exitTheFullScreen()
      }
    })

    // overlayButton.click(function () { playVid();});
  }
  // Update video player: time, progress bar
  updateplayer() {
    var video = $('#video-container video').get(0)
    var progressBar = $('#video-controls .progress-bar')
    var progress = $('#video-controls .progress-bar .progress')
    var progressIndicator = $('#video-controls .progress-bar .progress-indicator')
    var timer = $('#video-controls .progress-container .timer')
    var percentage = (video.currentTime / video.duration) * 100

    progress.css('width', percentage + '%')
    progressIndicator.css('left', (progressBar.width()*percentage/100 - 6) + 'px')
    timer.text(this.getFormatedTime())
    if (video.ended || video.paused) {
        playIcon.css('background-image', 'url(/img/play-button.svg)')
    }
  }
  getFormatedTime() {
    var video = $('#video-container video').get(0)
    var seconeds = Math.round(video.currentTime)
    var minutes  = Math.floor(seconeds / 60)

    if (minutes > 0) {
       seconeds -= minutes * 60;
    }
    return formatNumberLength(minutes, 2) + ':' + formatNumberLength(seconeds, 2)
  }
  getTimeState(e) {
    var video = $('#video-container video').get(0)
    var progressBar = $('#video-controls .progress-bar')
    var timeState  = $('#video-controls .time')

    var mouseX = e.pageX - progressBar.offset().left,
        width  = progressBar.outerWidth()

     var currentSeconeds = Math.round((mouseX / width) * video.duration);
     var currentMinutes  = Math.floor(currentSeconeds / 60);

     if (currentMinutes > 0) {
        currentSeconeds -= currentMinutes * 60;
     }

     timeState.css('left', (mouseX / width) * progressBar.width() + 18 + 'px');

     return formatNumberLength(currentMinutes, 2) + ':' + formatNumberLength(currentSeconeds, 2)
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
    var volumeIntesity = $('#video-controls .volume .intensityBar')
    var intensity = $('#video-controls .intensity')
    var volumeIndicator = $('#video-controls .volume-indicator')

    var mouseX = e.pageX - volumeIntesity.offset().left,
        width  = volumeIntesity.outerWidth();

    video.volume = mouseX / width
    video.muted = false
    volume.css('background-image', 'url(/img/volume.svg)')
    intensity.css('width', mouseX + 'px');
    intensity.show()
    volumeIndicator.css('left', (mouseX / width) * volumeIntesity.width() - 6 + 'px')
    volumeIndicator.show()
  }
  fullScreen() {
    var video = $('#video-container video').get(0)

    if (video.requestFullscreen) {
       video.requestFullscreen()
    } else if (video.webkitRequestFullscreen) {
       video.webkitRequestFullscreen()
    } else if (video.mozRequestFullscreen) {
       video.mozRequestFullscreen()
    } else if (video.msRequestFullscreen) {
       video.msRequestFullscreen()
    } else {
       console.log('Error: entering fullscreen.')
    }
  }
  exitFullScreen() {
    if (document.webkitExitFullscreen()) {
       document.webkitExitFullscreen()
    } else if (document.mozCancelFullScreen()) {
       document.mozCancelFullScreen()
    } else if (document.msExitFullscreen()) {
       document.msExitFullscreen()
    } else {
       console.log('Error: exiting fullscreen.')
    }
  }
  // close the popup (hide it) and remove video
  closeVideo() {
    $("#video-container").hide()
    client.remove(torrentID)

    $("#video-container .video-wrapper").html('')
  }
  render() {
    return (
      <div id="video-container">
        <span onClick={this.closeVideo} className="close">&times;</span>

        <div className="loader-inner ball-pulse"></div>
        <div className="video-wrapper">
          <video src='/img/test.mp4' constrols autoPlay></video>
        </div>
        <div id="video-controls">
          {/* <div className='overlay'></div> */}
          <div className="play-vid">
            <div className="icon"></div>
          </div>
          <div className="progress-container">
            <div className="timer">00:00</div>
            <div className="progress-bar">
              <div className="progress"></div>
              <div className='progress-indicator'></div>
            </div>
            <div className="time">16:00</div>
            {/* <div className="timer fullTime">00:00</div> */}
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
    );
  }
}

export { Video, displayVideo, switchVideo }
