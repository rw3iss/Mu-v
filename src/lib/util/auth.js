import utils from 'lib/util/js-utils'
import { cookie, store } from 'lib/util/storage'
import EventBus from 'eventbusjs'
//import UserApi from 'lib/data/api/userapi'
//import { userStore } from 'lib/data/stores/userstore';

module.exports = {

  /* Isomorphic / non-blocking, ie. local methods */

  isValidLogin: function(login) {
    return (this.isValidEmail(login) || this.isValidUsername(login))
  },

  isValidEmail: function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },

  isValidUsername: function(username) {
    var re = /^[a-z0-9]+$/i;
    return re.test(username);
  },

  validateNewUser: function(data) {
    var errors = [];

    if(!utils.hasProperties(data, ['username', 'email', 'password', 'passwordConfirm'])) {
      errors.push('Missing parameters');
      return errors;
    }

    if(data.username.length < 4) {
      errors.push('Username must be at least 4 characters long.');
    }

    if(!this.isValidUsername(data.username)) {
      errors.push("Username must contain only letters and numbers.");
    }

    if(!this.isValidEmail(data.email)) {
      errors.push('E-mail is invalid.');
    }

    if(data.password.length < 6) {
      errors.push("Password must be at least 6 characters long.");
    }

    if(data.password !== data.passwordConfirm) {
      errors.push('Passwords do not match.');
    }

    return errors;
  },

  /* Non-isomorphic mehods */
  login: function(creds) {
    return new Promise((resolve, reject) => {
      var errors = [];
      if(!this.isValidLogin(creds.login)) {
        errors.push(['Invalid login.']);
        return reject(errors);
      }

      throw "Not Implemented";

      // UserApi.login(creds)
      //   .then((r) => {
      //     if(r.success) {
      //       var message = r.message;

      //       store('token', r.token);
      //       cookie('token', r.token);
      //       EventBus.dispatch('USER_LOGGED_IN', r);

      //       userStore.setCurrentUser(r.user);

      //       return resolve(r);
      //     }
      //   })
      //   .catch((e) => {
      //     return reject(e);
      //   });
    });
  },

  getToken: function() {
    return store('token') || cookie('token');
  },

  logout: function() {
    store('token', null);
    cookie('token', null);
  },

  loggedIn: function() {
    var token = this.getToken();
    
    return !!token;
  },

  getCurrentUser: function() {
    return null;
    //return userStore.getCurrentUser();
  }

}
