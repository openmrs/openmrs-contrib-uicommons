/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
var template = require('./openmrs-conceptAutocomplete.html');
import openmrsRest from './../openmrs-rest/openmrs-rest.js';
import uiBootstrap from 'angular-ui-bootstrap';
import ngSanitize from 'angular-sanitize';

export default angular.module('openmrs-contrib-uicommons.concept-autoComplete', ['openmrs-contrib-uicommons.rest', 'ui.bootstrap', 'ngSanitize'])
						.component('conceptAutoComplete', {
							  template: template,
							  controller: conceptAutoComplete,
							  bindings: {
							    limitToClass: '<',
								membersOf: '<',
							    required: '<',
							    concept: '<',
							    onUpdate: '&' 
							  }}).name;

conceptAutoComplete.$inject = ['openmrsRest']

	
function conceptAutoComplete(openmrsRest){
	var vm = this;
	
	
	vm.searchText = vm.concept.display;
	
		
	vm.concepts =[];
	vm.suggestions = [];
	vm.isCorrect = !vm.required; 
	vm.concept;
	vm.newConcept;
	
	vm.search = search;
	vm.checkInput = checkInput;
	vm.display = display;
	vm.onSelect = onSelect;
	
	activate();
	
	function activate(){
		if(vm.concept.display.length > 0){
			vm.isCorrect = true;
		}
	}

	function onSelect($item, $model, $label) {
		if(angular.isDefined($item.display)){
			vm.searchText = $item.display;
		}
		vm.newConcept = $item;
		vm.isCorrect = true;
		vm.onUpdate({isCorrect: vm.isCorrect, concept: vm.newConcept});
	}

	function display(display, uuid) {
		return display +"</br><sub>"+ uuid+"</sub>";
	}

	function checkInput(){
		var display = vm.searchText;
		if(angular.isDefined(vm.searchText)){
			if(angular.isDefined(vm.searchText.display)){ 
				display = vm.searchText.display;
			}
		}
		if(angular.isUndefined(display)){
			display = '';
		}
		for(var i=0; i<vm.suggestions.length; i++){
			if(display === vm.suggestions[i].display){
				vm.isCorrect = true;
				vm.newConcept = vm.suggestions[i]
				break;
			}else{
				vm.isCorrect = false;
				break;
			}
		} 
		if(display === '' && !vm.required){
			vm.isCorrect = true;
			vm.newConcept = {
					display: ''
			};
		}
	}

	function search(){
		var maxResults = 0;
		vm.suggestions = [];
		vm.isCorrect = false;
		var display = vm.searchText;
		if(angular.isDefined(vm.searchText)){
			if(angular.isDefined(vm.searchText.display)){
				display = vm.searchText.display;
			}
		}
		if(angular.isUndefined(display)){
			display = '';
		}
		if(display.length > 1){
			if (angular.isUndefined(vm.membersOf)) {
				openmrsRest.listFull('concept', {q: display, includeAll: true}).then(function (response) {
					vm.concepts = response.results;
					for (var i = 0; i < vm.concepts.length; i++) {
						if ((!vm.limitToClass) || (vm.concepts[i].conceptClass.display === vm.limitToClass && vm.limitToClass)) {
							vm.suggestions.push(vm.concepts[i]);
							maxResults += 1;
							if (maxResults == 5) {
								break;
							}
						}
					}
					vm.checkInput();
					vm.onUpdate({isCorrect: vm.isCorrect, concept: vm.newConcept});
				});
			} else if(vm.membersOf === 'Route') {
				openmrsRest.listFull('systemsetting', {q: 'conceptDrug.route.conceptClasses'}).then(function (response){
					if(response.results[0].value === null){
						var uuid = '162394AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
					}else {
						var uuid = response.results[0].value;
					}
					openmrsRest.getFull('concept', {uuid: uuid}).then(function (success) {
						vm.concepts = success.setMembers;
						for (var i = 0; i < vm.concepts.length; i++) {
							var conceptName = vm.concepts[i].display.toLowerCase();
							var displayLower = display.toLowerCase();
							if (conceptName.indexOf(displayLower) > -1) {
								vm.suggestions.push(vm.concepts[i]);
								maxResults += 1;
								if (maxResults == 5) {
									break;
								}
							}
						}
						vm.checkInput();
						vm.onUpdate({isCorrect: vm.isCorrect, concept: vm.newConcept});
					});
				});
			}
		}else{
			vm.checkInput();
			vm.onUpdate({isCorrect: vm.isCorrect, concept: vm.newConcept});
		}
	}

}

		
