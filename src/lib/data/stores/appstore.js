import authUtils from 'util/auth'
import hash from 'object-hash'
import { store, cookie } from 'util/storage'
import { movieDbApi } from 'lib/data/api/moviedbapi'
import path from 'path';
import config from 'config';

export class AppStore {
	config = null
	movies = null
	recentMovies = null
	savedMovies = null
	favoriteMovies = null

	constructor() {
		// load data from storage
		this.config = store('config') || {};
		this.movies = store('movies') || [];
		this.recentMovies = store('recentMovies') || [];
		this.savedMovies = store('savedMovies') || [];
		this.favoriteMovies = store('favoriteMovies') || [];

		this.getRecentlyViewed.bind(this);

		this.initMovieDbApi()
	}

	initMovieDbApi() {
		movieDbApi.getConfiguration()
			.then((config) => {
				console.log("movie db config", config);
				this.config.imageBaseUrl = config.images.base_url
			});
	}

	save() {
		store('config', this.config);
		store('movies', this.movies);
		store('recentMovies', this.recentMovies);
		store('savedMovies', this.savedMovies);
		store('favoriteMovies', this.favoriteMovies);
	}

	clearAllData() {
		store('config', { started: new Date() });
		store('movies', []);
		store('recentMovies', []);
		store('savedMovies', []);
		store('favoriteMovies', []);
		this.config = store('config') || {};
		this.movies = store('movies') || [];
		this.recentMovies = store('recentMovies') || [];
		this.savedMovies = store('savedMovies') || [];
		this.favoriteMovies = store('favoriteMovies') || [];
	}

	clearMovieData() {
		store('recentMovies', []);
		store('savedMovies', []);
		store('favoriteMovies', []);
		this.recentMovies = store('recentMovies') || [];
		this.savedMovies = store('savedMovies') || [];
		this.favoriteMovies = store('favoriteMovies') || [];

		this.movies.forEach((m) => {
			m.isFavorite = false;
		})

		store('movies', this.movies);
	}

	isAppSetup() {
		return this.config != null;
	}

	ensureSetup() {
		if (this.config == {}) {
			this.config = { started: new Date() };
			this.save();
		}
	}

	getMovies(sortBy) {
		var movies = this.movies;
		if(sortBy) {
			movies.sort(function(a, b){
			    if(a[sortBy] < b[sortBy]) return -1;
			    if(a[sortBy] > b[sortBy]) return 1;
			    return 0;
			})
		}
		return movies;
	}

	getMovie(id) {
		for (let m of this.movies) {
			if (m.id === id)
				return m;
		}
		return null;
	}

	findMovie(query) {
		return this.movies.filter((m) => {
			if (m.title.toLowerCase().indexOf(query) >= 0) {
				return true;
			}
		})
	}

	guessTitle(filename) {
		return filename;
	}

	addMovie(movie) {
		this.movies.push(movie);
	}

	// creates a Movie from a file and adds it to the library
	addMovieFile(movieFilepath, imageFilepath) {
		var filename = path.basename(movieFilepath);

		// todo: make sure this file isn't already in the collection:
		for (let m of this.movies) {
			if (m.filename == filename ) {
			//if (m.fullpath == movieFilepath) {
				alert('Skipping duplicate movie: ' + movieFilepath);
				return;
			}
		}

		var data = {
			filepath: movieFilepath,
			filename: filename,
			image: imageFilepath,
			title: this.guessTitle(filename)
		}

		data.id = hash(data);

		cl('adding movie file', data);

		this.movies.push(data);
	}

	saveMovie(movie) {
		let i;
	    for (i=0; i<this.movies.length; i++) {
	      if (this.movies[i].id === movie.id) {
	        this.movies[i] = movie;
			store('movies', this.movies);
	        break;
	      }
	    }
	}

	removeMovie(movie) {
	 	let i;
	    for (i=0; i<this.movies.length; i++) {
	      if (this.movies[i].id === movie.id) {
	        this.movies.splice(i,1);
			store('movies', this.movies);
	        break;
	      }
	    }
	}

	getRecentlyViewed() {
		var self = this;
		var results = [];
		this.recentMovies.map((id) => {
			results.push(self.getMovie(id));
		});
		return results.reverse();
	}

	addRecentlyViewed(movie) {
	 	console.log("looking for recent", movie, this.recentMovies);

	 	let i;
	    for (i=0; i<this.recentMovies.length; i++) {
	    	cl("match recent?", this.recentMovies[i], movie.id);
			if (this.recentMovies[i] === movie.id) {
				console.log("Found recent", movie)
				this.recentMovies.splice(i,1);
				break;
			}
	    }	

		this.recentMovies.push(movie.id);
		store('recentMovies', this.recentMovies);
	}

	removeRecentlyViewed(movie) {
		store('recentMovies', this.recentMovies);
	}

	getSavedMovies() {
		return this.savedMovies;
	}

	addSavedMovie(movie) {
		this.savedMovies.push(movie);
		store('savedMovies', this.savedMovies);
	}

	removeSavedMovie(movie) {
	 	let i;
	    for (i=0; i<this.savedMovies.length; i++) {
	      if (this.savedMovies[i].id === movie.id) {
	        this.savedMovies.splice(i,1);
			store('savedMovies', this.savedMovies);
	        break;
	      }
	    }
	}

	getFavoriteMovies() {
		var ids = this.favoriteMovies;
		var movies = this.movies.filter((m) => {
			return ids.includes(m.id);
		})
		return movies;
	}

	addFavoriteMovie(movie) {
		// see if it exists already:
		for (let m in this.favoriteMovies) {
			if (m.id === movie.id) 
				return;
		}

		movie.isFavorite = true;
		this.saveMovie(movie);

		this.favoriteMovies.push(movie.id);
		store('favoriteMovies', this.favoriteMovies);
	}

	removeFavoriteMovie(movie) {
		// see if it exists already:
		movie.isFavorite = false;
		this.saveMovie(movie);

	 	let i;
	    for (i=0; i<this.favoriteMovies.length; i++) {
	      if (this.favoriteMovies[i] === movie.id) {
	        this.favoriteMovies.splice(i,1);
			store('favoriteMovies', this.favoriteMovies);
	        break;
	      }
	    }
	}

	discoverQuery(query) {
		return new Promise((resolve, reject) => {
			if (query.query == '') return resolve([]);

			movieDbApi.query({ query: query.query })
			.then((results) => {
				results.results.map((r) => {
					r.image = null;
					var baseUrl = 'http://image.tmdb.org/t/p/w500';
					if (r.media_type == 'movie') {
						if (r.poster_path)
							r.image = baseUrl + r.poster_path;
					}
					else if (r.media_type == 'person') {
						if(r.profile_path)
							r.image = baseUrl + r.profile_path;
					}
				});
				console.log("Movie Db query response", results);

				return resolve(results.results);
			})
		});
	}
}

export let appStore = new AppStore();
