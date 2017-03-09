import { h, Component } from 'preact';
import { hashHistory } from 'react-router';
import EventBus from 'eventbusjs'

import appController from 'lib/appcontroller';
import Routes from './routes';
import Header from './shared/header';
import Loginprompt from './shared/loginprompt';
import { appStore } from 'lib/data/stores';

import style from './style/global';

export default class App extends Component {

	constructor(props, context) {
		super(props);
		EventBus.dispatch("APP_INIT");
	}

	render() {
		return (
			<div id="app" class="app">
				<Routes />
			</div>
		);
	}
}
