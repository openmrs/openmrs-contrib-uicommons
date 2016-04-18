/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
var template = require('./openmrs-breadcrumbs.html');

export default angular.module('openmrs-contrib-uicommons.breadcrumbs', []).component('openmrsBreadcrumbs', {
  template: template,
  controller: OpenmrsBreadcrumbsController,
  controllerAs: 'vm',
  bindings: {
    links : '<'
  }
}).name;

OpenmrsBreadcrumbsController.$inject=['$window'];

function OpenmrsBreadcrumbsController($window) {

  var vm = this;

  vm.openmrsContextPath = getOpenmrsContextPath();

  function getOpenmrsContextPath() {
    var pathname = $window.location.pathname;
    return pathname.substring(0, pathname.indexOf('/owa/'));
  }
}