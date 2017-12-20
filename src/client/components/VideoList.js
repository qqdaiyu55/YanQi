import React from 'react'
import Auth from '../modules/Auth'
import { Link } from 'react-router-dom'

class VideoList extends React.Component {
  constructor(props) {
    super(props);

    this.getItems = this.getItems.bind(this)
  }
  getItems(data) {
    return data.map((v, i) => {
      if (i < 30) {
        var title = v.title
        var backdrop = '/backdrop/' + v.backdrop
        var id = v.id
        var liked = this.props.videolist.includes(id) ? true : false

        return (
          <Item key={id} id={id} title={title} backdrop={backdrop} liked={liked} />
        );

      } else {
        return (<div key={v._id}></div>)
      }
    }, this)
  }
  render() {
    var titles = ''
    if (this.props.data) {
      titles = this.getItems(this.props.data)
    }

    return (
      <div ref='titlecategory' className='search-items-list'>
        <div className='titles-wrapper'>
          {titles}
        </div>
      </div>
    );
  }
}

// Title List Item
class Item extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className='search-item' style={{ backgroundImage: 'url(' + this.props.backdrop + ')' }} >
        <Link to={'/video/'+this.props.id} style={{ textDecoration: 'none' }}>
          <div className='overlay'>
            <div className='item-title'>{this.props.title}</div>
          </div>
        </Link>
        <ListToggle id={this.props.id} liked={this.props.liked} />
      </div>
    );
  }
}

// ListToggle
class ListToggle extends React.Component {
  constructor(props) {
    super(props)
    this.state = { liked: false }

    this.handleClick = this.handleClick.bind(this)
  }
  componentDidMount() {
    this.setState({ liked: this.props.liked })
  }
  handleClick(e) {
    if (this.state.liked === true) {
      this.setState({ liked: false })
    } else {
      this.setState({ liked: true })
    }

    var requestUrl = '/update/videolist'
    const token = Auth.getToken()
    const data = {
      token: token,
      videoId: this.props.id,
      add: this.state.liked
    }

    $.ajax({
      url: requestUrl,
      headers: { 'Authorization': `bearer ${token}` },
      data: JSON.stringify(data),
      contentType: 'application/json',
      method: 'POST'
    }).fail(() => {
      console.log('There is an error when updating video list.')
    })
  }
  render() {
    return (
      <div className='item-list-toggle' data-toggled={this.state.liked} onClick={this.handleClick}></div>
    );
  }
}


export default VideoList
