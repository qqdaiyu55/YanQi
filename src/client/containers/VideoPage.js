import React from 'react';
import Auth from '../modules/Auth';
import { displayVideo, switchVideo } from '../containers/Video.js';

class VideoPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {}
    };

    this.loadContent = this.loadContent.bind(this);
  }
  componentWillMount() {
    this.loadContent();
  }
  loadContent() {
    const id = this.props.match.params.id;
    const requestUrl = '/api/video';
    const token = encodeURIComponent(Auth.getToken());

    const data = `id=${id}`;
    $.ajax({
      url: requestUrl,
      data: data,
      headers: {"Authorization": `bearer ${token}`},
      cache: false,
      contentType: 'application/x-www-form-urlencoded',
      method: 'GET'
    }).done((data)=>{
      this.setState({data: data});
    }).fail(()=>{
      console.log("There has an error.");
    });
  }
  render() {
    const title = this.state.data.title;
    const backDrop = this.state.data.backDrop;
    const tags_data = this.state.data.tags;
    const rscInfo = this.state.data.rscInfo;
    const introduction = this.state.data.introduction;
    if (tags_data) {
      var tags = tags_data.map(function(t, i) {
        return (<li>{t}</li>);
      });
    }
    if (rscInfo) {
      var rsc = rscInfo.map(function(t, i) {
        return(
          <RscCard data={t} />
        )
      })
    }
    return (
      typeof title !== "undefined" &&
      <div className="videopage-content">
          <div className="cover-title-wrapper" style={{backgroundImage: 'url(/backdrop/' + backDrop + ')'}}>
            <div className="title">
              <h1>{title}</h1>
            </div>
            <div className="overlay"></div>
          </div>
          <div className="tags">
            <ul>{tags}</ul>
          </div>
          <div className="videopage-rsc">
            <div className="videopage-cards-wrapper">
              <ul>{rsc}</ul>
            </div>
          </div>
          <div className="intro">
            <p>{introduction}</p>
          </div>
      </div>
    )
  }
}

class RscCard extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    if ($("#video-popup").css("display") == "none") {
      $("#video-popup").show();
      displayVideo({torrentID: this.props.data[2]});
    }
    else {
      switchVideo({torrentID: this.props.data[2]});
    }
  }
  render() {
    const data = this.props.data;
    return (
      <li onClick={this.handleClick}>
        <div>{data[0]}</div>
        <div>{data[1]}</div>
        <div><i className="fa fa-magnet rsc-magnet"></i><div className="magnet-content">{data[2]}</div></div>
      </li>
    );
  }
}

export default VideoPage;
