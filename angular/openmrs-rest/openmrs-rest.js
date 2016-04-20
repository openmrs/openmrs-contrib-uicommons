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
	.provider('openmrsRest', openmrsRest).name;

export default angular.module('openmrs-contrib-uicommons.rest', ['openmrsRest']);

openmrsApi.$inject = ['$resource', '$window'];


function openmrsApi($resource, $window) {
	var openmrsApi = {
		defaultConfig: {
			uuid: '@uuid'
		},
		extraActions: {
			get: {
				method: 'GET',
				headers: {
					'Disable-WWW-Authenticate': 'true'
				}
			},
			save: {
				method: 'POST',
				headers: {
					'Disable-WWW-Authenticate': 'true'
				}
			},
			remove: {
				method: 'DELETE',
				headers: {
					'Disable-WWW-Authenticate': 'true'
				}
			}
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
		$get: provideOpenmrsRest,
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

	provideOpenmrsRest.$inject = ['$document', '$window'];
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
			}, function(error){
				return redirectToLogin(error)
			});
		}

		function listFull(resource, query) {
			openmrsApi.add(resource);
			query = addMode(query, 'full');
			return openmrsApi[resource].get(query).$promise.then(function (response) {
				return new PartialList(response, $document);
			}, function(error){
				return redirectToLogin(error)
			});
		}

		function listRef(resource, query) {
			openmrsApi.add(resource);
			query = addMode(query, 'ref');
			return openmrsApi[resource].get(query).$promise.then(function (response) {
				return new PartialList(response, $document);
			}, function(error){
				return redirectToLogin(error)
			});
		}

		function get(resource, query) {
			openmrsApi.add(resource);
			return openmrsApi[resource].get(query).$promise.then(function (response) {
				return response;
			}, function(error){
				return redirectToLogin(error)
			});
		}

		function getFull(resource, query) {
			openmrsApi.add(resource);
			query = addMode(query, 'full');
			return openmrsApi[resource].get(query).$promise.then(function (response) {
				return response;
			}, function(error){
				return redirectToLogin(error)
			});
		}

		function getRef(resource, query) {
			openmrsApi.add(resource);
			query = addMode(query, 'ref');
			return openmrsApi[resource].get(query).$promise.then(function (response) {
				return response;
			}, function(error){
				return redirectToLogin(error)
			});
		}

		function create(resource, model) {
			openmrsApi.add(resource);
			return openmrsApi[resource].save(model).$promise.then(function (response) {
				return response;
			}, function(error){
				return redirectToLogin(error)
			});
		}

		function update(resource, query, model) {
			openmrsApi.add(resource);
			return openmrsApi[resource].save(query, model).$promise.then(function (response) {
				return response;
			}, function(error){
				return redirectToLogin(error)
			});
		}

		function remove(resource, query) {
			openmrsApi.add(resource);
			return openmrsApi[resource].remove(query).$promise.then(function (response) {
				return response;
			}, function(error){
				return redirectToLogin(error)
			});
		}

		function unretire(resource, query) {
			openmrsApi.add(resource);
			return openmrsApi[resource].save(query, {retired: false}).$promise.then(function (response) {
				return response;
			}, function(error){
				return redirectToLogin(error)
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
			}, function(error){
				return redirectToLogin(error)
			});
		}

		function addMode(query, type) {
			if (query == null) {
				return {v: type};
			} else {
				return angular.extend(query, {v: type});
			}
		}

		function getOpenmrsContextPath() {
			var pathname = $window.location.pathname;
			return pathname.substring(0, pathname.indexOf('/owa/'));
		}

		function redirectToLogin(error){
			if(error.status === 401 || error.status === 404){
				var url = getOpenmrsContextPath() + '/login.htm?referer_url=' + $window.location.href
				$window.location.href = url
				return error
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