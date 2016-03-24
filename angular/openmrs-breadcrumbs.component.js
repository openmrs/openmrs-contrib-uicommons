angular.module('openmrs-ui-commons').component('openmrsBreadcrumbs', {
  templateUrl: '../uicommons/partials/angular/breadcrumbs.html',
  controller: OpenmrsBreadcrumbsController,
  bindings: {
    links : '<'
  }
});

OpenmrsBreadcrumbsController.$inject=[];

function OpenmrsBreadcrumbsController() {	

}