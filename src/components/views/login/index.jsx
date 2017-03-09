import { h, Component } from 'preact';
import Loginprompt from 'components/shared/loginprompt';
import auth from 'lib/util/auth'
import EventBus from 'eventbusjs'

export default class Login extends Component {

  constructor() {
    super()
    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    var self = this;
    EventBus.addEventListener("USER_LOGGED_IN", function(r) {
      console.log("LOGIN EVENT");
      self.forceUpdate();
    });
  }

  logout() {
    EventBus.dispatch("USER_LOGGED_OUT");
    console.log("logout");
    auth.logout();
    this.forceUpdate();
  }

	render() {
    var loggedin = auth.loggedIn();

		return (
      <div>
  			<Loginprompt />
        {auth.loggedIn() && 
          <div>
            LOGGED IN
            <button class="btn" onclick={this.logout}>Logout</button>
          </div>}
      </div>
		);
	}

}