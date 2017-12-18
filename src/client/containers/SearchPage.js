import React from 'react'
import Auth from '../modules/Auth'
import VideoList from '../components/VideoList'

class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      videolist: []
    }

    this.loadContent = this.loadContent.bind(this)
    this.getVideoList = this.getVideoList.bind(this)
  }
  componentDidMount() {
    if(this.props.match.params.term !== ''){
      this.loadContent(this.props.match.params.term)
      this.getVideoList()
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.term !== this.props.match.params.term && nextProps.match.params.term !== '') {
      this.loadContent(nextProps.match.params.term)
      this.getVideoList()
    }
  }
  // Search for title
  loadContent(searchTerm) {
    var requestUrl = '/api/videos?q=title:' + searchTerm
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
      console.log(cleanData)
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
      data: JSON.stringify({ token: token }),
      contentType: 'application/json',
      method: 'POST'
    }).done((data) => {
      this.setState({ videolist: data.video_list })
    }).fail(() => {
      console.log('There is an error when getting video list.')
    })
  }
  render() {
    return (
      <div className="search-results-wrapper">
        <div className="title">Search Results for <p style={{'color': 'red'}}>{this.props.match.params.term}</p></div>
        <VideoList data={this.state.data} videolist={this.state.videolist} />
      </div>
    )
  }
}

export default SearchPage
