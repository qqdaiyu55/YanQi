import React from 'react';
import TagsInput from 'react-tagsinput';
import Auth from '../modules/Auth';

class EditVideoCard extends React.Component {
  constructor() {
    super();

    this.rscCardStatus = {
      addNew: true,
      rscId: '',
      count: 1
    };
    this.mode = 'add';
    this.state = {
      cover: null,
      isCoverUploaded: false,
      tags: []
    };

    this.previewCover = this.previewCover.bind(this);
    this.removeCover = this.removeCover.bind(this);

    this.handleTagsChange = this.handleTagsChange.bind(this);

    this.addResource = this.addResource.bind(this);
    this.submitResourceInfo = this.submitResourceInfo.bind(this);
    this.cancelEditResource = this.cancelEditResource.bind(this);
    this.handleRsc = this.handleRsc.bind(this);

    this.closeCard = this.closeCard.bind(this);
    this.submitCard = this.submitCard.bind(this);

    this.loadConten = this.loadContent.bind(this);
  }
  componentWillUnmount() {
    console.log('Unmounted.');
  }
  componentWillMount() {
    console.log('Mounting.');
  }
  componentDidMount() {
    $(".horizon-scroll ul").sortable({
      axis: 'x',
      animation_direction: 'x',
      animation: 200
    });

    $(".Video-card").droppable({greedy: true});

    setInterval(() => {
      const passData_str = $("#videopage-data").val();
      if (passData_str) {
        // const passData = JSON.parse(passData_str);
        $("#videopage-data").val("");
        //
        // this.mode = 'edit';
        // console.log(passData);
        // passData.rscInfo.forEach((e) => {
        //   this.handleRsc(true, {
        //     title: e[0],
        //     size: e[1],
        //     magnet: e[2]
        //   });
        // });
        //
        // this.setState({
        //   isCoverUploaded: true,
        //   tags: passData.tags
        // });
        //
        // $("#cover-img").attr('src', '/backdrop/'+passData.backDrop);
        this.loadContent(passData_str);
      }
    }, 200);
  }
  loadContent(id) {
    console.log(this.refs.myRef);
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
      this.mode = 'edit';
      data.rscInfo.forEach((e) => {
        this.handleRsc(true, {
          title: e[0],
          size: e[1],
          magnet: e[2]
        });
      });

      // if (this.refs.myRef) {
      //   this.setState({
      //     isCoverUploaded: true,
      //     tags: data.tags
      //   });
      // }
      this.setState({
        isCoverUploaded: true,
        tags: data.tags
      });

      $("#cover-img").attr('src', '/backdrop/'+data.backDrop);
    }).fail(()=>{
      console.log("There has an error.");
    });
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
    $("#upload-cover").val("");
    this.setState({
      isCoverUploaded: false
    });
  }

  // create new resource card and add info
  addResource() {
    this.rscCardStatus.addNew = true;
    $("#edit-resource-card input").val("");
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

  handleRsc(addNew, data) {
    let title = data.title,
        size = data.size,
        magnet = data.magnet;

    if (addNew) {
      let rsc_id = this.rscCardStatus.count.toString();

      $(".horizon-scroll ul").append(
        '<li class="ui-sortable-handle" id="rsc-card-'+rsc_id+'">'+
        '<div class="item">'+title+'</div>'+
        '<div class="item">'+size+'</div>'+
        '<div class="item">'+'<i class="fa fa-magnet rsc-magnet"></i>'+'<div  class="magnet-content">'+magnet+'</div></div>'+
        '</li>'
      );

      // Edit the resource when clicking
      $("#rsc-card-"+rsc_id).click((e) => {
        let rsc = $(e.target).parent('.ui-sortable-handle');
        let rsc_id = rsc.attr('id');
        let rsc_info = rsc.html();
        let tmp = rsc_info.match('<div class="item">(.*?)</div><div class="item">(.*?)</div><div class="item">.*?content">(.*?)</div></div>');

        $('#edit-resource-card input[name="title"]').val(tmp[1]);
        $('#edit-resource-card input[name="size"]').val(tmp[2].split(' ')[0]);
        $('#edit-resource-card select').val(tmp[2].split(' ')[1]);
        $('#edit-resource-card input[name="magnet"]').val(tmp[3]);
        this.rscCardStatus.addNew = false;
        this.rscCardStatus.rscId = rsc_id;
        $('#edit-resource-card').css({"visibility":"visible", "opacity":"1", "top":"50%"});
      });

      this.rscCardStatus.count += 1;
    } else {
      let rsc = $('#'+this.rscCardStatus.rscId);

      // Assign new value
      rsc.children().eq(0).html(title);
      rsc.children().eq(1).html(size);
      rsc.children().eq(2).children('div').html(magnet);
    }
  }

  // Create new resource card
  submitResourceInfo() {
    const tempResourceInfo = $("#edit-resource-card input").map(function() {
      return this.value;
    }).get();
    let title = tempResourceInfo[0],
        size = tempResourceInfo[1],
        size_type = $("#edit-resource-card select").val(),
        magnet = tempResourceInfo[2];

    // Check if there's an empty field
    if (!title || !size || !magnet) {
      alert('Please check if all the values are filled.');
      return;
    }

    // Check if size has non-numeric character
    if (size.match(/[^$.\d]/)) {
      alert('Size cannot contain non numeric characters.');
      return;
    }

    // Verify the magnet link
    if (!magnet.match(/magnet:\?xt=urn:btih:[a-z0-9]{20,50}/i)) {
      alert('Please check the magnet link format.');
      return;
    }

    size = size + ' ' + size_type;

    this.handleRsc(this.rscCardStatus.addNew, {
      title: title,
      size: size,
      magnet: magnet
    });

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
    htmlRscInfo.forEach((e) => {
      var tmp = e.match('<div class="item">(.*?)</div><div class="item">(.*?)</div><div class="item">.*?content">(.*?)</div></div>');
      tmp = [tmp[1], tmp[2], tmp[3].split('&')[0]];
      rscInfo.push(tmp);
    });
    const tags = this.state.tags;
    const introduction = $("#edit-video-card .intro").val();

    // Check if title or rscInfo is empty
    if (!title) {
      alert('Title is empty!');
      return;
    }
    if (!rscInfo.length) {
      alert('Resource Information is empty!');
      return;
    }
    // Check if fields of resource information are available
    // e.g. if size has non numeric characters or magnet link format is right
    let isRight = true;
    rscInfo.forEach((t) => {
      let title = t[0];
      let size = t[1].split(' ')[0];
      let magnet = t[2];

      // Check if size has non-numeric character
      if (size.match(/[^$.\d]/)) {
        alert(title+':\nSize cannot contain non numeric characters.');
        isRight = false;
      }

      // Verify the magnet link
      if (!magnet.match(/magnet:\?xt=urn:btih:[a-z0-9]{20,50}/i)) {
        alert(title+':\nPlease check the magnet link format.');
        isRight = false;
      }
    });
    if (!isRight) return;

    // Cover file
    var cover = $("#upload-cover")[0];
    var file = cover.files[0];
    if (!file) {
      alert('Cover is empty.');
      return;
    }

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

  editCard() {
    console.log('YES');
  }

  render() {
    return (
      <div className="Video-card">
        <div className="cover-wrapper" ref="myRef">
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
          <EditResourceCard onSubmit={this.submitResourceInfo} cancel={this.cancelEditResource} />
          {/* <ResourceCardsList data={this.state.resourceLists} /> */}
          <div className="cards-wrapper"><ul></ul></div>
        </div>
        <TagsInput value={this.state.tags} onChange={this.handleTagsChange} />
        <textarea className="intro" required placeholder="Input introduction.."></textarea>
        <div className="button-wrapper">
          <i onClick={this.closeCard} className="fa fa-fw fa-times"></i>
          <i onClick={this.submitCard} className="fa fa-fw fa-check"></i>
        </div>
        <input type="hidden" id="videopage-data" value="" />
      </div>
    );
  }
}

const EditResourceCard = ({
  onSubmit,
  cancel
}) => (
  <div id="edit-resource-card">
    <form>
      <ResourceCardInput name="title" type="text" placeholder="title" />
      <ResourceCardInput name="size" type="text" placeholder="size" />
      <ResourceCardInput name="magnet" type="text" placeholder="magnet" />
    </form>
    <button name="submit" onClick={onSubmit}>Submit</button>
    <button name="cancel" onClick={cancel}>Cancel</button>
  </div>
);

const ResourceCardInput = ({
  name,
  type,
  placeholder
}) => (
  <div className="resource-text-input">
		<input
      name={name}
			autoComplete="false"
			required
			type={type}
			placeholder={placeholder}
		/>
    { name === 'size' &&
      <select>
        <option value="MB">MB</option>
        <option value="GB">GB</option>
        <option value="KB">KB</option>
      </select>
    }
    <label htmlFor={name}></label>
	</div>
);

export default EditVideoCard;
