// Uses the fetch API (only support in Chrome and Firefox - use polyfills otherwise)
import { cookie, store } from 'util/storage';

// .send() returns a promise
export default class Request {
	// the current request
	request = null;
	type = 'get';
	data = null;
	url = '';
	onSuccess = null;
	onFailure = null;

	constructor(opts = {}) {
		if (typeof opts.type != 'undefined') 
			this.type = opts.type;

		this.url = opts.url ? opts.url : this.url;
		this.data = opts.data ? opts.data : this.data;
		this.onSuccess = opts.onSuccess ? opts.onSuccess : this.onSuccess;
		this.onFailure = opts.onFailure ? opts.onFailure : this.onFailure;
		return this;
	}

	setData(value) {
		this.data = value;
		return this;
	}

	addData(key, value) {
		this.data[key] = value;
		return this;
	}

	setUrl(url) {
		this.url = url;
		return this;
	}

	setType(type) {
		this.type = type;
		return this;
	}

	setSuccessCallback(cb) {
		this.onSuccess = cb;
	}

	setFailureCallback(cb) {
		this.onFailure= cb;
	}

	// Returns a prommise
    send(type = this.type) {
    	var self = this;

    	if (!this.url) 
    		throw new Exception("Need a url for the Request");

    	// todo: use some native request 
    	return new Promise((resolve, reject) => {
    		var opts =  {
				method: type,
				mode: 'cors', // todo: configure
				headers: {}
			};

			var url = this.url;

			if (type == 'post') {
				opts.body = JSON.stringify( self.data );
			} else if (type == 'get') {
				if (self.data) {
					var hasParams = url.indexOf('?') >= 0;
					var qs = (hasParams ? '&' : '?') + 
				        Object.keys(self.data).map(function(key) {
				            return encodeURIComponent(key) + '=' +
				                encodeURIComponent(self.data[key]);
				        }).join('&');
				    url += qs;
				}
			}

			// Add Authorization header to all requests if we're authenticated:
			var token = cookie('token') || store('token');
			if (token) {
				opts.headers['Authorization'] = token;
			}

    		fetch(url, opts)
    		.then((r) => {
    			var json = r.json();

    			if (json.success == false) {
    				if(self.onFailure)
    					self.onFailure(json);
    				return reject(r);
    			}

				if(self.onSuccess)
					self.onSuccess(json);

				return resolve(json);
			})
			.catch((e) => {
				console.log("REQUEST ERROR", e, this.url,);
				return reject(e);
			})
    	});
	}
}
