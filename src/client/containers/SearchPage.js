import React from 'react'
import Auth from '../modules/Auth'
import VideoList from '../components/VideoList'

class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      videolist: [],
      searchTerm: ''
    }

    this.loadContent = this.loadContent.bind(this)
    this.getVideoList = this.getVideoList.bind(this)
  }
  componentDidMount() {
    const parsedQuery = this.props.match.params.term.split('=')
    var flag = 0
    if (parsedQuery[0] === 'title') flag = 0
    if (parsedQuery[0] === 'tag') flag = 1

    if (parsedQuery[1] !== '') {
      this.loadContent(parsedQuery[1], flag)
      this.getVideoList()
      this.setState({ searchTerm: parsedQuery[1] })
    }
  }
  componentWillReceiveProps(nextProps) {
    const parsedQuery = nextProps.match.params.term.split('=')
    if (nextProps.match.params.term !== this.props.match.params.term && parsedQuery[1] !== '') {
      var flag = 0
      if (parsedQuery[0] === 'title') flag = 0
      if (parsedQuery[0] === 'tag') flag = 1

      this.getVideoList()
      this.loadContent(parsedQuery[1], flag)
      this.setState({ searchTerm: parsedQuery[1] })
    }
  }
  // Search for title
  loadContent(searchTerm, flag) {
    var baseUrl = ''
    if (flag === 0) baseUrl = '/api/videos?q=title:'
    if (flag === 1) baseUrl = '/api/videos?q=tag:'
    var requestUrl = baseUrl + searchTerm
    const token = Auth.getToken()
    $.ajax({
      url: requestUrl,
      headers: { 'Authorization': `bearer ${token}` },
      contentType: 'application/x-www-form-urlencoded',
      method: 'GET'
    }).done((data) => {
      const cleanData = data.hits.map((v) => {
        return ({
          id: v._id,
          title: v._source.title,
          backdrop: v._source.backdrop,
        })
      })
      this.setState({ data: cleanData })
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
      this.setState({ videolist: data.video_list })
    }).fail(() => {
      console.log('There is an error when getting video list.')
    })
  }
  render() {
    return (
      <div className="search-results-wrapper">
        <div className="title">Search Results for <p>{this.state.searchTerm}</p></div>
        <VideoList data={this.state.data} videolist={this.state.videolist} />
      </div>
    )
  }
}

export default SearchPage
