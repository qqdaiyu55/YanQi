import React from 'react'
// var WebTorrent = require('webtorrent')
import WebTorrent from 'webtorrent/webtorrent.min'

const client = new WebTorrent({ dht: false })
var torrentID = ''

// Announces list
global.WEBTORRENT_ANNOUNCE = [
  'udp://[2604:a880:1:20::f:e001]:8000',
  'ws://[2604:a880:1:20::f:e001]:8000'
]

// Display webtorrent video
function displayVideo(props) {
  client.add(props.torrentID, function(torrent) {
    const file = torrent.files.find(function (file) {
      return file.name.endsWith('.mp4')
    })

    file.appendTo("#video-popup .video-wrapper");

    // A trick to get loaded video intrinsic height
    setInterval(()=>{
      let video_height = $("#video-popup video").height();
      let video_wrapper_height = $("#video-popup .video-wrapper").height();
      if (video_height !== video_wrapper_height) {
        $('#video-popup .video-wrapper').css('height', video_height);
      }
    }, 1000);
  })

  torrentID = props.torrentID
}
function switchVideo(props) {
  client.remove(torrentID);
  $("#video-popup .video-wrapper").html('');

  displayVideo(props);
}


class Video extends React.Component {
  constructor(props) {
    super()

    this.closeVideo = this.closeVideo.bind(this)
  }
  componentDidMount() {
    $("#video-popup").draggable();
  }
  // close the popup (hide it) and remove video
  closeVideo() {
    $("#video-popup").hide();
    client.remove(torrentID);

    $("#video-popup .video-wrapper").html('');
  }
  render() {
    return (
      <div id="video-popup">
        <span onClick={this.closeVideo} className="close">&times;</span>
        <div className="video-wrapper"></div>
      </div>
    );
  }
}

export { Video, displayVideo, switchVideo };
