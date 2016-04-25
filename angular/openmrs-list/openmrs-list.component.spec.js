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
require ('./openmrs-list.component.js');

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
        var component, scope, $httpBackend, $componentController;


        beforeEach(inject(function(_$httpBackend_, $rootScope, _$componentController_) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET(/translation.*/).respond();
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();
            $httpBackend.whenGET('/ws/rest/v1/class?v=full').respond({});
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?includeAll=true&limit=5&v=full').
            respond(
                {results: [
                    {
                        uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
                        display: 'Class1',
                        conceptClass: {
                            display: "Class1Display"
                        }
                    },
                    {
                        uuid: '3fc4d6bd-7206-4d7d-9ec3-b5fa7822e3df',
                        display: 'Class2',
                        conceptClass: {
                            display: "Class2Display"
                        }
                    },
                    {
                        uuid: 'd0a052f7-b6fd-4f3e-8385-7dc06d6f3855',
                        display: 'Class3',
                        conceptClass: {
                            display: "Class3Display"
                        }
                    },
                    {
                        uuid: '3414d6bd-ad12-4f3e-8385-7dc06d6f3999',
                        display: 'Class4',
                        conceptClass: {
                            display: "Class4Display"
                        }
                    },
                    {
                        uuid: '8aad49d3-sd12-4f3e-8385-7dc06d6f3114',
                        display: 'Class5',
                        conceptClass: {
                            display: "Class5Display"
                        }
                    }
                ]});
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?includeAll=true&v=full').
            respond(
                {results: [
                    {
                        uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
                        display: 'Class1',
                        conceptClass: {
                            display: "Class1Display"
                        }
                    },
                    {
                        uuid: '3fc4d6bd-7206-4d7d-9ec3-b5fa7822e3df',
                        display: 'Class2',
                        conceptClass: {
                            display: "Class2Display"
                        }
                    },
                    {
                        uuid: 'd0a052f7-b6fd-4f3e-8385-7dc06d6f3855',
                        display: 'Class3',
                        conceptClass: {
                            display: "Class3Display"
                        }
                    },
                    {
                        uuid: '3414d6bd-ad12-4f3e-8385-7dc06d6f3999',
                        display: 'Class4',
                        conceptClass: {
                            display: "Class4Display"
                        }
                    },
                    {
                        uuid: '8aad49d3-sd12-4f3e-8385-7dc06d6f3114',
                        display: 'Class5',
                        conceptClass: {
                            display: "Class5Display"
                        }
                    },
                    {
                        uuid: 'y2rw49d3-a4df-a5df-qw6r-7dc06d6fas2f',
                        display: 'Class6',
                        conceptClass: {
                            display: "Class6Display"
                        }
                    }
                ]});

            scope = $rootScope.$new();
            $componentController = _$componentController_;

            component = $componentController('openmrsList', {$scope: scope},
                {resource: 'conceptclass', redirectionParam: 'class', limit : 5});


        }));

        it('should get data and load more pages when response is more than one page', function(){

            component.getData(true);
            $httpBackend.flush();

            expect(component.data).toEqualData(
                [{
                    uuid: '80bd49d3-4a3b-4566-95be-8a4cf4b411f4',
                    display: 'Class1',
                    conceptClass: {
                        display: "Class1Display"
                    }
                },
                {
                    uuid: '3fc4d6bd-7206-4d7d-9ec3-b5fa7822e3df',
                    display: 'Class2',
                    conceptClass: {
                        display: "Class2Display"
                    }
                },
                {
                    uuid: 'd0a052f7-b6fd-4f3e-8385-7dc06d6f3855',
                    display: 'Class3',
                    conceptClass: {
                        display: "Class3Display"
                    }
                },
                {
                    uuid: '3414d6bd-ad12-4f3e-8385-7dc06d6f3999',
                    display: 'Class4',
                    conceptClass: {
                        display: "Class4Display"
                    }
                },
                {
                    uuid: '8aad49d3-sd12-4f3e-8385-7dc06d6f3114',
                    display: 'Class5',
                    conceptClass: {
                        display: "Class5Display"
                    }
                },
                {
                    uuid: 'y2rw49d3-a4df-a5df-qw6r-7dc06d6fas2f',
                    display: 'Class6',
                    conceptClass: {
                        display: "Class6Display"
                    }
                }]
            );
        });
    });
});