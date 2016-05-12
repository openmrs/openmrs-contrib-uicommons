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

            $httpBackend.expectGET('/ws/rest/v1/testres?includeAll=false&limit=10&v=full').respond({"results": []});
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

            component.resolveComplexProperties = function () {
                return false;
            };

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
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?includeAll=true&limit=10&v=full').respond(listAllTrueResponse);

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
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?includeAll=false&limit=10&v=full').respond(listAllFalseResponse);


            $httpBackend.flush();
            expect(component.data).toEqualData(listAllTrueResponse.results);

            component.listAll = false;
            component.getData();
            $httpBackend.flush();
            expect(component.data).toEqualData(listAllFalseResponse.results);
        });

        it('should check for more data when first response is equal to limit', function(){

            component = $componentController('openmrsList',
                {
                    $scope: scope
                },
                {
                    limit: 3,
                    resource: 'conceptclass',
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

            $httpBackend.whenGET('/ws/rest/v1/conceptclass?includeAll=false&limit=3&v=full').respond(
                {
                    results:
                        [{"Data1":"Data1"},{"Data2":"Data2"},{"Data3":"Data3"}]
                });
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?includeAll=false&v=full').respond(
                {
                    results:
                        [{"Data1":"Data1"},{"Data2":"Data2"},{"Data3":"Data3"}, {"Data4":"Data4"}, {"Data5":"Data5"}]
                });
            $httpBackend.flush();
            expect(component.data.length > component.limit).toEqualData(true);
        });
    });
});