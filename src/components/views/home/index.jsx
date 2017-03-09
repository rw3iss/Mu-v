import { h, Component } from 'preact';
import { Link, hashHistory } from 'react-router';
import Animate from 'rc-animate';
import Header from 'components/shared/header';
import View from 'components/shared/view';
import style from './style';
// Set initial state

export default class Home extends View {
  constructor(props) {
    super(props);
  }

  render() {
    return (

      <Animate 
        component=""
        transitionAppear={true}
        transitionLeave={true}
        transitionName="content-transition">

        <div id="home" class="view" key="home">

          <div class="logo">
            μv
          </div>

          <div class="nav-container">
            <nav>
              <a onclick={() => hashHistory.push('library') }>Library</a>
              <a onclick={() => hashHistory.push('discover') }>Discover</a>
              <a onclick={() => hashHistory.push('setup') }>Settings</a>
            </nav>
          </div>

        </div>

      </Animate>
    );
  }
}