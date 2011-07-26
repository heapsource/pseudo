const CONTROLLERS_DIR_NAME = 'actions'
const FILTERS_DIR_NAME = 'filters'

var path = require('path')
var controllersPath = path.resolve(CONTROLLERS_DIR_NAME)
var filtersPath = path.resolve(FILTERS_DIR_NAME)
var fs = require('fs')

var globalOptions = null;
module.exports.init = function(options) {
	globalOptions = options
	//Load controllers
	loadControllersDirectory(controllersPath)
}

var supportedHttpMethods = require ("express/lib/router/methods.js")

supportedHttpMethods.forEach(function(method) {
	// Define HTTP methods for the controller object
	module.exports[method] = function(route, options) {
		var filters = []
		if(options.filters != undefined) {
			options.filters.forEach(function(filterId) {
				if(typeof filterId == 'string') {
					var filterPath = path.join(filtersPath, filterId + ".js")
					var filterModule = require(filterPath)
					var filterFunction = filterModule.filter
					if(filterFunction == undefined) {
						throw filterPath + " failed to expose a filter function for route '" + route +  "'"
					}
					if(typeof filterFunction != 'function') {
						throw filterPath + " exposed invalid function(" + filterFunction + ") to filter route'" + route +  "'"
					}
					filters.push(filterFunction.bind(globalOptions));
				} else if(typeof filterId == 'function') {
					filters.push(filterId.bind(globalOptions))
				} else {
					throw filterId + " can not be recognized as a filter id for route '" + route +  "'. It can only be either the name of a filter as String or an express middleware function"
				}
			});
		}
		if(options.action != undefined) {
			filters.push(options.action.bind(globalOptions))
		}
		var callParams = [route].concat(filters)
		var routeMethod = globalOptions.Application[method]
		if(routeMethod == undefined) {
			throw "Http Method " + method + ' is not supported by Express Framework. try get, post, etc'
		}
		console.log('	Routing ' + method + ' ' + route)
		routeMethod.apply(globalOptions.Application,callParams)
	};
});
function loadControllersDirectory(cpath) {
	var controllerFiles = fs.readdirSync(cpath)
	controllerFiles.forEach(function(controllerFile) {
		var requirePath = path.join(cpath, controllerFile)
		var requireStat = fs.statSync(requirePath)
		if(requireStat.isFile()) {
			console.log("Loading Actions " + requirePath)
			require(requirePath)
		} else if(requireStat.isDirectory()) {
			loadControllersDirectory(requirePath)
		}
		delete requireState;
	})
}


