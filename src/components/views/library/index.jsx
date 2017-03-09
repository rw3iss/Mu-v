import { h, Component } from 'preact';
import { hashHistory } from 'react-router';
import Animate from 'rc-animate';
import Header from 'components/shared/header';
import View from 'components/shared/view';
import { appStore } from 'lib/data/stores';
import style from './style';

// Set initial state

export default class Browser extends View {
  constructor(props) {
    super(props);

    this.setState({ section: 'recent', results: appStore.movies, isSearching: false });
  }

  componentWillUnmount() {
    // Remember state for the next mount
  }

  onSearchInput(e) {
    if(e.key == 'Escape') {
      this.clearSearch();
      return;
    }

    var query = this.searchInput.value;
    console.log("search", query);    
    var movies = query == '' ? appStore.movies : appStore.findMovie(query);
    this.setState({ section: 'search', results: movies });
  }

  onSearchBlur() {
    if (this.searchInput.value == '')
      this.setState({ isSearching: false });
  }

  onSearchFocus() {
    this.setState({ isSearching: true });
  }

  clearSearch() {
    this.searchInput.value = '';
    this.searchInput.blur();
    this.setState({ results: appStore.movies, isSearching: false });
  }

  toggleFilter(type) {
    this.set
  }

  render() {
    var results = this.state.results;

    return (

      <Animate 
        component=""
        onAppear={this.onAppear}
        transitionAppear={true}
        transitionLeave={true}
        transitionName="content-transition">

        <div id="library" class="view with-header" key="library">
          <Header />

          <h1>Library</h1>

          <div id="search" class={this.state.section == 'search' ? 'active' : ''}>

              <input type="text" placeholder="Search..." class={this.state.isSearching ? 'searching' : ''}
              ref={(ref) => this.searchInput = ref } 
              onfocus={() => { this.onSearchFocus() }} 
              onblur={() => { this.onSearchBlur() }} 
              onkeyup ={ (e) => { this.onSearchInput(e) }} />
              { true &&
                <div class="clear" onclick={() => { this.clearSearch() }}>X</div>
              }

            <div class="filter">
              <span class="label">Filter:</span>
              <div class="btn btn-small" onclick={() => { this.toggleFilter('favorites') }}>Favorites</div>
              <div class="btn btn-small" onclick={() => { this.toggleFilter('saved') }}>Saved</div>
            </div>

            <div class="sort">
              <span class="label">Sort:</span>
              <div class="btn btn-small" onclick={() => { this.toggleFilter('favorites') }}>Recent</div>
              <div class="btn btn-small" onclick={() => { this.toggleFilter('saved') }}>Rating</div>
              <div class="btn btn-small" onclick={() => { this.toggleFilter('saved') }}>Title</div>
            </div>
          </div>

          <div class="section" id="results">
            <ul>
              { results.map(function(m) {
                return <Animate 
                    component=""
                    transitionAppear={true}
                    transitionLeave={true}
                    transitionName="content-transition">
                    <li onclick={() => { hashHistory.push('movie/' + m.id) }} key={m.id}>
                      <div class="inner">
                        { m.image != null && <div class="image"><img src={m.image} /></div> }
                        <div class="details">
                          <div class="title">{m.title}</div>
                          <div class="filepath">{m.filepath}</div>
                          { m.isFavorite && <div class="favorite">Favorite!</div> }
                        </div>
                      </div>
                    </li>
                  </Animate>;
              })}
            </ul>
            { results.length == 0 &&
              (this.state.isSearching ? 
                (<div class="no-results">No results.</div>) :
                (<div class="no-results">No movies.</div>)
              )
            }
          </div>

        </div>

      </Animate>
    );
  }
}