import React from 'react';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 400,
      height: 400
    };
    this.backgroundStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      position: 'fixed',
      left: '0',
      top: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '6'
    };
  }

  render() {
    return (
      <div style={this.backgroundStyle}>
        {this.props.children}
      </div>
    );
  }
}


export default Modal;
