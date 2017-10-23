import React from 'react';

class EditVideoCard extends React.Component {
  constructor() {
    super();

    this.state = {
      cover: null,
      isCoverUploaded: false
    };

    this.previewCover = this.previewCover.bind(this);
  }

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

  render() {
    return (
      <div className="videoCard">
        <div className="cover-wrapper">
          { this.state.isCoverUploaded &&
            <div className="coverImg-wrapper">
              <img id="coverImg" src="#" />
            </div>
          }
          { !this.state.isCoverUploaded && <div className="cover" onClick={()=>{$("#uploadCover").click();}}>COVER</div> }
          <input type="file" id="uploadCover" style={{display:"none"}} onChange={(e)=>this.previewCover(e)}/>
        </div>
        {/* <img src="" height="200" alt="Image preview..."/> */}
      </div>
    );
  }
}

export default EditVideoCard;
