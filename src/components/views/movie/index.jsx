import { h, Component } from 'preact';
import { Link, hashHistory } from 'react-router';
import EventBus from 'eventbusjs'
import Animate from 'rc-animate';
import auth from 'lib/util/auth'
import { appStore } from 'lib/data/stores';

import Header from 'components/shared/header';
import Loginprompt from 'components/shared/loginprompt';

import style from './style'

export default class Movie extends Component {

  constructor(props) {
    super(props)
    console.log("Movie", props);

    var movie = appStore.getMovie(props.params.id);
    if (!movie) {
      alert("Error finding movie data. Returning you to the library.");
      hashHistory.push('library');
    }

    console.log("Found movie", movie);
    appStore.addRecentlyViewed(movie);

    this.setState({ movie: movie });
  }

  componentWillMount() {
  }

  addToFavorites() {
    appStore.addFavoriteMovie(this.state.movie);
    this.forceUpdate();
  }

  removeFromFavorites() {
    appStore.removeFavoriteMovie(this.state.movie);
    this.forceUpdate();
  }

  render() {
    var m = this.state.movie;
    var isFavorite = this.state.movie.isFavorite;

    return (

      <Animate 
        component=""
        transitionAppear={true}
        transitionLeave={true}
        transitionName="content-transition">

        <div id="movie" class="view with-header" key="movie">
          <h1>Movie Details</h1>

          <div class="actions">
            <div class="btn btn-small" onclick={() => hashHistory.push('library') }>Back to Library</div>
          </div>

          <div class="details">
            <h2>{m.title}</h2>
            <Link to={'/player?path=' + encodeURI(m.filepath)}>{m.filepath}</Link>
            { !isFavorite && <div class="btn btn-small" onclick={() => this.addToFavorites()}>Add to favorites</div> }
            { isFavorite && <div class="btn btn-small" onclick={() => this.removeFromFavorites()}>Remove from favorites</div> }
          </div>

        </div>

      </Animate>
    );
  }
}