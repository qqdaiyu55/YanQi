import React from 'react'
import Auth from '../modules/Auth'
import VideoList from '../components/VideoList'

class MyList extends React.Component {
  constructor() {
    super()

    this.state = {
      data: [],
      videolist: []
    }

    this.loadContent = this.loadContent.bind(this)
  }

  componentDidMount() {
    this.loadContent()
  }

  // Get list of videos the user liked
  loadContent() {
    const token = Auth.getToken()
    $.ajax({
      url: '/api/videolist/all',
      headers: { 'Authorization': `bearer ${token}` },
      contentType: 'application/json',
      method: 'GET'
    }).done((results) => {
      const videolist = results.data.map((v) => {
        return v.id
      })
      this.setState({
        data: results.data,
        videolist: videolist
      })
    }).fail(() => {
      console.log('There is an error when getting video list.')
    })
  }
  
  render() {
    return (
      <div className="search-results-wrapper">
        <div className="title">My List</div>
        <VideoList data={this.state.data} videolist={this.state.videolist} />
      </div>
    )
  }
}

export default MyList
