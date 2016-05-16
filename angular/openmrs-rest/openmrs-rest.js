/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
/**
 * The pattern borrowed from https://gist.github.com/brucecoddington/92a8d4b92478573d0f42
 */
import ngResource from 'angular-resource';

angular.module('openmrsRest', ['ngResource'])
	.factory("openmrsContext", openmrsContext)
	.factory('openmrsApi', openmrsApi)
	.factory('authInterceptor', authInterceptor)
	.config(httpProviderConfig)
	.provider('openmrsRest', openmrsRest).name;

function openmrsContext(){
	var config = {};
	function getConfig(){
		return config;
	}
	return {
		getConfig: getConfig
	}
}

export default angular.module('openmrs-contrib-uicommons.rest', ['openmrsRest']);

authInterceptor.$inject = ['$q', '$window', 'openmrsContext'];

function authInterceptor($q, $window, openmrsContext){
	return {
		responseError: function(response){
			if(response.status === 401 || response.status === 403){
				if($window.confirm("The operation cannot be completed, because you are no longer logged in. Do you want to go to login page?")){
					var pathname;
					var url = $window.location.href;
					if(openmrsContext.getConfig().test){
						pathname = openmrsContext.getConfig().href;
						
					} else{
						pathname = $window.location.pathname;
						pathname = pathname.substring(0, pathname.indexOf('/owa/'));
						url = url.slice(url.indexOf("/openmrs"));
					}
					url = url.replace('#','_HASHTAG_');
					url = pathname + '/login.htm?redirect_url=' + url;
					$window.location.href = url;
				}
			}
			return $q.reject(response);
		}
	}
}

httpProviderConfig.$inject = ['$httpProvider'];

function httpProviderConfig($httpProvider){
	$httpProvider.interceptors.push('authInterceptor');
	$httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = 'true';
}

openmrsApi.$inject = ['$resource', '$window', '$http', '$q', 'openmrsContext'];


function openmrsApi($resource, $window, $http, $q, openmrsContext) {
	function getOpenmrsContextConfig () {
		var openmrsContextConfig = openmrsContext.getConfig();
		var deferred = $q.defer();
		if(angular.isUndefined(openmrsContextConfig.href)){
			$http.get('manifest.webapp').then(
					function successCallback(response){
						if(response.data.activities.openmrs.testConfig){
							var config = response.data.activities.openmrs.testConfig
						 	openmrsContextConfig.href = config.href;
						 	openmrsContextConfig.username = config.username;
						 	openmrsContextConfig.password = config.username;
						 	openmrsContextConfig.sessionLocation = config.sessionLocation;
						 	openmrsContextConfig.test = true;
						 	
						 	var credentials = "uname="+openmrsContextConfig.username+"&pw="+openmrsContextConfig.password;
							$http.post(openmrsContextConfig.href+'/login.htm', credentials).then(function(){
								$http.defaults.withCredentials = true;
								deferred.resolve(openmrsContextConfig);								
							})	
						}
						else{
							var pathname = $window.location.pathname;
							openmrsContextConfig.test = false;
							openmrsContextConfig.href = pathname.substring(0, pathname.indexOf('/owa/'));
							deferred.resolve(openmrsContextConfig);
						}
					}, 
					function errorCallback(response){
							var pathname = $window.location.pathname;
							openmrsContextConfig.test = false;
							openmrsContextConfig.href = pathname.substring(0, pathname.indexOf('/owa/'));
							deferred.resolve(openmrsContextConfig);
					});
		}
		else{
			deferred.resolve(openmrsContextConfig);
		}
		return deferred.promise;

	}
	
	var openmrsApi = {
		defaultConfig: {
			uuid: '@uuid'
		},
		add: add,
		getOpenmrsContextConfig: getOpenmrsContextConfig
	};

	return openmrsApi;

	function add(config) {
		var deferred = $q.defer();
		getOpenmrsContextConfig().then(function(openmrsContextConfig){
			var params, url;

			// If the add() function is called with a
			// String, create the default configuration.
			if (angular.isString(config)) {
				var configObj = {
					resource: config,
					url: '/' + config
				};

				config = configObj;
			}

			// If the url follows the expected pattern, we can set cool defaults.
			if (!config.unnatural) {
				var orig = angular.copy(openmrsApi.defaultConfig);
				params = angular.extend(orig, config.params);
				url = openmrsContextConfig.href + '/ws/rest/v1' + config.url + '/:uuid';
			} else {
				// Otherwise we have to declare the entire configuration.
				params = config.params;
				url = openmrsContextConfig.href + '/ws/rest/v1' + config.url + '/:uuid';
			}

			// If we supply a method configuration, use that instead of the default extra.
			var actions = config.actions || openmrsApi.extraActions;

			openmrsApi[config.resource] = $resource(url, params, actions);
			deferred.resolve(openmrsApi[config.resource]);
		})
		return deferred.promise;
	}
}


function openmrsRest() {
	return {
		list: provideList,
		get: provideGet,
		$get: ['openmrsApi', '$document', '$window', function(openmrsApi, $document, $window){
			return provideOpenmrsRest(openmrsApi, $document, $window);
		}]
	};

	function provideList(resource, query) {
		return ['openmrsRest', function (openmrsRest) {
			return openmrsRest.list(resource, query);
		}]
	}

	function provideGet(resource, query) {
		return ['openmrsRest', function (openmrsRest) {
			return openmrsRest.get(resource, query);
		}]
	}

	function provideOpenmrsRest(openmrsApi, $document, $window, $http) {
		var openmrsRest = {
			list: list,
			listFull: listFull,
			listRef: listRef,
			get: get,
			getFull: getFull,
			getRef: getRef,
			create: create,
			update: update,
			remove: remove,
			retire: remove,
			unretire: unretire,
			purge: purge
		};

		return openmrsRest;

		function list(resource, query) {
			return openmrsApi.add(resource).then(function(resource){
				return resource.get(query).$promise.then(function (response) {
					return new PartialList(response, $document);
				});
			});
		}

		function listFull(resource, query) {
			query = addMode(query, 'full');
			return list(resource, query);
		}

		function listRef(resource, query) {
			query = addMode(query, 'ref');
			return list(resource, query);
		}

		function get(resource, query) {
			return openmrsApi.add(resource).then(function(resource){
				return resource.get(query).$promise.then(function (response) {
					return response;
				});
			});
		}

		function getFull(resource, query) {
			query = addMode(query, 'full');
			return get(query);
		}

		function getRef(resource, query) {
			query = addMode(query, 'ref');
			return get(query);
		}

		function create(resource, model) {
			return openmrsApi.add(resource).then(function(resource){
				return resource.save(model).$promise.then(function (response) {
					return response;
				});
			});
		}

		function update(resource, query, model) {
			return openmrsApi.add(resource).then(function(resource){
				return resource.save(query, model).$promise.then(function (response) {
					return response;
				});
			});
		}

		function remove(resource, query) {
			return openmrsApi.add(resource).then(function(resource){
				return resource.remove(query).$promise.then(function (response) {
					return response;
				});
			});
		}

		function unretire(resource, query) {
			return openmrsApi.add(resource).then(function(resource){
				return resource.save(query, {retired: false}).$promise.then(function (response) {
					return response;
				});
			});
		}

		function purge(resource, query) {
			if (query == null) {
				query = {purge: true};
			} else {
				angular.extend(query, {purge: true});
			}
			return openmrsApi.add(resource).then(function(resource){
				return resource.remove(query).$promise.then(function (response) {
					return response;
				});
			});
		}

		function addMode(query, type) {
			if (query == null) {
				return {v: type};
			} else {
				return angular.extend(query, {v: type});
			}
		}
	}
}

function PartialList(response, doc) {
	var results = response.results;
	var nextQuery = null;
	var previousQuery = null;

	initLinks();

	return {
		results: results,
		hasNext: hasNext,
		nextQuery: nextQuery,
		hasPrevious: hasPrevious,
		previousQuery: previousQuery
	};

	function hasNext() {
		return nextQuery != null;
	}

	function hasPrevious() {
		return previousQuery != null;
	}

	function initLinks() {
		if (response.links != null) {
			for (var i = 0; i < response.links.length; i++) {
				var link = response.links[i];

				if (link.rel === 'next') {
					nextQuery = toQuery(link.uri);
				} else if (link.rel === 'prev') {
					previousQuery = toQuery(link.uri);
				}
			}
		}
	}

	function toQuery(href) {
		var parser = doc[0].createElement('a');
		parser.href = href;
		var params = parser.search.slice(1).split('&');
		var result = {}; 
		params.forEach(function(param) {
			if(param !== ''){
				param = param.split('=');
				result[param[0]] = decodeURIComponent(param[1] || '');
			}
		});
		return result;
	}
}
