import React from 'react'
import Auth from '../modules/Auth'
import VideoList from '../components/VideoList'
import InfiniteScroll from 'react-infinite-scroller'

class NewList extends React.Component {
  constructor() {
    super()

    this.size = 20
    this.videolist = []
    this.state = {
      data: [],
      hasMoreItems: true,
      start: 0
    }

    this.loadContent = this.loadContent.bind(this)
    this.getVideoList = this.getVideoList.bind(this)
  }

  componentWillMount() {
    this.getVideoList()
  }

  // Get list of newest updated videos
  loadContent() {
    const token = Auth.getToken()
    $.ajax({
      url: '/api/new',
      headers: { 'Authorization': `bearer ${token}` },
      contentType: 'application/json',
      data: { start: this.state.start, size: this.size },
      method: 'GET'
    }).done((results) => {
      var start = this.state.start + this.size

      // Load new items.
      // If return empty data, stop scroll loading.
      if (results.data.length > 0) {
        var data = this.state.data
        results.data.forEach(d => {
          data.push(d)
        })

        this.setState({
          data: data,
          start: start
        })
      }
      else {
        this.setState({
          hasMoreItems: false
        })
      }
    }).fail(() => {
      console.log('There is an error when getting new videos list.')
    })
  }

  // Get the list of videos the user liked
  getVideoList() {
    const token = Auth.getToken()
    $.ajax({
      url: '/api/videolist/id',
      headers: { 'Authorization': `bearer ${token}` },
      contentType: 'application/json',
      method: 'GET'
    }).done((data) => {
      this.videolist = data.video_list
    }).fail(() => {
      console.log("There is an error when getting user's favorate videos list.")
    })
  }

  render() {
    const loader = <div className="loader-inner line-scale scroll-loader"></div>

    return (
      <div className="search-results-wrapper">
        <div className="title">Newest</div>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadContent}
          hasMore={this.state.hasMoreItems}
          loader={loader}>
          <VideoList data={this.state.data} videolist={this.videolist} />
        </InfiniteScroll>
      </div>
    )
  }
}

export default NewList
