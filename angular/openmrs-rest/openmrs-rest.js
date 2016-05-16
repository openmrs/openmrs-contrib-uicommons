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
	.factory('openmrsApi', openmrsApi)
	.factory('authInterceptor', authInterceptor)
	.config(httpProviderConfig)
	.provider('openmrsRest', openmrsRest).name;

export default angular.module('openmrs-contrib-uicommons.rest', ['openmrsRest']);


authInterceptor.$inject = ['$q', '$window'];

function authInterceptor($q, $window){
	return {
		responseError: function(response){
			if(response.status === 401 || response.status === 403){
				if($window.confirm("The operation cannot be completed, because you are no longer logged in. Do you want to go to login page?")){
					var pathname = $window.location.pathname;
					pathname = pathname.substring(0, pathname.indexOf('/owa/'));

					var url = $window.location.href;
					url = url.replace('#','_HASHTAG_');
					url = url.slice(url.indexOf("/openmrs"));
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

openmrsApi.$inject = ['$resource', '$window'];

function openmrsApi($resource, $window) {
	var openmrsApi = {
		defaultConfig: {
			uuid: '@uuid'
		},
		add: add
	};

	return openmrsApi;

	function add(config) {
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
			url = getOpenmrsContextPath() + '/ws/rest/v1' + config.url + '/:uuid';
		} else {
			// Otherwise we have to declare the entire configuration.
			params = config.params;
			url = getOpenmrsContextPath() + '/ws/rest/v1' + config.url + '/:uuid';
		}

		// If we supply a method configuration, use that instead of the default extra.
		var actions = config.actions || openmrsApi.extraActions;

		openmrsApi[config.resource] = $resource(url, params, actions);
	}

	function getOpenmrsContextPath() {
		var pathname = $window.location.pathname;
		return pathname.substring(0, pathname.indexOf('/owa/'));
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

	function provideOpenmrsRest(openmrsApi, $document, $window) {
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
			openmrsApi.add(resource);
			return openmrsApi[resource].get(query).$promise.then(function (response) {
				return new PartialList(response, $document);
			});
		}

		function listFull(resource, query) {
			openmrsApi.add(resource);
			query = addMode(query, 'full');
			return openmrsApi[resource].get(query).$promise.then(function (response) {
				return new PartialList(response, $document);
			});
		}

		function listRef(resource, query) {
			openmrsApi.add(resource);
			query = addMode(query, 'ref');
			return openmrsApi[resource].get(query).$promise.then(function (response) {
				return new PartialList(response, $document);
			});
		}

		function get(resource, query) {
			openmrsApi.add(resource);
			return openmrsApi[resource].get(query).$promise.then(function (response) {
				return response;
			});
		}

		function getFull(resource, query) {
			openmrsApi.add(resource);
			query = addMode(query, 'full');
			return openmrsApi[resource].get(query).$promise.then(function (response) {
				return response;
			});
		}

		function getRef(resource, query) {
			openmrsApi.add(resource);
			query = addMode(query, 'ref');
			return openmrsApi[resource].get(query).$promise.then(function (response) {
				return response;
			});
		}

		function create(resource, model) {
			openmrsApi.add(resource);
			return openmrsApi[resource].save(model).$promise.then(function (response) {
				return response;
			});
		}

		function update(resource, query, model) {
			openmrsApi.add(resource);
			return openmrsApi[resource].save(query, model).$promise.then(function (response) {
				return response;
			});
		}

		function remove(resource, query) {
			openmrsApi.add(resource);
			return openmrsApi[resource].remove(query).$promise.then(function (response) {
				return response;
			});
		}

		function unretire(resource, query) {
			openmrsApi.add(resource);
			return openmrsApi[resource].save(query, {retired: false}).$promise.then(function (response) {
				return response;
			});
		}

		function purge(resource, query) {
			openmrsApi.add(resource);
			if (query == null) {
				query = {purge: true};
			} else {
				angular.extend(query, {purge: true});
			}
			return openmrsApi[resource].remove(query).$promise.then(function (response) {
				return response;
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
