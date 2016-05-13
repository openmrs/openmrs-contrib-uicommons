/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

/* jasmine specs for controllers go here */
require ('./openmrs-conceptAutocomplete.component.js')

describe('Concept dictionary controllers', function() {

    beforeEach(function(){
        jasmine.addMatchers({
            toEqualData: function(util, customEqualityTesters) {
                return {
                    compare: function(actual, expected) {
                        var passed = angular.equals(actual, expected);
                        return {
                            pass: passed,
                            message: 'Expected ' + actual + (passed ? '' : ' not') + ' to equal ' + expected
                        }
                    }
                }
            }
        });
    });
    
    beforeEach(angular.mock.module('openmrs-contrib-uicommons.concept-autoComplete'));

    describe('component: conceptAutoComplete', function() {
    	  var component, scope, $componentController, $httpBackend, limitToDrugs, concept, onUpdate;
    	  

    	  beforeEach(inject(function(_$httpBackend_, $rootScope, _$componentController_, openmrsRest) {
    		  $httpBackend = _$httpBackend_;
  	          $httpBackend.whenGET('manifest.webapp').respond(500, "");
			  $httpBackend.whenGET(/translation.*/).respond();
              $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();
              $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
    		  $httpBackend.whenGET('/ws/rest/v1/concept').
              respond(
                  {results: [
                      {
                          uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
                          display: 'Narkotyk',
                          conceptClass: {
                        	  display: "Drug"
                          }
                      },
                      {
                          uuid: '3fc4d6bd-7206-4d7d-9ec3-b5fa7822e3df',
                          display: 'Morphine',
                          conceptClass: {
                        	  display: "Drug"
                          }
                      },
                      {
                          uuid: 'd0a052f7-b6fd-4f3e-8385-7dc06d6f3806',
                          display: 'Aspiryn',
                          conceptClass: {
                        	  display: "Not Drug"
                          }
                      } 
                  ]});
    		  $httpBackend.whenGET('/ws/rest/v1/concept?includeAll=true&q=na&v=full').
              respond(
                  {results: [
                      {
                          uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
                          display: 'Narkotyk',
                          conceptClass: {
                        	  display: "Drug"
                          }
                      }]});
    		  $httpBackend.whenGET('/ws/rest/v1/concept?includeAll=true&q=Narkotyk&v=full').
              respond(
                  {results: [
                      {
                          uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
                          display: 'Narkotyk',
                          conceptClass: {
                        	  display: "Drug"
                          }
                      }]});
    	    scope = $rootScope.$new();
    	    $componentController = _$componentController_;
    	    
    	    onUpdate = function(){
    	    	
    	    }
    	   
    	    
    	  }));

    	  it('should create component with drugs limitation', function(){
      	      limitToDrugs = true;
      	      concept = {
      	    		  display:''
      	      }
    		  component = $componentController('conceptAutoComplete', {$scope: scope}, 
    				  							{limitToDrugs: limitToDrugs, concept: concept});
    		  expect(component.limitToDrugs).toEqualData(true);
    	  });
    	  it('should load concepts that have "na" string in name', function(){
      	      limitToDrugs = true;
      	      concept = {
      	    		  display:'na'
      	      }
      	      var updateSpy = jasmine.createSpy('updateSpy');
    		  component = $componentController('conceptAutoComplete', {$scope: scope}, 
    				  							{limitToDrugs: limitToDrugs, concept: concept, onUpdate: updateSpy });
      	      component.search();
    		  $httpBackend.flush();
    		  expect(component.suggestions).toEqualData([{uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
    			  										  display: 'Narkotyk',
										                  conceptClass: {
										                	  display: "Drug"
										                  }}]);
    		  expect(updateSpy).toHaveBeenCalled();
    	  });
    	  it('should create newConcept', function(){
      	      limitToDrugs = true;
      	      concept = {
      	    		  display:'Narkotyk'
      	      }
      	      var updateSpy = jasmine.createSpy('updateSpy');
    		  component = $componentController('conceptAutoComplete', {$scope: scope}, 
    				  							{limitToDrugs: limitToDrugs, concept: concept, onUpdate: updateSpy });
      	      component.search();
    		  $httpBackend.flush();
    		  expect(component.suggestions).toEqualData([{uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
    			  										  display: 'Narkotyk',
										                  conceptClass: {
										                	  display: "Drug"
										                  }}]);
    		  expect(component.newConcept.display).toEqualData("Narkotyk");
    	  });
    	  
});})