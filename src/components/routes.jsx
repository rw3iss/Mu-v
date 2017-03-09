import { h, Component } from 'preact';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import EventBus from 'eventbusjs'

import auth from 'lib/util/auth'

import AppContainer from './shared/appcontainer';
import Home from './views/home';
import Setup from './views/setup';
import Login from './views/login';
import Library from './views/library';
import Discover from './views/discover';
import Movie from './views/movie';
import Player from './views/player';


export default class Routes extends Component {

	constructor() {
		super();
		this.requireAuth = this.requireAuth.bind(this);
	}

	routeChanged(e) {
		console.log("Route changed");
	}

	requireAuth(e) {
		if ( ! auth.loggedIn() ) {
			browserHistory.push('/login');
			//EventBus.dispatch("APP_NEEDS_LOGIN");
		}
	}

	componentWillMount() {
		var self = this;
		EventBus.addEventListener('USER_LOGGED_IN', (e) => {
			cl("User logged in event");
			self.forceUpdate();
		});

		EventBus.addEventListener('USER_LOGGED_OUT', (e) => {
			cl("User logged out event");
			self.forceUpdate();
		});
	}

	render() {
		var self = this; 
		return (
			<Router routeChange={this.routeChanged.bind(this)} history={hashHistory}>
				<Route path="/" component={AppContainer}>
					<IndexRoute component={Home} />
					<Route path="setup" component={Setup} />
					<Route path="library" component={Library} />
					<Route path="discover" component={Discover} />
					<Route path="player" component={Player} />
					<Route path="movie/:id" component={Movie} />
				</Route>
			</Router>
		)
	}
}