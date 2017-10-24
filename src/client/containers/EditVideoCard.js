import React from 'react';
import TagsInput from 'react-tagsinput';

class EditVideoCard extends React.Component {
  constructor() {
    super();

    this.state = {
      cover: null,
      isCoverUploaded: false,
      isResourceEmpty: true,
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
  }

  // Preview uploaded cover
  previewCover(e) {
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event) => {
        $('#coverImg').attr('src', event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
      this.setState({
        isCoverUploaded: true
      });
    }
  }

  // Remove cover
  removeCover() {
    $("#coverImg").attr('src', '#');
    this.setState({
      isCoverUploaded: false
    });
  }

  // create new resource card and add info
  addResource() {
    $('#editResourceCard').show();
  }

  cancelEditResource() {
    this.setState({
      tempResourceInfo: {
        title: '',
        size: null,
        magnet: ''
      }
    });
    $('#editResourceCard').hide();
  }

  resourceInfoChange(event) {
    let field = event.target.name;
    let tempResourceInfo = this.state.tempResourceInfo;
    tempResourceInfo[field] = event.target.value;

    this.setState({
      tempResourceInfo
    });
  }

  submitResourceInfo() {
    let resourceLists = this.state.resourceLists;
    let tempResourceInfo = this.state.tempResourceInfo;
    resourceLists = resourceLists.concat(tempResourceInfo);
    tempResourceInfo = {
      title: '',
      size: null,
      magnet: ''
    };
    this.setState({
      resourceLists,
      tempResourceInfo
    });

    console.log(this.state.resourceLists);
    console.log(this.state.tempResourceInfo);

    $("#editResourceCard").hide();
  }

  // handle changes of tags
  handleTagsChange(tags) {
    this.setState({tags});
  }

  render() {
    return (
      <div className="videoCard">
        <div className="cover-wrapper">
          { this.state.isCoverUploaded &&
            <div className="coverImg-wrapper">
              <div onClick={this.removeCover}><i className="fa fa-fw fa-times"></i></div>
              <img id="coverImg" src="#" />
            </div>
          }
          { !this.state.isCoverUploaded && <div className="cover" onClick={()=>{$('#uploadCover').click();}}>COVER</div> }
          <input type="file" id="uploadCover" style={{display:"none"}} onChange={(e)=>this.previewCover(e)}/>
        </div>
        <input type="text" className="title" required placeholder="Input Title"></input>
        <div className="horizonScroll">
          <div className="addButton" onClick={this.addResource}><i className="fa fa-fw fa-plus"></i></div>
          <EditResourceCard onSubmit={this.submitResourceInfo} cancel={this.cancelEditResource} onChange={this.resourceInfoChange} initialValue={this.state.tempResourceInfo}/>
          {
            this.state.isResourceEmpty &&
            <div className="noResources">NO RESOURCES</div>
          }
        </div>
        <TagsInput value={this.state.tags} onChange={this.handleTagsChange} />
        <input type="text" className="intro" required placeholder="Input introduction.."></input>
      </div>
    );
  }
}

const EditResourceCard = ({
  onSubmit,
  cancel,
  onChange,
  initialValue
}) => (
  <div id="editResourceCard">
    <form>
      <ResourceCardInput name="title" type="text" placeholder="title" onChange={onChange} value={initialValue['title']} />
      <ResourceCardInput name="size" type="text" placeholder="size" onChange={onChange} value={initialValue['size']} />
      <ResourceCardInput name="magnet" type="text" placeholder="magnet" onChange={onChange} value={initialValue['magnet']} />
      <button onClick={onSubmit}>Submit</button>
    </form>
    {/* <button onClick={onSubmit}>Submit</button> */}
    <button onClick={cancel}>Clear</button>
  </div>
);

const ResourceCardInput = ({
  name,
  type,
  placeholder,
  onChange
}) => (
  <div className="Input">
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
