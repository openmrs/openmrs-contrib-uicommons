/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

var template = require('./openmrs-list.html');
//var openmrs = require('../../src/scss/images/inprogress.gif'); //TODO: *.png logo image here
import openmrsRest from './../openmrs-rest/openmrs-rest.js';

export default angular.module('openmrs-contrib-uicommons.openmrs-list', ['openmrs-contrib-uicommons.rest'])
    .component('openmrsList', {
        template: template,
        controller: openmrsList,
        controllerAs: 'vm',
        bindings: {
            resource: '<',
            columns: '<',
            actions: '<',
            redirectionParam: '<',
            limit: '<'
        }
    }).name;

openmrsList.$inject = ['openmrsRest', '$location'];

function openmrsList(openmrsRest, $location) {
    var vm = this;

    //vm.logo = openmrs; //TODO: *.png logo image here
    vm.data = [];
    vm.deleteClicked = false;
    vm.deleteItem = '';
    vm.isThisOnePageSet = false; //Default

    vm.resolveRetireButtons = function(object, activity) {
        return !((object.retired && activity === 'retire')
        || (!object.retired && activity === 'unretire'));
    };

    vm.performAction = function(object, activity) {

        if (activity === 'edit' || activity === 'view') {
            edit(object);
        }
        else if (activity === 'retire') {
            retire(object);
        }
        else if (activity === 'unretire') {
            unretire(object);
        }
        else if (activity === 'purge') {
            showAlert(object);
        }
        else {
            console.log('There is no action for activity  \"' + activity + '\"')
        }
    };

    vm.updateDeleteConfirmation = function updateDeleteConfirmation(isConfirmed) {
        if (isConfirmed) {
            purge(vm.deleteItem);
        }
        vm.deleteClicked = false;
    };

    function getData(listAll) {
        if (listAll) {
            vm.loadingInitialPage = true;
            openmrsRest.listFull(vm.resource, {limit: vm.limit, includeAll: true}).then(function (firstResponse) {
                vm.loadingInitialPage = false;
                vm.data = firstResponse.results;

                vm.isThisOnePageSet = vm.data.length < vm.limit;

                //Check for more data
                if (!vm.isThisOnePageSet) {
                    vm.loadingMorePages = true;
                    openmrsRest.listFull(vm.resource,{includeAll: true}).then(function (response) {
                        vm.data = response.results;
                        vm.loadingMorePages = false;
                    });
                }
            });
        }
        else {
            vm.loadingInitialPage = true;
            openmrsRest.list(vm.resource, {limit: vm.limit, includeAll: true}).then(function (firstResponse) {
                vm.loadingInitialPage = false;
                vm.data = firstResponse.results;

                vm.isThisOnePageSet = vm.data.length < vm.limit;

                //Check for more data
                if (!vm.isThisOnePageSet) {
                    vm.loadingMorePages = true;
                    openmrsRest.list(vm.resource,{includeAll: true}).then(function (response) {
                        vm.data = response.results;
                        vm.loadingMorePages = false;
                    });
                }
            });
        }
    }
    //init data
    getData(true);

    function retire(item) {
        openmrsRest.retire(vm.resource, {uuid: item.uuid}).then(function(response) {
            getData(true);
        });
    }

    function unretire(item) {
        openmrsRest.unretire(vm.resource, {uuid: item.uuid}).then(function(response) {
            getData(true);
        });
    }

    function purge(item) {
        openmrsRest.purge(vm.resource, {uuid: item.uuid}).then(function(response) {
            getData(true);
        });
    }

    function edit(item) {
        $location.path(vm.redirectionParam + '/' + item.uuid);
    }

    function showAlert(item) {
        vm.deleteItem = item;
        vm.deleteClicked = true;
    }

    //Paging logic:
    vm.sliceFrom = sliceFrom;
    vm.sliceTo = sliceTo;
    vm.page = 1;
    vm.nextPage = nextPage;
    vm.prevPage = prevPage;
    vm.firstPage = firstPage;
    vm.lastPage = lastPage;
    vm.loadingInitialPage = true;
    vm.loadingMorePages = false;
    vm.totalPages = totalPages;

    function sliceFrom() {
        return vm.page * vm.limit - vm.limit;
    }
    function sliceTo() {
        return vm.page * vm.limit;
    }
    function nextPage() {
        vm.page++;
    }
    function prevPage() {
        vm.page--;
    }
    function firstPage() {
        vm.page = 1;
    }
    function lastPage() {
        vm.page = Math.floor(vm.data.length / vm.limit) + 1;
    }
    function totalPages() {
        return Math.floor(vm.data.length / vm.limit) + 1;
    }

    //ng-disabled logic
    vm.isPrevPagePossible = isPrevPagePossible;
    vm.isNextPagePossible = isNextPagePossible;
    vm.isFirstPagePossible = isFirstPagePossible;
    vm.isLastPagePossible = isLastPagePossible;

    function isPrevPagePossible() {
        return vm.page > 1;
    }
    function isNextPagePossible() {
        return vm.sliceTo() <= vm.data.length;
    }
    function isFirstPagePossible() {
        return vm.page > 1
    }
    function isLastPagePossible() {
        return vm.page < Math.floor(vm.data.length / vm.limit) + 1;
    }

    //ng-show logic
    vm.isWholeNavigationPanelVisible = isWholeNavigationPanelVisible;
    vm.isSecondLoaderNotificationVisible =isSecondLoaderNotificationVisible;
    vm.isInitialLoaderImageNotificationVisible = isInitialLoaderImageNotificationVisible;
    vm.isButtonPanelVisible = isButtonPanelVisible;
    
    function isWholeNavigationPanelVisible() {
        return !vm.isThisOnePageSet && vm.data.length !== 10 && (!vm.loadingMorePages || !vm.loadingInitialPage);
    }
    function isSecondLoaderNotificationVisible() {
        return vm.loadingMorePages;
    }
    function isInitialLoaderImageNotificationVisible() {
        return vm.loadingInitialPage;
    }
    function isButtonPanelVisible() {
        return !isSecondLoaderNotificationVisible() && !isInitialLoaderImageNotificationVisible()
    }

}