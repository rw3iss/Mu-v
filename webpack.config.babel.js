import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ReplacePlugin from 'replace-bundle-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import path from 'path';
import V8LazyParseWebpackPlugin from 'v8-lazy-parse-webpack-plugin';
import ScriptExtHtmlWebpackPlugin from "script-ext-html-webpack-plugin";
const ENV = process.env.NODE_ENV || 'development';

const CSS_MAPS = ENV!=='production';

module.exports = {
	target: "electron",

	context: path.resolve(__dirname, "src"),
	
	entry: {
		bundle: './index.js'
	// 	externalcss: [
	// 		'./assets/css/vendors.scss',
	// 		'./assets/js/vendors.js'
	// 	]
	},

	output: {
		path: path.resolve(__dirname, "build_electron"),
		publicPath: './',
		filename: '[name].js',
        //chunkFilename: './[name].chunk[id].js'
	},

	resolve: {
		root: [
			path.resolve('./src')
		],
		extensions: ['', '.jsx', '.js', '.json', '.scss'],
		modulesDirectories: [
			path.resolve(__dirname, "src/lib"),
			path.resolve(__dirname, "node_modules"),
			'node_modules'
		],
		alias: {
			components: path.resolve(__dirname, "src/components"), // used for tests
			style: path.resolve(__dirname, "src/style"),
			'react': 'preact-compat',
			'react-dom': 'preact-compat'
		}
	},

	module: {
		preLoaders: [
			{
				test: /\.jsx?$/,
				exclude: path.resolve(__dirname, 'src'),
				loader: 'source-map'
			}
		],
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel'
			},
			{
				// Transform our own .(sass|css) files with PostCSS and CSS-modules
				test: /\.(scss)$/,
				include: [path.resolve(__dirname, 'src/components')],
				loader: ExtractTextPlugin.extract('style?singleton', [
					`css-loader?modules&importLoaders=1&sourceMap=${CSS_MAPS}`,
					'postcss-loader',
					`sass-loader?sourceMap=${CSS_MAPS}`
				].join('!'))
			},
			{
				test: /\.(scss|css)$/,
				include: [path.resolve(__dirname, 'src/assets')],
				loader: ExtractTextPlugin.extract('style?singleton', [
					`css?sourceMap=${CSS_MAPS}`,
					`postcss`,
					`sass-loader?sourceMap=${CSS_MAPS}`
				].join('!'))
				//loader:  'style!css'
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.(xml|html|txt|md)$/,
				loader: 'raw'
			},
			{
				test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
				loader: ENV==='production' ? 'file?name=[path][name]_[hash:base64:5].[ext]' : 'url',
				//loader: 'url-loader',
				query: {
					limit: 10000 // Inline images smaller than 10kb as data URIs
				}
			}
		]
	},

	postcss: () => [
		autoprefixer({ browsers: 'last 2 versions' })
	],

	plugins: ([
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin('[name].css', {
			allChunks: true
			//disable: ENV!=='production'
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(ENV)
		}),
		new HtmlWebpackPlugin({
			template: './index.ejs',
			minify: { collapseWhitespace: false }
		}),
		new ScriptExtHtmlWebpackPlugin({
		 	defaultAttribute: "async"
		}),
		new CopyWebpackPlugin([
			{ from: './manifest.json', to: './' },
			{ from: './assets/icons/favicon.ico', to: './' },
			{ from: './assets', to: './assets' }
		])
	]).concat(ENV==='production' ? [
		new V8LazyParseWebpackPlugin(),
		new webpack.optimize.UglifyJsPlugin({
		 	output: {
		 		comments: false
			},
			compress: {
				warnings: false,
				conditionals: true,
				unused: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				evaluate: true,
				if_return: true,
				join_vars: true,
				negate_iife: false
			}
		}),
		
		// strip out babel-helper invariant checks
		new ReplacePlugin([{
			// this is actually the property name https://github.com/kimhou/replace-bundle-webpack-plugin/issues/1
			partten: /throw\s+(new\s+)?[a-zA-Z]+Error\s*\(/g,
			replacement: () => 'return;('
		}]),

		new OfflinePlugin({
			relativePaths: false,
			AppCache: false,
			ServiceWorker: {
				events: true
			},
			publicPath: '/'
		})
	] : []),

	stats: { colors: true },

	node: {
		global: true,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
		setImmediate: false
	},

	devtool: ENV==='production' ? 'source-map' : 'cheap-module-eval-source-map',

	devServer: {
		port: process.env.PORT || 8080,
		host: 'localhost',
		colors: true,
		publicPath: './',
		contentBase: './src',
		historyApiFallback: true,
		open: true,
		proxy: {
			// OPTIONAL: proxy configuration:
			// '/optional-prefix/**': { // path pattern to rewrite
			//   target: 'http://target-host.com',
			//   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
			// }
		}
	}
};
