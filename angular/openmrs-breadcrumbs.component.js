var template = require('../partials/angular/breadcrumbs.html');

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