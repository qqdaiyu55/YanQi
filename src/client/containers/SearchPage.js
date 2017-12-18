import React from 'react'
import TitleList from '../components/TitleList'

class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchUrl: ''
    }
  }
  componentDidMount() {
    var term = this.props.match.params.term
    this.setState({
      searchUrl: '?q=title:'+term
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.term !== this.props.match.params.term) {
      this.setState({
        searchUrl: '?q=title:'+nextProps.match.params.term
      })
    }
  }
  render() {
    return (
      <div className="search-results-wrapper">
        <div className="title">Search Results for <p style={{'color': 'red'}}>{this.props.match.params.term}</p></div>
        <TitleList url={this.state.searchUrl} />
      </div>
    );
  }
}

export default SearchPage;
