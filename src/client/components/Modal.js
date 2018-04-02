import React from 'react'
import PropTypes from 'prop-types'

class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      backgroundStyle: {
        visibility: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        left: '0',
        top: '0',
        width: '100vw',
        height: '100vh',
        opacity: '0',
        transition: 'opacity .5s',
        zIndex: '1000'
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.show != this.props.show) {
      // A trick to update object in component state, to avoid read-only error.
      let backgroundStyle = Object.assign({}, this.state.backgroundStyle)
      backgroundStyle['visibility'] = (nextProps.show === true) ? 'visible' : 'hidden'
      backgroundStyle['opacity'] = (nextProps.show === true) ? '1' : '0'
      this.setState({backgroundStyle})
    }
  }
  render() {
    return (
      <div id={this.props.id} style={this.state.backgroundStyle}>
        {this.props.children}
      </div>
    );
  }
}

Modal.propTypes = {
  show: PropTypes.bool,
  id: PropTypes.string,
  children: PropTypes.node
}


export default Modal
