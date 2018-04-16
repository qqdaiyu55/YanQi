import React from 'react'
import WebTorrent from 'webtorrent/webtorrent.min'
import Auth from '../modules/Auth'
import { formatVideoTime, BytestoSize, uuidv8 } from '../modules/Library'

var torrentID = ''
var playlist = []
// Disable DHT
var client = new WebTorrent({
  dht: false
})

// Announces list
global.WEBTORRENT_ANNOUNCE = [
  'wss://tracker.yanqi.tv'
]

// Display webtorrent video
var displayVideo = (props) => {
  // Show overlay
  $('#video-components .fs-overlay').css({ 'visibility': 'visible', 'opacity': '1', 'width': '100vw', 'height': '100vh' })
  $('#video-topbar .title').html(props.title)

  // Reset loader
  $('#video-loader .loader-inner').show()
  $('#video-loader p').html('')

  client.add(props.torrentID, function(torrent) {
    // Allowed online streaming file extensions: mp4, m4a, m4v
    // Refer to: https://webtorrent.io/faq
    torrent.deselect(0, torrent.pieces.length - 1, false)
  })

  torrentID = props.torrentID
}

// Switch between videos
var switchVideo = (props) => {
  client.remove(torrentID)
  $("#video-container .video-wrapper").html('')

  displayVideo(props)
}

// Set the peer id for verication
var setPeerId = (peerId) => {
  client.destroy()
  client = new WebTorrent({
    peerId: peerId,
    dht: false
  })
}


class Video extends React.Component {
  constructor() {
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
  componentWillMount() {
    const token = Auth.getToken()
    $.ajax({
      url: '/api/peerId',
      headers: { 'Authorization': `bearer ${token}` },
      contentType: 'application/json',
      method: 'GET'
    }).done((data) => {
      setPeerId(data.peer_id)
      this.forceUpdate()
    }).fail(() => {
      throw new ERROR('There is an error when getting peer Id.')
    })
  }
  componentDidMount() {
    var topBar = $('#video-topbar')
    var videoContainer = $('#video-container')
    var videoPlaylist = $('#video-playlist')
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
        if ($("#video-components").css("display") === "block") {
          e.preventDefault()
        }
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
      videoPlaylist.removeClass('is-visible')
      videoContainer.css('cursor', 'none')
    })
    var activityCheck = setInterval(() => {
      if (userActivity) {
        // Reset the activity tracker
        userActivity = false

        videoControls.addClass('is-visible')
        topBar.addClass('is-visible')
        videoPlaylist.addClass('is-visible')
        videoContainer.css('cursor', 'auto')
        clearTimeout(autohideControls)
        // In X seconds, if no more activity has occurred
        // the user will be considered inactive
        autohideControls = setTimeout(function() {
          videoControls.removeClass('is-visible')
          topBar.removeClass('is-visible')
          videoPlaylist.removeClass('is-visible')
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

    var videoHeigth = $('#video-container video').height()
    if ($('#video-container').height() !== videoHeigth) {
      $('#video-container').height(videoHeigth)
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
          {!this.state.videoLoaded &&
          <div id='video-loader'>
            <div className='loader-inner ball-pulse'></div>
            <p></p>
          </div>
          }
          <div id='video-topbar'>
            <div className='close' onClick={this.closeVideo}></div>
            <div className='title'>Title</div>
          </div>
          <div className="video-wrapper">
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
          <Playlist />
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

    this.download = this.download.bind(this)
    this.mouseoverStyle = this.mouseoverStyle.bind(this)
    this.mouseoutStyle = this.mouseoutStyle.bind(this)
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({ progress: client.progress })
    }, 1000)
  }
  // Trick to download video
  download() {
    var file = client.torrents[0].files[0]
    file.getBlobURL((err, url) => {
      var a = document.createElement('a')
      a.download = file.name
      a.href = url
      a.click()
      a.remove()
    })
  }
  mouseoverStyle() {
    $('#progress-ring-1').attr('stroke', '#e50914')
    $('#video-status text').css('opacity', '1')
  }
  mouseoutStyle() {
    $('#progress-ring-1').attr('stroke', 'rgba(255,255,255,.15)')
    $('#video-status text').css('opacity', '0')
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
    if (progress == 0 && downloaded > 500000) {
      progress = 1
    }
    const strokeDashoffset = this.circumference - progress * this.circumference

    return (
      <div id='video-status' onMouseOver={this.mouseoverStyle} onMouseOut={this.mouseoutStyle}>
        <svg
          height={this.radius * 2}
          width={this.radius * 2}
        >
          <circle
            id = 'progress-ring-1'
            stroke='rgba(255,255,255,.15)'
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
            id = 'progress-ring-2'
            stroke='rgba(255,255,255,.15)'
            fill='transparent'
            strokeWidth={this.stroke}
            r={this.normalizedRadius}
            cx={this.radius}
            cy={this.radius}
          />
          {progress == 1 ? 
            <text
              id='video-get-buffer'
              fill='#EC5862'
              fontFamily='Font Awesome\ 5 Free'
              fontWeight='900'
              fontSize='15px'
              textAnchor='middle'
              alignmentBaseline='central'
              cursor='pointer'
              x={this.radius}
              y={this.radius}
              onClick={this.download}
            >
              {'\uf019'}
            </text>
          :
            <text
              fill='white'
              fontFamily='Arial, Font Awesome\ 5 Free, sans-serif'
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

class Playlist extends React.Component {
  constructor() {
    super()

    this.state = {
      files: []
    }
  }

  componentDidMount() {
    setInterval(() => {
      let files
      if (client.torrents[0]) {
        files = client.torrents[0].files
      }
      if (files && this.state.files != files) {
        this.setState({ files: files })
      }
    }, 1000)
  }

  handleClick(e) {
    // remove previous video
    $("#video-container .video-wrapper").html('')
    
    const torrent = client.torrents[0]
    torrent.deselect(0, torrent.pieces.length - 1, false)

    const file = torrent.files.find((file) => {
      return file.name === e.target.innerHTML
    })
    file.select()
    $('#video-topbar .title').html(file.name.substring(0, file.name.lastIndexOf('.')))
    
    // if (file.length / (1024 * 1024 * 1024) > 2) {
    //   $('#video-loader .loader-inner').hide()
    //   $('#video-loader p').html('Warning: size of video larger than 2GB.')
    // } else {
    //   file.appendTo('#video-container .video-wrapper')
    // }
    file.appendTo('#video-container .video-wrapper')
  }

  togglePlaylist() {
    $('#video-playlist ul').toggleClass('hide')
    $('#video-playlist .tgl-btn').toggleClass('hide')
  }

  render() {
    const videos = this.state.files.filter((file) => {
      return file.name.endsWith('.mp4') || file.name.endsWith('.m4a') || file.name.endsWith('.m4v')
    })
    if (videos) {
      var playlist = videos.map(function (t, i) {
        return (<li key={uuidv8()} onClick={this.handleClick}>{t.name}</li>)
      }.bind(this))
    }

    return (
      <div id='video-playlist'>
        <div className='tgl-btn' onClick={this.togglePlaylist}></div>
        <ul>{playlist}</ul>
      </div>
    )
  }
}

export { Video, displayVideo, switchVideo, setPeerId }
