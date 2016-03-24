angular.module('openmrs-ui-commons', []).component('openmrsHeader', {
  templateUrl: '../uicommons/partials/angular/openmrs-header.html',
  controller: OpenmrsHeaderController,
  bindings: {
    title : '<'
  }
});

OpenmrsHeaderController.$inject=[];

function OpenmrsHeaderController() {	

}

