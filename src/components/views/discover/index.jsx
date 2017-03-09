import { h, Component } from 'preact';
import { hashHistory } from 'react-router';
import { throttle } from 'lodash';
import Animate from 'rc-animate';
import Header from 'components/shared/header';
import View from 'components/shared/view';
import { appStore } from 'lib/data/stores';
import { movieDbApi } from 'lib/data/api/moviedbapi';
import style from './style';

// Set initial state

export default class Browser extends View {
  constructor(props) {
    super(props);

    this.doPerformSearch = throttle(this.doPerformSearch.bind(this), 250);

    this.setState({ 
      section: 'recent', 
      searchResults: [], 
      isSearching: false,
      new: [], 
      popular: [] });

    this.navigate('recent');

    this.loadRemoteStuff();
  }

  loadRemoteStuff() {
    var self = this;

    movieDbApi.getNew()
      .then((r) => {
        cl("new", r.results);
        self.setState({ new: r.results });
      })
      .catch((e) => {
        self.setState({ newError: 'Error loading new listings.'})
      })

    movieDbApi.getPopular()
      .then((r) => {
        cl("popular", r.results);
        self.setState({ popular: r.results });
      })
      .catch((e) => {
        self.setState({ popularError: 'Error loading popular listings.'})
      })
  }

  componentWillMount() {
    // look for new and popular from remote api
  }

  componentDidMount() {
    var self = this;
    // process.nextTick(() => {
    //   this.searchInput.focus();
    // })
  }

  navigate(section) {
    var func =  section == 'recent' ?     appStore.getRecentlyViewed :
                section == 'favorites' ?  appStore.getFavoriteMovies :
                section == 'saved' ?      appStore.getSavedMovies :
                appStore.getMovies

    var results = func.call(appStore, 'title');

    this.setState({ section: section, results: results });
  }

  onSearchInput(e) {
    if(e.key == 'Escape') {
      this.clearSearch();
      return;
    }

    this.doPerformSearch()
  }

  // gets wrapped in debouncer
  doPerformSearch() {
    var self = this;
    var query = this.searchInput.value;

    cl("performing search");

    appStore.discoverQuery({ query: query })
      .then((results) => {
        self.setState({ searchResults: results, isSearching: true });
      })
  }

  renderKnownForString(knownForArray) {
    var knownFor = '', delim = '';

    if(knownForArray.length) {
      knownFor = 'Known for: ';
      knownForArray.forEach((el) => {
        var prop = '';
        if(el.media_type == 'movie')
          prop = 'title';
        else if (el.media_type == 'tv') 
          prop = 'name';

        if (prop != '') {
          knownFor += delim + el[prop];
          delim = ', ';
        }
      });
    }

    return knownFor;
  }

  clearSearch() {
    this.searchInput.value = '';
    this.setState({ searchResults: [], isSearching: false });
  }

  onSearchFocus() {
    this.setState({ isSearching: true });
  }

  onSearchBlur() {
    //this.setState({ isSearching: false });
  }

  searchClick(e) {
    console.log("CLICK", e);
  }

  render() {
    var self = this;
    var delim = "";
    return (
      
       <Animate 
        component=""
        transitionAppear={true}
        transitionLeave={true}
        transitionName="content-transition">

        <div id="discover" class="view with-header" key="discover">
          <h1>Discover</h1>

          <section id="search">
            
            <div class="input-container" onclick={(e) => { this.searchClick(e) }}>
              <input type="text" placeholder="Search for movies, actors, etc..."
              ref={(ref) => this.searchInput = ref } 
              onfocus={() => { this.onSearchFocus() }} 
              onblur={() => { this.onSearchBlur() }} 
              onkeyup ={ (e) => { this.onSearchInput(e) }} />
              { this.state.isSearching &&
                <div class="clear" onclick={() => { this.clearSearch() }}>X</div>
              }
            </div>

            { this.state.isSearching && this.state.searchResults.length != 0 &&

              <Animate 
              component=""
              transitionAppear={true}
              transitionName="results-transition">

                <ul class="search-results" key="search-results">
                  { this.state.searchResults.map(function(m) {
                    if (m.media_type == 'person') {
                      return <li data-type={m.media_type} class={m.media_type}>
                          <span class="image" flex="center">{ m.image && <img src={m.image} /> }</span>
                          <div class="details">
                            <div class="title">{m.name}</div>
                            <div class="overview">
                            {self.renderKnownForString(m.known_for)}
                            </div>
                            <div class="popularity">Popularity: {m.popularity}</div>
                            <div>{m}</div>
                          </div>
                        </li>
                    } else if (m.media_type == 'movie') {
                       return <li data-type={m.media_type} class={m.media_type}>
                                <span class="image" flex="center">{ m.image && <img src={m.image} /> }</span>
                                <div class="details">
                                  <div class="title">{m.title} - {m.release_date}</div>
                                  <div class="overview">{m.overview}</div>
                                  { m.vote_count != 0 && 
                                    <div class="rating">Rating: {m.vote_average} ({m.vote_count})</div>
                                  }
                                </div>
                              </li>
                    }
                  })}
                </ul>

              </Animate>
            }
          </section>

          <section id="lists">
            <div class="list" id="new">
              <h2>New</h2>
              { this.state.newError && <div>{this.state.newError}</div> }
              <ul>
                { this.state.new.map(function(m) {
                return <li><div class="inner">{m.title}</div></li>
                })}
              </ul>
            </div>
            <div class="list" id="popular">
              <h2>Popular</h2>
              { this.state.popularError && <div>{this.state.popularError}</div> }
              <ul>
                { this.state.popular.map(function(m) {
                return <li><div class="inner">{m.title}</div></li>
                })}
              </ul>
            </div>
          </section>

        </div>

        </Animate>
    );
  }
}
