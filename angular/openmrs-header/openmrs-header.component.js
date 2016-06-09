/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import openmrsRest from './../openmrs-rest/openmrs-rest.js';
import ngDropdwons from 'angular-dropdowns'
import css from './openmrs-header.css'

var template = require('./openmrs-header.html');
var openmrs = require('../../src/scss/images/openmrs-with-title-small.png');

export default angular.module('openmrs-contrib-uicommons.header', ['openmrs-contrib-uicommons.rest', 'ngDropdowns']).component('openmrsHeader', {
  template: template,
  controller: OpenmrsHeaderController,
  controllerAs: 'vm',
  bindings: {

  }
}).name;

OpenmrsHeaderController.$inject=['openmrsRest', '$window'];

function OpenmrsHeaderController(openmrsRest, $window) {
	var vm = this;

    vm.logo = openmrs;
    vm.locationList = [];
    vm.selectedLocation = {};
    vm.disableLocationDropdown = false;
    vm.sessionContext = {};

    vm.accountOptions = [
        {
            option: 'My Account',
            destPage: '/adminui/myaccount/myAccount.page'
        }
    ];
    vm.selectedOption = {};



    vm.activate = activate;
    vm.changeLocation = changeLocation;
    vm.toggleLocationDropdown = toggleLocationDropdown;
    vm.redirectTo = redirectTo;
    vm.goToUserOption = goToUserOption;

    activate();

    function activate() {
        vm.locationList = [];
        openmrsRest.listFull('location', {tag: 'b8bbf83e-645f-451f-8efe-a0db56f09676'}).then(function (response) {
            if(response.results.length > 0){
                openmrsRest.get('appui/session').then(function(session) {
                    vm.sessionContext = session;
                    if(angular.isUndefined(vm.sessionContext.sessionLocation.display)){
                        vm.sessionContext.sessionLocation.display = '';
                    }
                    angular.forEach(response.results, function(location){
                        if(location.display !== vm.sessionContext.sessionLocation.display) {
                            vm.locationList.push(location);
                        }
                    });
                    vm.toggleLocationDropdown();
                });
            }
        });

    }

    function goToUserOption(selected) {
        redirectTo(selected.destPage);
    }

    function redirectTo(destinationPage) {
        openmrsRest.getServerUrl().then(function(url){
            $window.location.href = url + destinationPage;
        });
    }

    function changeLocation(selected) {
        var sessionObject = {
            "location": selected.uuid
        }
        openmrsRest.update('appui/session', sessionObject).then(function(response){
           activate();
        });
    }

    function toggleLocationDropdown() {
        if(vm.locationList.length < 1){
            vm.disableLocationDropdown = true;
        }else{
            vm.disableLocationDropdown = false;
        }
    }
}

