import React from 'react';
import TitleList from '../components/TitleList';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchUrl: ''
    }
  }
  componentDidMount() {
    let term = this.props.match.params.term;
    this.setState({
      searchUrl: '?q='+term
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.term !== this.props.match.params.term) {
      this.setState({
        searchUrl: '?q='+nextProps.match.params.term
      });
    }
  }
  render() {
    return (
      <div className="search-results-wrapper">
        <TitleList title="Search Results" url={this.state.searchUrl} />
      </div>
    );
  }
}

export default SearchPage;
