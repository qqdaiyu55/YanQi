import React from 'react'
import TagsInput from 'react-tagsinput'
import Auth from '../modules/Auth'
import ImageCompressor from '@xkeshi/image-compressor'
import { uuidv8 } from '../modules/Library'

class EditVideoCard extends React.Component {
  constructor() {
    super()

    this.rscCardStatus = {
      addNew: true,
      rscId: '',
      count: 1
    }
    this.mode = 'add'
    this.coverChanged = false
    this.videoId = ''
    this.state = {
      cover: null,
      isCoverUploaded: false,
      tags: []
    }

    this.previewCover = this.previewCover.bind(this)
    this.removeCover = this.removeCover.bind(this)

    this.handleTagsChange = this.handleTagsChange.bind(this)

    this.addResource = this.addResource.bind(this)
    this.submitResourceInfo = this.submitResourceInfo.bind(this)
    this.cancelEditResource = this.cancelEditResource.bind(this)
    this.handleRsc = this.handleRsc.bind(this)

    this.resetComponent = this.resetComponent.bind(this)
    this.closeCard = this.closeCard.bind(this)
    this.submitCard = this.submitCard.bind(this)

    this.loadContent = this.loadContent.bind(this)

    this.dispNotification = this.dispNotification.bind(this)
  }
  componentDidMount() {
    $('.horizon-scroll ul').sortable({
      axis: 'x',
      animation_direction: 'x',
      animation: 200
    })
  }

  // Load content on 'edit' mode
  loadContent(id) {
    this.videoId = id
    const token = encodeURIComponent(Auth.getToken())

    const data = `id=${id}`
    $.ajax({
      url: '/api/video',
      data: data,
      headers: {'Authorization': `bearer ${token}`},
      contentType: 'application/x-www-form-urlencoded',
      method: 'GET'
    }).done((data)=>{
      this.mode = 'edit'
      data.rsc_info.forEach((e) => {
        this.handleRsc(true, {
          title: e[0],
          size: e[1],
          magnet: e[2]
        })
      })

      this.setState({
        isCoverUploaded: true,
        tags: data.tags
      })

      $('#cover-img').attr('src', '/backdrop/'+data.backdrop)
      $('#edit-video-card .title').val(data.title)
      $('#edit-video-card .intro').val(data.introduction)
    }).fail(()=>{
      console.log('There has an error getting video information.')
    })
  }

  // Preview uploaded cover
  previewCover(e) {
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader()

      reader.onload = (event) => {
        $('#cover-img').attr('src', event.target.result)
      }
      reader.readAsDataURL(e.target.files[0])
      this.setState({
        isCoverUploaded: true
      })

      this.coverChanged = true
    }
  }

  // Remove cover
  //  * trigger: true->trigger by resetComponent, false: trigger by remove cover button
  removeCover(trigger) {
    var r = true
    if (!trigger) {
      var r = confirm('Do you want to remove the backdrop?')
    }
    if (r) {
      $("#cover-img").attr('src', '#')
      $("#upload-cover").val('')
      if (this.mode === 'edit') {
        this.coverChanged = true
      }

      this.setState({
        isCoverUploaded: false
      })
    }
  }

  // Create new resource card and add info
  addResource() {
    this.rscCardStatus.addNew = true
    $('#edit-resource-card input').val('')
    $('#edit-resource-card').css({ 'visibility':'visible', 'opacity':'1', 'top':'50%' })
  }

  // Clear text and hide the resource edit card when cancelling
  cancelEditResource() {
    this.setState({
      tempResourceInfo: {
        title: '',
        size: null,
        magnet: ''
      }
    })
    $('#edit-resource-card input').val('')
    $('#edit-resource-card').css({ 'visibility':'hidden', 'opacity':'0', 'top':'60%' })
  }

  // Handle resource info
  //  * addNew: true -> add mode, false -> edit mode
  //  * data: new resource info
  handleRsc(addNew, data) {
    let title = data.title,
        size = data.size,
        magnet = data.magnet

    if (addNew) {
      let rsc_id = this.rscCardStatus.count.toString()

      $(".horizon-scroll ul").append(
        '<li class="ui-sortable-handle" id="rsc-card-'+rsc_id+'">'+
        '<div class="item">'+title+'</div>'+
        '<div class="item">'+size+'</div>'+
        '<div class="item">'+'<i class="fa fa-magnet rsc-magnet"></i>'+'<div  class="magnet-content">'+magnet+'</div></div>'+
        '</li>'
      )

      // Edit the resource when clicking
      $("#rsc-card-"+rsc_id).click((e) => {
        let rsc = $(e.target).parent('.ui-sortable-handle')
        let rsc_id = rsc.attr('id')
        let rsc_info = rsc.html()
        let tmp = rsc_info.match('<div class="item">(.*?)</div><div class="item">(.*?)</div><div class="item">.*?content">(.*?)</div></div>')

        $('#edit-resource-card input[name="title"]').val(tmp[1])
        $('#edit-resource-card input[name="size"]').val(tmp[2].split(' ')[0])
        $('#edit-resource-card select').val(tmp[2].split(' ')[1])
        $('#edit-resource-card input[name="magnet"]').val(tmp[3])
        this.rscCardStatus.addNew = false
        this.rscCardStatus.rscId = rsc_id
        $('#edit-resource-card').css({ "visibility":"visible", "opacity":"1", "top":"50%" })
      })

      this.rscCardStatus.count += 1
    } else {
      let rsc = $('#'+this.rscCardStatus.rscId)

      // Assign new value
      rsc.children().eq(0).html(title)
      rsc.children().eq(1).html(size)
      rsc.children().eq(2).children('div').html(magnet)
    }
  }

  // Create new resource card
  submitResourceInfo() {
    const tempResourceInfo = $("#edit-resource-card input").map(function() {
      return this.value
    }).get()
    let title = tempResourceInfo[0],
        size = tempResourceInfo[1],
        size_type = $("#edit-resource-card select").val(),
        magnet = tempResourceInfo[2]

    // Check if there's an empty field
    if (!title || !size || !magnet) {
      alert('Please check if all the values are filled.')
      return
    }
    // Check if size has non-numeric character
    if (size.match(/[^$.\d]/)) {
      alert('Size cannot contain non numeric characters.')
      return
    }
    // Verify the magnet link
    if (!magnet.match(/magnet:\?xt=urn:btih:[a-z0-9]{20,50}/i)) {
      alert('Please check the magnet link format.')
      return
    }

    size = size + ' ' + size_type

    this.handleRsc(this.rscCardStatus.addNew, {
      title: title,
      size: size,
      magnet: magnet
    })

    // Clear text and hide edit card
    $('#edit-resource-card input').val('')
    $('#edit-resource-card').css({ 'visibility':'hidden', 'opacity':'0', 'top':'60%' })
  }

  // Handle changes of tags
  handleTagsChange(tags) {
    this.setState({tags})
  }

  resetComponent() {
    $("#edit-video-card").css({ 'visibility':'hidden', 'opacity':'0' })
    this.removeCover(true)
    $("#edit-video-card .title").val('')
    this.cancelEditResource()
    this.setState({
      tags: []
    })
    $("#edit-video-card .horizon-scroll ul").html('')
    $("#edit-video-card .intro").val('')
    this.mode = 'add'
    this.coverChanged = false
  }

  // Close card and clear content
  closeCard() {
    var r = confirm('Do you really want to leave?')
    if (r === true) {
      this.resetComponent()
    }
  }

  dispNotification(success) {
    // remove class
    if ($('#notification').hasClass('show-success')) {
      $('#notification').removeClass('show-success')
    }
    if ($('#notification').hasClass('show-error')) {
      $('#notification').removeClass('show-error')
    }
    // add class to trigger animation
    if (success) {
      setTimeout(()=>{
        $('#notification').addClass('show-success')
      }, 200)
    } else {
      setTimeout(() => {
        $('#notification').addClass('show-error')
      }, 200)
    }
  }

  // Submit all information to server
  submitCard() {
    var r = confirm('Do you want to submit the information now?')
    if (r === true) {
      // Get information
      const title = $("#edit-video-card .title").val()
      const htmlRscInfo = $("#edit-video-card .horizon-scroll ul").children().map(function() {
        return this.innerHTML
      }).get()
      var rscInfo = []
      htmlRscInfo.forEach((e) => {
        var tmp = e.match('<div class="item">(.*?)</div><div class="item">(.*?)</div><div class="item">.*?content">(.*?)</div></div>')
        tmp = [tmp[1], tmp[2], tmp[3].split('&')[0]]
        rscInfo.push(tmp)
      })
      const tags = this.state.tags
      const introduction = $("#edit-video-card .intro").val()

      // Check if title or rscInfo is empty
      if (!title) {
        alert('Title is empty!')
        return
      }
      if (!rscInfo.length) {
        alert('Resource Information is empty!')
        return
      }

      // Check if fields of resource information are available
      // e.g. if size has non numeric characters or magnet link format is right
      let isRight = true
      rscInfo.forEach((t) => {
        let title = t[0]
        let size = t[1].split(' ')[0]
        let magnet = t[2]

        // Check if size has non-numeric character
        if (size.match(/[^$.\d]/)) {
          alert(title+':\nSize cannot contain non numeric characters.')
          isRight = false
        }

        // Verify the magnet link
        if (!magnet.match(/magnet:\?xt=urn:btih:[a-z0-9]{20,50}/i)) {
          alert(title+':\nPlease check the magnet link format.')
          isRight = false
        }
      });
      if (!isRight) return

      // Cover file
      var cover = $("#upload-cover")[0]
      var file = cover.files[0]
      var backdrop
      if (this.mode === 'add' && !file) {
        alert('Cover is empty.')
        return
      }

      // Genrate a random unique filename
      if (file) {
        var splitFileName = file.name.split('.')
        var backdrop = uuidv8() + uuidv8()
        // extension
        var ext = splitFileName[splitFileName.length - 1]
        var backdropName = backdrop + '.' + ext
        var backdropThumbnailName = backdrop + '_thumbnail.' + ext
      }

      // Post the information
      const token = Auth.getToken()
      const data = {
        id: this.videoId,
        mode: this.mode,
        coverChanged: this.coverChanged,
        title: title,
        backdrop: backdropName,
        rscInfo: rscInfo,
        tags: tags,
        introduction: introduction
      }

      $.ajax({
        url: '/upload/video',
        headers: { 'Authorization': `bearer ${token}` },
        data: JSON.stringify(data),
        contentType: 'application/json',
        responseType: 'json',
        method: 'POST'
      }).done(() => {
        console.log('Success on uploading video information.')

        // show notification
        $('#notification').html('SUCCESS')
        this.dispNotification(true)
        // $('#notification').remove()
      }).fail(() => {
        console.log('There is an error when uploading video information.')

        // show notification
        $('#notification').html('ERROR')
        this.dispNotification(false)
      })

      // Compress and upload backdrop to server
      if (this.coverChanged && file) {
        const imageCompressor = new ImageCompressor()
        imageCompressor.compress(file, {maxWidth: 500}).then((result) => {
          var fd = new FormData()
          // Append backdrop file and set the filename
          fd.append('backdrop', file, backdropName)
          fd.append('backdrop_thumbnail', result, backdropThumbnailName)
          // A trick: set contentType to false, so the boundary will be added automatically
          $.ajax({
            url: '/upload/backdrop',
            headers: { "Authorization": `bearer ${token}` },
            data: fd,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST'
          }).done(() => {
            console.log('Successfully upload backdrop.')
          }).fail(() => {
            console.log('There is an error when uploading backdrop.')
          })
        }).catch((err) => {
          console.log('Something wrong when compressing backdrop.')
        })
      }

      this.resetComponent()
    }
  }

  render() {
    return (
      <div className="Video-card">
        <div className="cover-wrapper">
          { this.state.isCoverUploaded &&
            <div className="cover-img-wrapper">
              <div onClick={()=>this.removeCover(false)}><i className="fa fa-fw fa-times"></i></div>
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
          <div className="cards-wrapper"><ul></ul></div>
        </div>
        <TagsInput value={this.state.tags} onChange={this.handleTagsChange} />
        <textarea className="intro" required placeholder="Input introduction.."></textarea>
        <div className="button-wrapper">
          <i onClick={this.closeCard} className="fa fa-fw fa-times"></i>
          <i onClick={this.submitCard} className="fa fa-fw fa-check"></i>
        </div>
        <input type='hidden' id='edit-video-card-flag' value='' onClick={(e)=>{this.loadContent(e.target.value)}} />
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
  <div className='resource-text-input'>
		<input
      name={name}
			autoComplete="false"
			required
			type={type}
			placeholder={placeholder}
		/>
    { name === 'size' &&
      <select>
        <option value='MB'>MB</option>
        <option value='GB'>GB</option>
        <option value='KB'>KB</option>
      </select>
    }
    <label htmlFor={name}></label>
	</div>
)

export default EditVideoCard
