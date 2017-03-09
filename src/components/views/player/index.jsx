import { h, Component } from 'preact';
import { Link, hashHistory } from 'react-router';
const {dialog} = require('electron').remote;
import { appStore } from 'lib/data/stores'
import Header from 'components/shared/header';
import View from 'components/shared/view';
import style from './style';
var mime = require('mime-types')

// Set initial state

export default class Player extends View {
  constructor(props) {
    super(props);
    console.log("player", this.props, this.props.location.query.path);

    this.setState({ path: this.props.location.query.path });
  }

  render() {
    var self = this;

    return (
      <div id="player" class="view with-header">
        <Header />

        <h1>Media Player</h1>
        
        Playing: { this.state.path }

        <div class="iframe-wrapper">
          <iframe src={ this.state.path } />
        </div>

      </div>
    );
  }
}