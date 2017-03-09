import { h, Component, cloneElement } from 'preact';
import Header from 'components/shared/header';
import Loginprompt from 'components/shared/loginprompt';
import style from './style'

export default class AppContainer extends Component {
	// gets called when this route is navigated to
	componentDidMount() {
	}

	onAppear() {
		console.log("APPEAR", this);
	}

	// Note: `user` comes from the URL, courtesy of our router
	render() {
		var route = this.props.location.pathname;
		
		return (
			<div class="app-container">
				{ false && <Header /> }
				{ route != '/login' && route != '/logout' && 
					<Loginprompt />
				}	
 				
				<div class="view-wrapper" key="view">
          			<Header />
					{ this.props.children }
				</div>
			</div>
		);
	}
}
