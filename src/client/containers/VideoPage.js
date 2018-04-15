import React from 'react'
import { withRouter } from 'react-router-dom'
import Auth from '../modules/Auth'
import { displayVideo, switchVideo } from '../containers/Video'
import Modal from '../components/Modal'
import EditVideoCard from '../components/EditVideoCard'
import { uuidv8 } from '../modules/Library'
import clipboard from 'clipboard-polyfill'
var Tracker = require('bittorrent-tracker')

class VideoPage extends React.Component {
  constructor(props) {
    super(props)
    
    this.announce = [
      // 'wss://tracker.btorrent.xyz'
      // 'wss://tracker.openwebtorrent.com'
      // 'wss://tracker.fastcast.nz'
      'ws://localhost:6969'
    ]

    this.state = {
      data: {
        title: '',
        backdrop: '',
        tags: [],
        rscInfo: [],
        introduction: ''
      },
      seeders: [],
      liked: false
    }

    this.loadContent = this.loadContent.bind(this)
    this.getLiked = this.getLiked.bind(this)
    this.addToList = this.addToList.bind(this)
    this.openEditVideoModal = this.openEditVideoModal.bind(this)
    this.searchTag = this.searchTag.bind(this)
  }

  componentWillMount() {
    this.getLiked()
    this.loadContent()
  }

  loadContent() {
    const id = this.props.match.params.id
    const token = encodeURIComponent(Auth.getToken())

    const data = `id=${id}`
    $.ajax({
      url: '/api/video',
      data: data,
      headers: {'Authorization': `bearer ${token}`},
      contentType: 'application/json',
      method: 'GET'
    }).done((data)=>{
      this.setState({
        data: {
          title: data.title,
          backdrop: data.backdrop,
          tags: data.tags,
          rscInfo: data.rsc_info,
          introduction: data.introduction
        }
      })

      var infoHash = data.rsc_info.map((r) => {
        return r[2].split('magnet:?xt=urn:btih:')[1]
      })
      var seeders = new Array(infoHash.length).fill(0)
      Tracker.scrape({ announce: this.announce, infoHash: infoHash }, ((err, results) => {
        if (err) {
          throw err
          return
        }
        if (infoHash.length > 1) {
          var i
          for (i = 0; i < infoHash.length; i++) {
            seeders[i] = results[infoHash[i]].complete
          }
        } else {
          seeders[0] = results.complete
        }
        this.setState({ seeders: seeders })
      }).bind(this))
    }).fail(()=>{
      console.log("There has an error.")
    })
  }

  // Update user's favorate videos list when click 'like/dislike' button
  addToList() {
    if (this.state.liked === true) {
      this.setState({ liked: false })
    } else {
      this.setState({ liked: true })
    }

    const id = this.props.match.params.id
    const token = Auth.getToken()
    const data = {
      token: token,
      videoId: id,
      add: this.state.liked
    }

    $.ajax({
      url: '/update/videolist',
      headers: { 'Authorization': `bearer ${token}` },
      data: JSON.stringify(data),
      contentType: 'application/json',
      method: 'POST'
    }).fail(() => {
      console.log('There is an error when updating video list.')
    })
  }

  // Get to know if the user likes this video
  getLiked() {
    const id = this.props.match.params.id

    const token = Auth.getToken()
    $.ajax({
      url: '/api/videolist/id',
      headers: { 'Authorization': `bearer ${token}` },
      contentType: 'application/json',
      method: 'GET'
    }).done((data) => {
      if (data.video_list.includes(id)) {
        this.setState({ liked: true })
      }
    }).fail(() => {
      console.log('There is an error when getting video list.')
    })
  }

  openEditVideoModal() {
    $('#edit-video-card').css({ "visibility":"visible", "opacity":"1" })
    $('#edit-video-card-flag').val(this.props.match.params.id)
    $('#edit-video-card-flag').click()
  }

  searchTag(e) {
    this.props.history.push('/search/tag='+e.target.innerHTML)
  }

  render() {
    const title = this.state.data.title
    const backdrop = this.state.data.backdrop
    const tags_data = this.state.data.tags
    const rscInfo = this.state.data.rscInfo
    var introduction = this.state.data.introduction
    var seeders = this.state.seeders
    if (tags_data) {
      var tags = tags_data.map(function(t, i) {
        return (<li key={uuidv8()} onClick={this.searchTag}>{t}</li>)
      }.bind(this))
    }
    if (rscInfo) {
      var rsc = rscInfo.map(function(t, i) {
        return(
          <RscCard key={uuidv8()} data={t} seeder={seeders[i]} />
        )
      })
    }

    return (
      typeof title !== "undefined" &&
      <div className="videopage-content">
        <div className="cover-title-wrapper" style={{backgroundImage: 'url(/backdrop/' + backdrop + ')'}}>
          <div className="title">
            <h1>{title}</h1>
          </div>
          <div className="overlay"></div>
          <div className="buttons-wrapper">
            <i className='fa fa-heart' data-toggled={this.state.liked} onClick={this.addToList}></i>
            <i className='fas fa-pencil-alt' onClick={this.openEditVideoModal}></i>
          </div>
        </div>
        <div className="tags">
          <ul>{tags}</ul>
        </div>
        <div className="videopage-rsc">
          <div className="videopage-cards-wrapper">
            <ul>{rsc}</ul>
          </div>
        </div>
        <article className='intro'>
          {introduction}
        </article>
      </div>
    )
  }
}

// Video resource card component
class RscCard extends React.Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.copyMagnet = this.copyMagnet.bind(this)
  }

  // Play the video when clicking any part of the card except magnet button
  handleClick(e) {
    if (e.target.tagName !== 'I') {
      if ($("#video-components").css("display") === "none") {
        $("#video-components").show()
        displayVideo({ 
          title: this.props.data[0],
          torrentID: this.props.data[2]
        })
      }
      else {
        switchVideo({
          title: this.props.data[0],
          torrentID: this.props.data[2]
        })
      }
    }
  }

  // Copy the magnet link when clicking magnet button
  copyMagnet(e) {
    clipboard.writeText(e.target.nextSibling.innerHTML)
  }

  render() {
    const data = this.props.data
    const seeder = this.props.seeder
    return (
      <li onClick={this.handleClick}>
        <div className='visual-info'>{data[0]}</div>
        <div className='visual-info'>
          <span><i className='fa fa-arrow-circle-up rsc-icon'></i>{seeder}</span>
          <span><i className='fa fa-file rsc-icon'></i>{data[1]}</span>
        </div>
        <div className='magnet-info'><i className="fa fa-magnet rsc-magnet" onClick={this.copyMagnet}></i><div className="magnet-content">{data[2]}</div></div>
      </li>
    );
  }
}

export default withRouter(VideoPage)
