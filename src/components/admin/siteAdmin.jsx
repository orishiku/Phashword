import React from 'react';
import Radium from 'radium';
import SiteItem from './siteItem.jsx';
import { textInputStyle } from '../style.js';

const itemListStyle = {
  marginTop: '10px',
};

class SiteAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sites: props.sites,
      filter: '',
    };
    this.setFilter = this.setFilter.bind(this);
  }
  setFilter(event) {
    this.setState({ ...this.state, filter: event.target.value });
  }
  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.filter}
          onChange={this.setFilter}
          style={textInputStyle}
        />
        <div style={itemListStyle}>
          {this.props.sites
            .filter((site) => site.id.startsWith(this.state.filter))
            .map((site) => (
              <SiteItem site={site} onDelete={this.props.onDelete} />
          ))}
        </div>
      </div>
    );
  }
}

SiteAdmin.propTypes = {
  sites: React.PropTypes.arrayOf(React.PropTypes.object),
  onDelete: React.PropTypes.func,
};

export default Radium(SiteAdmin);