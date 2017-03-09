import { h, Component } from 'preact';
import { hashHistory } from 'react-router';
import { appStore } from 'lib/data/stores';

export default class View extends Component {
    
  constructor(props) {
    super(props);

    // We do this here because we need to do it within a component maintained 
    // under the Route system.
    
    if ( ! appStore.isAppSetup() && (this.constructor.name !== 'Setup') ) {
    	hashHistory.push('setup');
    }
  }

}