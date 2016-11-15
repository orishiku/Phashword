import React from 'react';
import SiteAdmin from './siteAdmin.jsx';
import ProfileSettings from './profileSettings.jsx';
import GlobalSettings from './global-settings.jsx';
import { Tabs, Pane } from '../popup/tabs.jsx';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sites: props.sites || [],
      profiles: props.profiles || [],
      toggleKey: 'Escape',
      defaultState: false,
    };
  }
  componentDidMount() {
    this.props.dispatch({ type: 'SETTINGS_READY' });
  }
  render() {
    return (
      <div>
        <Tabs>
          <Pane label={this.props.translate('options')}>
            <GlobalSettings
              dispatch={this.props.dispatch}
              defaultState={this.state.defaultState}
              toggleKey={this.state.toggleKey}
              translate={this.props.translate}
            />
          </Pane>
          <Pane label={this.props.translate('profiles')}>
            <ProfileSettings
              profiles={this.state.profiles}
              dispatch={this.props.dispatch}
              translate={this.props.translate}
            />
          </Pane>
          <Pane label={this.props.translate('sites')}>
            <SiteAdmin
              sites={this.state.sites}
              onDelete={this.props.onSiteDelete}
              translate={this.props.translate}
            />
          </Pane>
        </Tabs>
      </div>
    );
  }
}

Settings.propTypes = {
  onSiteDelete: React.PropTypes.func,
  dispatch: React.PropTypes.func.isRequired,
  sites: React.PropTypes.array,
  profiles: React.PropTypes.array,
  defaultState: React.PropTypes.bool,
  toggleKey: React.PropTypes.string,
  translate: React.PropTypes.func,
};

Settings.defaultProps = {
  translate: (id) => id,
};
