import { h, Component } from 'preact';
import { serializeForm } from 'lib/util/js-utils';
import { store, cookie } from 'util/storage'
import classNames from 'classnames';
import EventBus from 'eventbusjs'

import auth from 'lib/util/auth'
//import UserApi from 'lib/data/api/userapi';
//import { userStore } from 'lib/data/stores/userstore';

import style from './style';


export default class LoginPrompt extends Component {

	constructor() {
		super();
		var self = this;

    	this.loginSubmit = this.loginSubmit.bind(this);

		EventBus.addEventListener("APP_NEEDS_LOGIN", function(r) {
			cl('show')
			self.setState({ enabled: true });
		});

		EventBus.addEventListener("USER_LOGGED_IN", function(r) {
			self.setState({ enabled: false });
		});

		EventBus.addEventListener("USER_LOGGED_OUT", function(r) {
			self.setState({ enabled: true });
		});

		EventBus.addEventListener("HIDE_LOGIN", function(r) {
			self.setState({ enabled: false });
		});
	}

	loginSubmit(e) {
		var self = this;
		e.preventDefault();
		var form = document.getElementById('login-form');
		var creds = serializeForm(form);
		delete creds.submit; //todo: remove

		auth.login(creds)
			.then((r) => {
				console.log("login result", r);
			})
			.catch((e) => {
				console.log("login error", e);
				this.setState({ errors: e.errors });
			});
	}

	componentWillMount() {
    	this.setState({
    		enabled: this.props.enabled,
    		errors: null
    	});
	}
	componentWillReceiveProps(nextProps) {
	}

	render() {
		var self = this;
		// var liClasses = classNames(style.log{
		// 	'loginprompt': true,
		// 	'enabled': this.props.enabled
	 //    });
		return (
			<div class={classNames(style.loginprompt, this.state.enabled ? style.enabled : false)}>
				<h1>Login Prompt</h1>
				<form id="login-form" action="" onsubmit={this.loginSubmit}>
					<input type="text" placeholder="Username or E-mail" name="login" />
					<input type="password" placeholder="Password" name="password" />
					<input type="submit" name="submit" value="Submit"/>
				</form>
				{(self.state.errors ?
					<div class="errors">
						<ul>
							{self.state.errors.map(function(e) {
				            	return <li>{e}</li>;
				        	})}
						</ul>
					</div>
					: <div></div>
				)}
			</div>
		);
	}
}
