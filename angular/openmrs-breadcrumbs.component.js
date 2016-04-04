var template = require('../partials/angular/breadcrumbs.html');

export default angular.module('openmrs-contrib-uicommons.breadcrumbs', []).component('openmrsBreadcrumbs', {
  template: template,
  controller: OpenmrsBreadcrumbsController,
  bindings: {
    links : '<'
  }
}).name;

OpenmrsBreadcrumbsController.$inject=[];

function OpenmrsBreadcrumbsController() {	

}