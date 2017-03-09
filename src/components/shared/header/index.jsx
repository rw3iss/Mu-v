import { h, Component } from 'preact';
import { hashHistory } from 'react-router';
import { Link } from 'react-router';
import style from './style';

export default class Header extends Component {
	render() {
		return (
			<header class={style.header}>
				<h1><a onclick={() => hashHistory.push('/') }>μv</a></h1>
				<nav>
					<a onclick={() => hashHistory.push('library') }>Library</a>
					<a onclick={() => hashHistory.push('discover') }>Discover</a>
					<a onclick={() => hashHistory.push('setup') }>O</a>
				</nav>
			</header>
		);
	}
}
