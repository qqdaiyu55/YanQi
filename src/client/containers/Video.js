import React from 'react'
// var WebTorrent = require('webtorrent')
import WebTorrent from 'webtorrent/webtorrent.min'

const client = new WebTorrent({ dht: false })
var torrentID = ''

// Announces list
// global.WEBTORRENT_ANNOUNCE = [ 'wss://tracker.fastcast.nz' ]

// Display webtorrent video
function displayVideo(props) {
  client.add(props.torrentID, function(torrent) {
    const file = torrent.files.find(function (file) {
      return file.name.endsWith('.mp4')
    })

    file.appendTo('#videoWarp')
  })

  torrentID = props.torrentID
}

class Video extends React.Component {
  constructor(props) {
    super()

    this.closeVideo = this.closeVideo.bind(this)
  }
  // close the popup (hide it) and remove video
  closeVideo() {
    document.getElementsByClassName("VideoPopup")[0].style.display = 'none'
    client.remove(torrentID)

    const video = document.getElementById("videoWarp")
    video.removeChild(video.firstChild)
  }
  render() {
    return (
      <div className="VideoPopup">
        <span onClick={this.closeVideo} className="close">&times;</span>
        <div id="videoWarp"></div>
      </div>
    );
  }
}

export {Video, displayVideo};
