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
    this.cancelEditResource = this.cancelEditResource.bind(this);
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
    $('#edit-resource-card').show();
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
    $("#edit-resource-card").find("input").val("");
    $('#edit-resource-card').hide();
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
    let resourceLists = this.state.resourceLists;
    let tempResourceInfo = this.state.tempResourceInfo;;
    resourceLists.push(tempResourceInfo);
    tempResourceInfo = {
      title: '',
      size: null,
      magnet: ''
    };
    this.setState({
      resourceLists,
      tempResourceInfo
    });

    // Clear text and hide edit card
    $("#edit-resource-card").find("input").val("");
    $("#edit-resource-card").hide();

    // If the resources is none previously, set isResourceEmpty true create new resource card
    if (this.state.isResourceEmpty) {
      this.setState({isResourceEmpty: false});
    }
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
        <input type="text" className="title" required placeholder="Input Title"></input>
        <div className="horizon-scroll">
          <div className="add-button" onClick={this.addResource}><i className="fa fa-fw fa-plus"></i></div>
          <EditResourceCard onSubmit={this.submitResourceInfo} cancel={this.cancelEditResource} onChange={this.resourceInfoChange} />
          {
            this.state.isResourceEmpty &&
            <div className="no-resources">NO RESOURCES</div>
          }
          {
            !this.state.isResourceEmpty &&
            <ResourceCardsList data={this.state.resourceLists} />
          }
        </div>
        <TagsInput value={this.state.tags} onChange={this.handleTagsChange} />
        <input type="text" className="intro" required placeholder="Input introduction.."></input>
      </div>
    );
  }
}

// class ResourceCardsList extends React.Component {
//   constructor(props) {
//     super(props);
//     this.cards = [];
//
//     this.loadContent = this.loadContent.bind(this);
//   }
//
//   componentWillReceiveProps(nextProps) {
//     if(nextProps.url !== this.props.url && nextProps.url !== ''){
//       this.setState({mounted:true,url:nextProps.url},()=>{
//         this.loadContent();
//       });
//     }
//   }
//
//   loadContent() {
//
//   }
//
//   render() {
//     let cards = [];
//
//     return (
//       <div className="resource-cards">
//         <ResourceCard title={this.test.title} size={this.test.size} magnet={this.test.magnet} />
//       </div>
//     );
//   }
// }

// const SortableItem = SortableElement(({item}) =>
//   <ResourceCard title={item.title} size={item.size} magnet={item.magnet} />
// );
//
// const SortableList = SortableContainer(({items}) => {
//   return (
//     <ul>
//       {items.map((value, index) => (
//         <SortableItem key={`item-${index}`} index={index} value={value} />
//       ))}
//     </ul>
//   );
// });

// class SortableComponent extends Component {
//   constructor(props) {
//     super(props);
//   }
//   onSortEnd = ({oldIndex, newIndex}) => {
//     this.setState({
//       items: arrayMove(this.state.items, oldIndex, newIndex)
//     });
//   };
//   render() {
//     return <SortableList axis="x" items={this.props.items} onSortEnd={this.onSortEnd} />;
//   }
// }

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
    <button onClick={onSubmit}>Submit</button>
    <button onClick={cancel}>Cancel</button>
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
