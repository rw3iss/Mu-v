import Request from './../../util/request'
import EventBus from 'eventbusjs'
import auth from 'lib/util/auth'

export default class Api {
    constructor() {
	    if (this.constructor === Api) {
	      // Error Type 1. Abstract class can not be constructed.
	      throw new TypeError("Can not construct abstract class.");
	    }
	}

	// Talks to the rest of the app when an error occurs 
	handleApiError(r) {
		if (r.code == 401) {
			//auth.logout();
			EventBus.dispatch('APP_NEEDS_LOGIN');
		} else {
			EventBus.dispatch('APP_ERROR', { type: 'connection', error: r });
		}
	}

	// takes a Request object and handles the response
	request(opts) {
		var r = new Request(opts);

		return new Promise((resolve, reject) => {
			r.send()
			.then((r) => {
				if (r.success == false) {
					// parse error
					this.handleApiError(r);
					return reject(r);
				}
				return resolve(r);
			})
			.catch((e) => {
				//todo: check for Api errors and handle
				this.handleApiError(e);
				return reject(e);
			});
		});
	}

	get(url, data) {
		return this.request({
			type: 'get',
			url: url,
			data: data
		});
	}

	post(url, data) {
		return this.request({
			type: 'post',
			url: url,
			data: data
		});
	}

	handleException() {

	}
}


