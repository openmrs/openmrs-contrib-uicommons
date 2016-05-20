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
require ('./openmrs-header.component.js')

describe('Header', function() {

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

    beforeEach(angular.mock.module('openmrs-contrib-uicommons.header'));

    describe('component: openmrs-header-component', function() {
        var component, scope, $componentController, $httpBackend, limitToDrugs, concept, onUpdate;


        beforeEach(inject(function(_$httpBackend_, $rootScope, _$componentController_, openmrsRest) {
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('manifest.webapp').respond(500, "");
            $httpBackend.whenGET(/translation.*/).respond();
            $httpBackend.whenGET('components/indexMenu/indexMenu.html').respond();
            $httpBackend.whenGET('/ws/rest/v1/conceptclass?v=full').respond({});
            $httpBackend.whenGET('/ws/rest/v1/location?tag=b8bbf83e-645f-451f-8efe-a0db56f09676&v=full').
            respond(
                {results: [
                    {
                        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
                        display: "Inpatient Ward"
                    },
                    {
                        uuid: "2131aff8-2e2a-480a-b7ab-4ac53250262b",
                        display: "Isolation Ward"
                    },
                    {
                        uuid: "7fdfa2cb-bc95-405a-88c6-32b7673c0453",
                        display: "Laboratory"
                    }

                ]});
            $httpBackend.whenGET('/ws/rest/v1/appui/session').
            respond(
                {
                    authenticated: "true",
                    sessionLocation: {
                        uuid: "6351fcf4-e311-4a19-90f9-35667d99a8af",
                        display: "Registration Desk",
                        "name": "Registration Desk"
                    },
                    user: {
                        uuid: "f4fe6fe3-177d-11e6-8101-d4bed92c1a0d",
                        display: "admin",
                        username: "",
                        systemId:"admin"
                    }
                });
            
            scope = $rootScope.$new();
            $componentController = _$componentController_;
        }));

        it('should list all availbe locations', function(){

            component = $componentController('openmrsHeader', {$scope: scope});
            $httpBackend.flush();
            var listLocations = [
                {
                    uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
                    display: "Inpatient Ward"
                },
                {
                    uuid: "2131aff8-2e2a-480a-b7ab-4ac53250262b",
                    display: "Isolation Ward"
                },
                {
                    uuid: "7fdfa2cb-bc95-405a-88c6-32b7673c0453",
                    display: "Laboratory"
                }
            ]
            expect(component.locationList).toEqualData(listLocations);
        });


        it('should get sessionLocation', function(){

            component = $componentController('openmrsHeader', {$scope: scope});
            $httpBackend.flush();
            var sessionLocation = {
                uuid: "6351fcf4-e311-4a19-90f9-35667d99a8af",
                display: "Registration Desk",
                "name": "Registration Desk"
            }
            expect(component.sessionContext.sessionLocation).toEqualData(sessionLocation);
        });

    });})