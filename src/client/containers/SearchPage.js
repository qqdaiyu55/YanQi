import React from 'react'
import Auth from '../modules/Auth'
import VideoList from '../components/VideoList'
import InfiniteScroll from 'react-infinite-scroller'

class SearchPage extends React.Component {
  constructor(props) {
    super(props)

    this.size = 20
    this.videolist = []
    this.state = {
      data: [],
      searchTerm: '',
      type: '',
      hasMoreItems: true,
      start: 0
    }

    this.loadContent = this.loadContent.bind(this)
    this.getVideoList = this.getVideoList.bind(this)
  }

  componentWillMount() {
    const parsedQuery = this.props.match.params.term.split('=')

    if (parsedQuery[1] !== '') {
      // this.loadContent(parsedQuery[1], parsedQuery[0])
      this.getVideoList()
      this.setState({ searchTerm: parsedQuery[1], type: parsedQuery[0] })
    }
  }

  componentWillReceiveProps(nextProps) {
    const parsedQuery = nextProps.match.params.term.split('=')
    console.log(parsedQuery)

    if (nextProps.match.params.term !== this.props.match.params.term && parsedQuery[1] !== '') {
      // this.loadContent(parsedQuery[1], parsedQuery[0])
      this.getVideoList()
      this.setState({
        data: [],
        searchTerm: parsedQuery[1],
        type: parsedQuery[0],
        hasMoreItems: true,
        start: 0 })
    }
  }

  // Search for title
  loadContent() {
    const searchTerm = this.state.searchTerm
    const type = this.state.type

    const token = Auth.getToken()
    $.ajax({
      url: '/api/videos',
      headers: { 'Authorization': `bearer ${token}` },
      contentType: 'application/json',
      data: { term: searchTerm, type: type, start: this.state.start, size: this.size },
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
      console.log('There has an error on loading search results.')
    })
  }

  // Get list of videos the user liked
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
      console.log('There is an error when getting video list.')
    })
  }
  
  render() {
    const loader = <div className="loader-inner line-scale scroll-loader"></div>

    return (
      <div className="search-results-wrapper">
        <div className="title">Search Results for <p>{this.state.searchTerm}</p></div>
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

export default SearchPage
