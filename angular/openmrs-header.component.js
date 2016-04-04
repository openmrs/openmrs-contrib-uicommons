var template = require('../partials/angular/openmrs-header.html');

export default angular.module('openmrs-contrib-refapp-ui-lib.header', []).component('openmrsHeader', {
  template: template,
  controller: OpenmrsHeaderController,
  bindings: {
    title : '<'
  }
}).name;

OpenmrsHeaderController.$inject=[];

function OpenmrsHeaderController() {	

}

