import React from 'react';
import Auth from '../modules/Auth';

class TitleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: [], mounted: false};

    this.loadContent = this.loadContent.bind(this);
  }
  loadContent() {
    let requestUrl = '/api/videos' + this.props.url;
    const token = encodeURIComponent(Auth.getToken());
    $.ajax({
      url: requestUrl,
      headers: {"Authorization": `bearer ${token}`},
      cache: false,
      contentType: 'application/x-www-form-urlencoded',
      method: 'GET'
    }).done((data)=>{
      this.setState({data: data});
    }).fail(()=>{
      console.log("There has an error on searching.");
    });
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.url !== this.props.url && nextProps.url !== ''){
      this.setState({mounted:true,url:nextProps.url},()=>{
        this.loadContent();
      });
    }
  }
  componentDidMount() {
    if(this.props.url !== ''){
      this.loadContent();
      this.setState({mounted:true});
    }
  }
  render() {
    let titles ='';
    if(this.state.data.hits) {
      titles = this.state.data.hits.map(function(v, i) {
        if (i < 5) {
          var name = v._source.title;
          var backDrop = '/backdrop/' + v._source.backDrop;
          console.log(backDrop);

          return (
            <Item key={v._id} title={name} backdrop={backDrop} />
          );

        } else {
          return (<div key={title.id}></div>);
        }
      });

    }

    return (
      <div ref="titlecategory" className="TitleList" data-loaded={this.state.mounted}>
        <div className="Title">
          <h1>{this.props.title}</h1>
          <div className="titles-wrapper">
            {titles}
          </div>
        </div>
      </div>
    );
  }
}

// Title List Item
class Item extends React.Component {
  render() {
    return (
      <div className="Item" style={{backgroundImage: 'url(' + this.props.backdrop + ')'}} >
        <div className="overlay">
          <div className="title">{this.props.title}</div>
        </div>
        <ListToggle />
      </div>
    );
  }
}

// ListToggle
class ListToggle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {toggled: false}

    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    if(this.state.toggled === true) {
      this.setState({ toggled: false });
    } else {
      this.setState({ toggled: true });
    }
  }
  render() {
    return (
      <div onClick={this.handleClick} data-toggled={this.state.toggled} className="ListToggle">
        <div>
          <i className="fa fa-fw fa-plus"></i>
          <i className="fa fa-fw fa-check"></i>
        </div>
      </div>
    );
  }
}


export default TitleList;
