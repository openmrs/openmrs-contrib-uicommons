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

import css from './openmrs-notification.css'
/**
 * 
 * It's basically wrapper for angular-toastr, but with openmrs color palette and already managed dependencies
 * 
 */
export default angular.module('openmrs-contrib-uicommons.notification', ['ngAnimate', 'toastr'])
						.factory('openmrsNotification', openmrsNotification).name;

openmrsNotification.$inject=['toastr'];

function openmrsNotification(toastr) {
	var service = {
			success : success,
			info : info,
			error : error,
			warning : warning
	}	
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
}

