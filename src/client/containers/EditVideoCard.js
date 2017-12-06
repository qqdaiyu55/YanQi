import React from 'react';
import TagsInput from 'react-tagsinput';
import Auth from '../modules/Auth';

class EditVideoCard extends React.Component {
  constructor() {
    super();

    this.state = {
      cover: null,
      isCoverUploaded: false,
      tempResourceInfo: {
        title: '',
        size: null,
        magnet: ''
      },
      tags: []
    };

    this.previewCover = this.previewCover.bind(this);
    this.removeCover = this.removeCover.bind(this);

    this.handleTagsChange = this.handleTagsChange.bind(this);

    this.addResource = this.addResource.bind(this);
    this.resourceInfoChange = this.resourceInfoChange.bind(this);
    this.submitResourceInfo = this.submitResourceInfo.bind(this);
    this.cancelEditResource = this.cancelEditResource.bind(this);

    this.closeCard = this.closeCard.bind(this);
    this.submitCard = this.submitCard.bind(this);
  }

  componentDidMount() {
    $(".horizon-scroll ul").sortable({
      axis: 'x',
      animation_direction: 'x',
      animation: 200
    });

    $(".Video-card").droppable({greedy: true});
  }

  // Preview uploaded cover
  previewCover(e) {
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event) => {
        $('#cover-img').attr('src', event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
      this.setState({
        isCoverUploaded: true
      });
    }
  }

  // Remove cover
  removeCover() {
    $("#cover-img").attr('src', '#');
    this.setState({
      isCoverUploaded: false
    });
  }

  // create new resource card and add info
  addResource() {
    $('#edit-resource-card').css({"visibility":"visible", "opacity":"1", "top":"50%"});
  }

  // Clear text and hide the resource edit card when cancelling
  cancelEditResource() {
    this.setState({
      tempResourceInfo: {
        title: '',
        size: null,
        magnet: ''
      }
    });
    $("#edit-resource-card input").val("");
    $('#edit-resource-card').css({"visibility":"hidden", "opacity":"0", "top":"60%"});
  }

  // Handle text changes in resource edit card
  resourceInfoChange(event) {
    let field = event.target.name;
    let tempResourceInfo = this.state.tempResourceInfo;
    tempResourceInfo[field] = event.target.value;

    this.setState({
      tempResourceInfo
    });
  }

  // Create new resource card
  submitResourceInfo() {
    const tempResourceInfo = $("#edit-resource-card input").map(function() {
      return this.value;
    }).get();

    $(".horizon-scroll ul").append(
      '<li class="ui-sortable-handle">'+
      '<div>'+tempResourceInfo[0]+'</div>'+
      '<div>'+tempResourceInfo[1]+'</div>'+
      '<div>'+'<i class="fa fa-magnet rsc-magnet"></i>'+'<div class="magnet-content">'+tempResourceInfo[2]+'</div>'+'</div>'+
      '</div></li>');

    // Clear text and hide edit card
    $("#edit-resource-card input").val("");
    $("#edit-resource-card").css({"visibility":"hidden", "opacity":"0", "top":"60%"});
  }

  // Handle changes of tags
  handleTagsChange(tags) {
    this.setState({tags});
  }

  // Close card and clear content
  closeCard() {
    $("#edit-video-card").css({"visibility":"hidden", "opacity":"0"});
    this.removeCover();
    $("#edit-video-card .title").val("");
    this.cancelEditResource();
    this.setState({
      tags: []
    });
    $("#edit-video-card .horizon-scroll ul").html("");
    $("#edit-video-card .intro").val("");
  }

  // Submit all information to server
  submitCard() {
    const title = $("#edit-video-card .title").val();
    const htmlRscInfo = $("#edit-video-card .horizon-scroll ul").children().map(function() {
      return this.innerHTML;
    }).get();
    var rscInfo = []
    htmlRscInfo.forEach(function(e){
      var tmp = e.match('<div>(.*?)</div><div>(.*?)</div><div>.*?content">(.*?)</div></div>');
      tmp = [tmp[1], tmp[2], tmp[3]];
      rscInfo.push(tmp);
    });
    const tags = this.state.tags;
    const introduction = $("#edit-video-card .intro").val();

    // Cover file
    var cover = $("#upload-cover")[0];
    var file = cover.files[0];;

    // Genrate a random unique filename
    var splitFileName = file.name.split('.');
    const backDrop = Math.random().toString(36).substr(2, 9) + '.' + splitFileName[splitFileName.length-1];

    // Get jwt token
    const token = encodeURIComponent(Auth.getToken());
    const formData = `token=${token}`;

    // create an AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/api/uploadVideos');
    xhr.setRequestHeader('Content-type', 'application/json');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${token}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 400) {
        const error = xhr.response.error;
        console.log(error);
      }
    });

    xhr.send(JSON.stringify({
      title: title,
      backDrop: backDrop,
      rscInfo: rscInfo,
      tags: tags,
      introduction: introduction
    }));

    // Send cover to server
    var fd = new FormData();
    // Append cover file and change the name
    fd.append("cover", file, backDrop);
    // fd.append("filename", backDrop, );
    // A trick: set contentType to false, so the boundary will be added automatically
    $.ajax({
      url: '/api/uploadCover',
      headers: {"Authorization": `bearer ${token}`},
      data: fd,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST'
    });

    this.closeCard();
  }

  render() {
    return (
      <div className="Video-card">
        <div className="cover-wrapper">
          { this.state.isCoverUploaded &&
            <div className="cover-img-wrapper">
              <div onClick={this.removeCover}><i className="fa fa-fw fa-times"></i></div>
              <img id="cover-img" src="#" />
            </div>
          }
          { !this.state.isCoverUploaded && <div className="cover" onClick={()=>{$('#upload-cover').click();}}>COVER</div> }
          <input type="file" id="upload-cover" style={{display:"none"}} onChange={(e)=>this.previewCover(e)}/>
        </div>
        <input type="text" className="title" required placeholder="Title"></input>
        <div className="horizon-scroll">
          <a className="add-button" onClick={this.addResource}>+</a>
          <EditResourceCard onSubmit={this.submitResourceInfo} cancel={this.cancelEditResource} onChange={this.resourceInfoChange} />
          {/* <ResourceCardsList data={this.state.resourceLists} /> */}
          <div className="cards-wrapper"><ul></ul></div>
        </div>
        <TagsInput value={this.state.tags} onChange={this.handleTagsChange} />
        <textarea className="intro" required placeholder="Input introduction.."></textarea>
        <div className="button-wrapper">
          <i onClick={this.closeCard} className="fa fa-fw fa-times"></i>
          <i onClick={this.submitCard} className="fa fa-fw fa-check"></i>
        </div>
      </div>
    );
  }
}

const ResourceCard = ({
  title,
  size,
  magnet
}) => (
  <div className="card">
    <div>{title}</div>
    <div>{size}</div>
    <div>{magnet}</div>
  </div>
);

const EditResourceCard = ({
  onSubmit,
  cancel,
  onChange
}) => (
  <div id="edit-resource-card">
    <form>
      <ResourceCardInput name="title" type="text" placeholder="title" onChange={onChange} />
      <ResourceCardInput name="size" type="text" placeholder="size" onChange={onChange} />
      <ResourceCardInput name="magnet" type="text" placeholder="magnet" onChange={onChange} />
    </form>
    <button name="submit" onClick={onSubmit}>Submit</button>
    <button name="cancel" onClick={cancel}>Cancel</button>
  </div>
);

const ResourceCardInput = ({
  name,
  type,
  placeholder,
  onChange
}) => (
  <div className="resource-text-input">
		<input
      name={name}
			autoComplete="false"
			required
			type={type}
			placeholder={placeholder}
      onChange={onChange}
		/>
    <label htmlFor={name}></label>
	</div>
);

export default EditVideoCard;
