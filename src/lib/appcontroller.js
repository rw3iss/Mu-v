import EventBus from 'eventbusjs'
import auth from 'lib/util/auth'
import { hashHistory } from 'react-router'
import { appStore } from 'lib/data/stores'

// Does app-wide things like error handling, view orchestration, etc

class AppController {
	constructor() {
		this.bindEvents();
	}

	bindEvents() {
		var sef = this;	

		// this.onAppInit = this.onAppInit.bind(this);
		// this.onAppError = this.onAppError.bind(this);
		// this.onUserLoggedIn = this.onUserLoggedIn.bind(this);
		// this.onAppRequestsLogin = this.onAppRequestsLogin.bind(this);

		EventBus.addEventListener('APP_INIT', this.onAppInit);
		EventBus.addEventListener('APP_ERROR', this.onAppError);
 		EventBus.addEventListener("USER_LOGGED_IN", this.onUserLoggedIn);
		//EventBus.addEventListener("APP_NEEDS_LOGIN", this.onAppRequestsLogin);
	}

	// bootstraps the apps, sets up app-wide events
	onAppInit(e) {
	}

	onUserLogin(e) {
    	this.loadUserData();
	}

	// onAppRequestsLogin(e) {
	// 	auth.logout();
 	//  hashHistory.push('login');
	// }

	onAppError(e) {
		if(e.target.type == 'connection') {
			alert("Connection error.");
		}
	}
}

let appController = new AppController();
module.exports = appController;