var template = require('../partials/angular/openmrs-header.html');
var openmrs = require('./../src/scss/images/openmrs-with-title-small.png');

export default angular.module('openmrs-contrib-refapp-ui-lib.header', []).component('openmrsHeader', {
  template: template,
  controller: OpenmrsHeaderController,
  bindings: {
    title : '<'
  }
}).name;

OpenmrsHeaderController.$inject=[];

function OpenmrsHeaderController() {	
	var vm = this;
	vm.logo = openmrs;
}

