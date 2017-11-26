import React from 'react';
import TagsInput from 'react-tagsinput';

class EditVideoCard extends React.Component {
  constructor() {
    super();

    this.state = {
      cover: null,
      isCoverUploaded: false,
      resourceLists: [],
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
    // let resourceLists = this.state.resourceLists;
    // let tempResourceInfo = this.state.tempResourceInfo;
    // resourceLists.push(tempResourceInfo);
    // tempResourceInfo = {
    //   title: '',
    //   size: null,
    //   magnet: ''
    // };
    // this.setState({
    //   resourceLists,
    //   tempResourceInfo
    // });
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

  // handle changes of tags
  handleTagsChange(tags) {
    this.setState({tags});
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
