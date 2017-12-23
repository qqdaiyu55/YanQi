import React from 'react'
// var WebTorrent = require('webtorrent')
import WebTorrent from 'webtorrent/webtorrent.min'
// const Spinner = require('react-spinkit')

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
  }
  componentDidMount() {
    $("#video-container").draggable()
    $('.loader-inner').loaders()

    var play_pause     = $('#video-container .playButton'),
        container      = $('#video-container'),
        playIcon       = $('#video-container .playButton .playPause'),
        video          = $('#video-container video'),
        play           = $('#video-container .play'),
        volume         = $('#video-container .volume .icon'),
        volumeIntesity = $('#video-container .volume .intensityBar'),
        intensity      = $('#video-container .intensity'),
        progressBar    = $('#video-container .progressBar'),
        progress       = $('#video-container .progressBar .progress'),
        timer          = $('#video-container .intialTime'),
        vidDuration    = $('#video-container .fullTime'),
        expandButton   = $('#video-container .scale'),
        overlayScreen  = $('#video-container .overlay'),
        timeState      = $('#video-container .time'),
        overlayButton  = $('#video-container .overlay .button'),
        update

    play_pause.click(()=>{
      var video = $('#video-container video').get(0)
      if (video.paused) {
        video.play()
      }
      else {
        video.pause()
      }
    })
    // progressBar.click(function () {skip() })
    // progressBar.mousemove(function () { timeState.text(getTimeState()) })
    //
    // volume.click(function () { toggleMute(); });
    //
    // expandButton.click(function () {
    //
    //    $(this).toggleClass('active');
    //
    //    if ($(this).hasClass('active')) {
    //      $('#controls').addClass('is-visible');
    //      fullScreen();
    //   } else {
    //      $('#controls').removeClass('is-visible');
    //      exitTheFullScreen();
    //   }
    // })

    // volumeIntesity.click(function () { changeVolume(); });

    // overlayButton.click(function () { playVid();});

    // vidDuration.text(getFormatedFullTime());


  }
  // close the popup (hide it) and remove video
  closeVideo() {
    $("#video-container").hide();
    client.remove(torrentID);

    $("#video-container .video-wrapper").html('');
  }
  render() {
    return (
      <div id="video-container">
        <span onClick={this.closeVideo} className="close">&times;</span>

        <div className="loader-inner ball-pulse"></div>
        <div className="video-wrapper"></div>
        <div id="video-controls">
          <div className='overlay'></div>
          <div className="playButton">
            <div className="playPause"></div>
          </div>
          <div className="ProgressContainer">
            <div className="timer intialTime">00:00</div>
            <div className="progressBar">
              <div className="progress"></div>
            </div>
            <div className="time">00:00/16:00</div>
            {/* <div className="timer fullTime">00:00</div> */}
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
      </div>
    );
  }
}

export { Video, displayVideo, switchVideo }
