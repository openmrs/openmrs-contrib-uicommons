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
require ('./openmrs-list.component.js')

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

    beforeEach(angular.mock.module('openmrs-contrib-uicommons.list'));

    describe('component: openmrsList', function() {
        var component, scope, $componentController, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, _$componentController_, openmrsRest) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET(/translation.*/).respond();
            $httpBackend.whenGET('manifest.webapp').respond(500, "");
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});            


            scope = $rootScope.$new();
            $componentController = _$componentController_;

        }));

        it('should have default valuess defined', function(){


            component = $componentController('openmrsList',
                {
                    $scope: scope
                },
                {
                    resource: 'testres'
                }
            );

            $httpBackend.whenGET('/ws/rest/v1').respond({"results": []});
            $httpBackend.whenGET('/ws/rest/v1/conceptclass').respond({"results": []});
            $httpBackend.whenGET('/ws/rest/v1/testres?includeAll=false&limit=10&startIndex=NaN&v=full').respond({"results": []});
            $httpBackend.flush();

            expect(component.getType()).toEqualData('table');
            expect(component.getActions()).toEqualData([{"action":"view", "label":"View"}]);
            expect(component.getSearchPanel()).toEqualData(false);
            expect(component.getLimit()).toEqualData(10);
            expect(component.getListAll()).toEqualData(false);
        });

        it('should fetch all resources by list-all attribute', function(){

            component = $componentController('openmrsList',
                {
                    $scope: scope
                },
                {
                    resource: 'conceptclass',
                    listAll: true,
                    columns: [
                        {
                            "property": "name",
                            "label": "Concept.name"
                        },
                        {
                            "property": "description",
                            "label":"Description"
                        }]
                }
            );

            var listAllTrueResponse =
            {
                "results": [{
                    "uuid": "aba9274a-1c73-45d1-82e9-663111b32565",
                    "display": "retiredDrug",
                    "name": "retiredDrug",
                    "description": "retiredDrug",
                    "retired": true
                },
                {
                    "uuid": "c543d951-0201-4e20-94bd-64b44120991e",
                    "display": "Drug",
                    "name": "Drug",
                    "description": "Drug",
                    "retired": false,
                    "resourceVersion": "1.8"
                }]
            };
            $httpBackend.whenGET('/ws/rest/v1').respond({"results": []});
            $httpBackend.whenGET('/ws/rest/v1/conceptclass').respond({"results": []});
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?includeAll=true&limit=10&source=&startIndex=0&v=full').respond(listAllTrueResponse);
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?includeAll=true&limit=10&startIndex=NaN&v=full').respond(listAllTrueResponse);
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?includeAll=true&limit=10&startIndex=0&v=full').respond(listAllTrueResponse);

            var listAllFalseResponse =
            {
                "results": [{
                    "uuid": "c543d951-0201-4e20-94bd-64b44120991e",
                    "display": "Drug",
                    "name": "Drug",
                    "description": "Drug",
                    "retired": false
                }]
            };
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?includeAll=false&limit=10&source=&startIndex=0&v=full').respond(listAllFalseResponse);
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?includeAll=false&limit=10&startIndex=NaN&v=full').respond(listAllFalseResponse);
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?includeAll=false&limit=10&startIndex=0&v=full').respond(listAllFalseResponse);



            $httpBackend.flush();
            expect(component.data).toEqualData(listAllTrueResponse.results);


            component.listAll = false;
            component.getPage();
            $httpBackend.flush();
            expect(component.data).toEqualData(listAllFalseResponse.results);
        });

        it('should perform action on button click', function() {

            component = $componentController('openmrsList',
                {
                    $scope: scope
                },
                {
                    resource: 'drug',
                    columns: [
                        {
                            "property": "name",
                            "label": "Concept.name"
                        },
                        {
                            "property": "description",
                            "label":"Description"
                        }]
                }
            );

            var response = {results : [{
                "uuid": "c543d951-0201-4e20-94bd-64b44120991e",
                "display": "Drug",
                "name": "Drug",
                "description": "Drug",
                "retired": true
            }]};
            
            $httpBackend.whenGET('/ws/rest/v1').respond({"results": []});
            $httpBackend.whenGET('/ws/rest/v1/conceptclass').respond({"results": []});
            $httpBackend.whenGET('manifest.webapp').respond(500, "");
            $httpBackend.whenGET('/ws/rest/v1/drug?includeAll=false&limit=10&source=&startIndex=0&v=full').respond(response);
            $httpBackend.whenGET('/ws/rest/v1/drug?includeAll=false&limit=10&startIndex=NaN&v=full').respond(response);
            $httpBackend.whenGET('/ws/rest/v1/drug?includeAll=false&limit=10&startIndex=0&v=full').respond(response);
            $httpBackend.flush();
            var action = {
                'action':'unretire'
            };
            component.performAction(component.data[0], action);
            $httpBackend.expectPOST('/ws/rest/v1/drug/c543d951-0201-4e20-94bd-64b44120991e').respond({});
            component.resolveComplexProperties = function () {
                return false;
            };
            $httpBackend.flush();
        });
    });
});