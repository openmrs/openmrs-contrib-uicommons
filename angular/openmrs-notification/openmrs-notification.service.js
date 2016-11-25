/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import toastr from 'angular-toastr';
import ngAnimate from 'angular-animate';
import ngRoute from 'angular-route';
import uiRouter from 'angular-ui-router';

import css from './openmrs-notification.css'
/**
 * 
 * It's basically wrapper for angular-toastr, but with openmrs color palette and already managed dependencies
 * 
 */
export default angular.module('openmrs-contrib-uicommons.notification', [uiRouter, 'ngAnimate', 'toastr', 'ngRoute'])
						.factory('openmrsNotification', openmrsNotification).name;

openmrsNotification.$inject=['toastr', '$routeParams', '$stateParams', '$location'];

function openmrsNotification(toastr, $routeParams, $stateParams, $location) {
	var service = {
			success : success,
			info : info,
			error : error,
			warning : warning,
			routeNotification : routeNotification
	};
	return service;
	
	function success (content, title){
		return toastr.success(content, title);
	}
	function info (content, title){
		return toastr.info(content, title);
	}
	function error (content, title){
		return toastr.error(content, title);
	}
	function warning (content, title){
		return toastr.warning(content, title);
	}
	function routeNotification(){
		var types = ["infoToast", "errorToast", "successToast", "warningToast"];
		var method;
		for(var i=0; i< types.length; i++){
			if(angular.isDefined($routeParams[types[i]])){
				method = types[i].substring(0, types[i].indexOf('Toast'));
				service[method].call(this, $routeParams[types[i]]);
			}
			else if(angular.isDefined($stateParams[types[i]])){
				method = types[i].substring(0, types[i].indexOf('Toast'));
				service[method].call(this, $stateParams[types[i]]);
			}
			else if(angular.isDefined($location.search()[types[i]])){
				method = types[i].substring(0, types[i].indexOf('Toast'));
				service[method].call(this, $location.search()[types[i]]);
			}
		}
	}
}

