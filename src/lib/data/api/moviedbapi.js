import Api from './api'
import config from 'config'

export default class MovieDBApi extends Api {
	baseUrl = 'https://api.themoviedb.org/3';
	constructor() {
		super();
	}

	getConfiguration() {
		var data = {
			api_key: config.movieDbApiKey
		}

		return this.request({
			url: this.baseUrl + '/configuration',
			data: data
		});
	}

	query(query) {
		var data = {
			api_key: config.movieDbApiKey,
			query: query.query
		}

		return this.request({
			url: this.baseUrl + '/search/multi',
			data: data
		})
	}

	getPopular() {
		var data = {
			api_key: config.movieDbApiKey
		}

		return this.request({
			url: this.baseUrl + '/movie/popular',
			data: data
		})
	}

	getNew() {
		var data = {
			api_key: config.movieDbApiKey
		}

		return this.request({
			url: this.baseUrl + '/movie/now_playing',
			data: data
		})
	}
}

export let movieDbApi = new MovieDBApi();
