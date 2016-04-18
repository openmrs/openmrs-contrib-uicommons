/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
var template = require('./openmrs-header.html');
var openmrs = require('../../src/scss/images/openmrs-with-title-small.png');

export default angular.module('openmrs-contrib-uicommons.header', []).component('openmrsHeader', {
  template: template,
  controller: OpenmrsHeaderController,
  controllerAs: 'vm',
  bindings: {
    title : '<'
  }
}).name;

OpenmrsHeaderController.$inject=[];

function OpenmrsHeaderController() {
	var vm = this;
	vm.logo = openmrs;
}

