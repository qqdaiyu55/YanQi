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
  componentDidMount() {
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
    console.log(title);
    console.log(backDrop);
    return (
      <div>
        <div className="cover-title-wrapper" style={{backgroundImage: 'url(/backdrop/' + backDrop + ')'}}>
          <div className="title">
            <h1>{title}</h1>
          </div>
          <div className="overlay"></div>
        </div>
      </div>
    )
  }
}

export default VideoPage;
