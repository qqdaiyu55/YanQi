import React from 'react'
import { withRouter } from 'react-router-dom'
import Auth from '../modules/Auth'
import { displayVideo, switchVideo } from '../containers/Video'
import Modal from '../components/Modal'
import EditVideoCard from '../components/EditVideoCard'
import { uuidv8 } from '../modules/Library'
import clipboard from 'clipboard-polyfill'

class VideoPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        title: '',
        backdrop: '',
        tags: [],
        rscInfo: [],
        introduction: ''
      }
    };

    this.loadContent = this.loadContent.bind(this)
    this.openEditVideoModal = this.openEditVideoModal.bind(this)
    this.searchTag = this.searchTag.bind(this)
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
      url: '/api/video',
      data: data,
      headers: {"Authorization": `bearer ${token}`},
      cache: false,
      contentType: 'application/x-www-form-urlencoded',
      method: 'GET'
    }).done((data)=>{
      this.setState({
        data: {
          title: data.title,
          backdrop: data.backdrop,
          tags: data.tags,
          rscInfo: data.rsc_info,
          introduction: data.introduction
        }
      })
    }).fail(()=>{
      console.log("There has an error.");
    });
  }
  openEditVideoModal() {
    const data = this.state.data;
    $("#edit-video-card .title").val(data.title)
    $("#edit-video-card .intro").val(data.introduction);

    const passData = {
      backdrop: data.backdrop,
      tags: data.tags,
      rscInfo: data.rscInfo
    };

    $("#edit-video-card").css({"visibility":"visible", "opacity":"1"});
    // Set the EditVideoCard to edit mode and pass data
    // $("#videopage-data").val(JSON.stringify(passData));
    $("#videopage-data").val(this.props.match.params.id);
  }
  searchTag(e) {
    this.props.history.push('/search/tag='+e.target.innerHTML)
  }
  render() {
    const title = this.state.data.title;
    const backdrop = this.state.data.backdrop;
    const tags_data = this.state.data.tags;
    const rscInfo = this.state.data.rscInfo;
    const introduction = this.state.data.introduction;
    if (tags_data) {
      var tags = tags_data.map(function(t, i) {
        return (<li key={uuidv8()} onClick={this.searchTag}>{t}</li>);
      }.bind(this));
    }
    if (rscInfo) {
      var rsc = rscInfo.map(function(t, i) {
        return(
          <RscCard key={uuidv8()} data={t} />
        )
      })
    }
    return (
      typeof title !== "undefined" &&
      <div className="videopage-content">
        <div className="cover-title-wrapper" style={{backgroundImage: 'url(/backdrop/' + backdrop + ')'}}>
          <div className="title">
            <h1>{title}</h1>
          </div>
          <div className="overlay"></div>
            <div className="buttons-wrapper" onClick={this.openEditVideoModal}><i className="fa fa-pencil-square-o"></i></div>
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
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.copyMagnet = this.copyMagnet.bind(this)
  }
  handleClick(e) {
    if (e.target.tagName !== 'I') {
      if ($("#video-components").css("display") === "none") {
        $("#video-components").show()
        displayVideo({ 
          title: this.props.data[0],
          torrentID: this.props.data[2]
        })
      }
      else {
        switchVideo({
          title: this.props.data[0],
          torrentID: this.props.data[2]
        })
      }
    }
  }
  copyMagnet(e) {
    clipboard.writeText(e.target.nextSibling.innerHTML)
  }
  render() {
    const data = this.props.data;
    return (
      <li onClick={this.handleClick}>
        <div>{data[0]}</div>
        <div>{data[1]}</div>
        <div><i className="fa fa-magnet rsc-magnet" onClick={this.copyMagnet}></i><div className="magnet-content">{data[2]}</div></div>
      </li>
    );
  }
}

export default withRouter(VideoPage)
