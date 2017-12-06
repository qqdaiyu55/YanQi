import React from 'react';
import Auth from '../modules/Auth';

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
          <li>
            <div>{t[0]}</div>
            <div>{t[1]}</div>
            <div><i className="fa fa-magnet rsc-magnet"></i><div className="magnet-content">{t[2]}</div></div>
          </li>
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

export default VideoPage;
