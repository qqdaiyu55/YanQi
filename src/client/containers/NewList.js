import React from 'react'
import Auth from '../modules/Auth'
import VideoList from '../components/VideoList'

class NewList extends React.Component {
  constructor() {
    super()

    this.state = {
      data: [],
      videolist: []
    }

    this.loadContent = this.loadContent.bind(this)
    this.getVideoList = this.getVideoList.bind(this)
  }
  componentDidMount() {
    this.getVideoList()
    this.loadContent()
  }
  // Get list of videos the user liked
  loadContent() {
    const token = Auth.getToken()
    $.ajax({
      url: '/api/new',
      headers: { 'Authorization': `bearer ${token}` },
      contentType: 'application/json',
      method: 'GET'
    }).done((results) => {
      this.setState({
        data: results.data,
      })
    }).fail(() => {
      console.log('There is an error when getting video list.')
    })
  }
  getVideoList() {
    const token = Auth.getToken()
    $.ajax({
      url: '/api/videolist/id',
      headers: { 'Authorization': `bearer ${token}` },
      contentType: 'application/json',
      method: 'GET'
    }).done((data) => {
      this.setState({ videolist: data.video_list })
    }).fail(() => {
      console.log('There is an error when getting video list.')
    })
  }
  render() {
    return (
      <div className="search-results-wrapper">
        <div className="title">Newest</div>
        <VideoList data={this.state.data} videolist={this.state.videolist} />
      </div>
    )
  }
}

export default NewList
