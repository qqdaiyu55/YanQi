import React from 'react'
import Auth from '../modules/Auth'
import { Link } from 'react-router-dom'

class TitleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      mounted: false
    }

    this.loadContent = this.loadContent.bind(this)
  }
  loadContent() {
    let requestUrl = '/api/videos' + this.props.url
    const token = encodeURIComponent(Auth.getToken())
    $.ajax({
      url: requestUrl,
      headers: { 'Authorization': `bearer ${token}` },
      cache: false,
      contentType: 'application/x-www-form-urlencoded',
      method: 'GET'
    }).done((data) => {
      this.setState({data: data})
    }).fail(() => {
      console.log('There has an error on loading search results.')
    })
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.url !== this.props.url && nextProps.url !== ''){
      this.setState({
        mounted: true,
        url: nextProps.url
      }, () => {
        this.loadContent()
      });
    }
  }
  componentDidMount() {
    if(this.props.url !== ''){
      this.loadContent()
      this.setState({ mounted:true })
    }
  }
  render() {
    let titles =''
    if(this.state.data.hits) {
      titles = this.state.data.hits.map(function(v, i) {
        if (i < 30) {
          let name = v._source.title
          let backdrop = '/backdrop/' + v._source.backdrop
          let id = v._id

          return (
            <Item key={id} id={id} title={name} backdrop={backdrop} />
          );

        } else {
          return (<div key={v._id}></div>)
        }
      });

    }

    return (
      <div ref='titlecategory' className='search-items-list' data-loaded={this.state.mounted}>
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
        <ListToggle id={this.props.id}/>
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
  handleClick(e) {
    if (this.state.liked === true) {
      this.setState({ liked: false })
    } else {
      this.setState({ liked: true })
    }

    var requestUrl = '/update/videolist'
    const token = encodeURIComponent(Auth.getToken())
    const data = {
      token: token,
      videoId: this.props.id,
      add: this.state.liked
    }

    $.ajax({
      url: requestUrl,
      headers: { 'Authorization': `bearer ${token}` },
      data: JSON.stringify(data),
      cache: false,
      contentType: 'application/json',
      method: 'POST'
    }).fail(() => {
      console.log('There is an error when updating video list.')
    })

    // e.handler.toggleClass('is_animating');
    // e.handler.on('animationend', function(){
    //   $(this).toggleClass('is_animating');
    // });
    // $('.heart').toggleClass('is_animating');
    // $('.heart').on('animationend', function(){
    //   $(this).toggleClass('is_animating');
    // });

    /*when the animation is over, remove the class*/
    // $(".heart").on('animationend', function(){
    //   $(this).toggleClass('is_animating');
    // });
  }
  render() {
    return (
      // <div onClick={this.handleClick} data-toggled={this.state.toggled} className='item-list-toggle'>
      //   <div>
      //     <i className='fa fa-fw fa-plus'></i>
      //     <i className='fa fa-fw fa-check'></i>
      //   </div>
      // </div>
      <div className='heart' onClick={this.handleClick}></div>
    );
  }
}


export default TitleList
