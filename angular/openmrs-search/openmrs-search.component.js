/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

var template = require('./openmrs-search.html');
var openmrs = require('../../src/scss/images/inprogress.gif'); //TODO: *.png logo image here
import openmrsRest from './../openmrs-rest/openmrs-rest.js';

export default angular.module('openmrs-contrib-uicommons.search', ['openmrs-contrib-uicommons.rest'])
    .component('openmrsSearch', {
        template: template,
        controller: openmrsSearch,
        controllerAs: 'vm',
        bindings: {
            resource: '<',
            columnsMain: '<',
            columnsDetails: '<',
            redirectionParam: '<',
            type: '<'
        }
    }).name;

openmrsSearch.$inject = ['openmrsRest', '$scope'];

function openmrsSearch(openmrsRest, $scope) {
    var vm = this;

    vm.logo = openmrs; //TODO: *.png logo image here
    vm.data = [];
    vm.query = '';
    vm.entriesPerPage = 5;

    //Manage custom icons and labels values
    function resolveCustomIcons() {
        if (angular.isDefined(vm.actions)) {
            for (var i = 0; i < vm.actions.length; i++) {
                if (angular.isDefined(vm.actions[i].icon)) {
                    vm.icon[vm.actions[i].action] = vm.actions[i].icon;
                }
            }
        }
    }
    function resolveCustomLabels() {
        if (angular.isDefined(vm.columns)) {
            for (var i = 0; i < vm.columns.length; i++) {
                if (angular.isUndefined(vm.columns[i].label)) {
                    vm.columns[i].label = vm.columns[i].property;
                }
            }
        }
    }
    resolveCustomIcons();
    resolveCustomLabels();
    
    vm.getData = getData;
    vm.timeoutRefresh = timeoutRefresh;

    // Method used to prevent app from querying server with every letter input into search query panel
    var timeout = null;
    function timeoutRefresh() {
        clearTimeout(timeout);
        vm.isUserTyping = true;
        timeout = setTimeout(function () {
            vm.getData();
        }, 250);
    }

    function getData() {

        firstPage();

        if (vm.query.length>0) {
            vm.loadingInitialPage = true;
            openmrsRest.listFull(vm.resource, {
                limit: vm.entriesPerPage,
                includeAll: true,
                q: vm.query,
                v: 'full'
            }).then(function (firstResponse) {
                vm.loadingInitialPage = false;
                vm.isUserTyping = false;
                vm.data = firstResponse.results;

                var isThisOnePageSet = vm.data.length < vm.entriesPerPage;

                //Check for more data
                if (!isThisOnePageSet) {
                    vm.loadingMorePages = true;
                    openmrsRest.listFull(vm.resource, {includeAll: true, q: vm.query}).then(function (response) {
                        vm.data = response.results;
                        vm.loadingMorePages = false;
                    });
                }
            });
        }
        else {
            if (vm.isUserTyping) {
                vm.isUserTyping = false;
                $scope.$apply(function () {
                    vm.data = '';
                })
            }
        }
    }

    //Paging logic:
    vm.sliceFrom = sliceFrom;
    vm.sliceTo = sliceTo;
    vm.page = 1;
    vm.nextPage = nextPage;
    vm.prevPage = prevPage;
    vm.firstPage = firstPage;
    vm.lastPage = lastPage;
    vm.loadingMorePages = false;
    vm.totalPages = totalPages;
    vm.enableDetails = false;
    vm.loadingInitialPage = false;

    function sliceFrom() {
        return vm.page * vm.entriesPerPage - vm.entriesPerPage;
    }
    function sliceTo() {
        return vm.page * vm.entriesPerPage;
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
        if (vm.data.length % vm.entriesPerPage == 0) {
            vm.page = Math.floor(vm.data.length / vm.entriesPerPage);
        }
        else {
            vm.page = Math.floor(vm.data.length / vm.entriesPerPage) + 1;
        }
    }
    function totalPages() {

        if (vm.data.length % vm.entriesPerPage == 0) {
            return Math.floor(vm.data.length / vm.entriesPerPage);
        }
        else {
            return Math.floor(vm.data.length / vm.entriesPerPage) + 1;
        }
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
        return vm.sliceTo() < vm.data.length;
    }
    function isFirstPagePossible() {
        return vm.page > 1
    }
    function isLastPagePossible() {
        if (vm.data.length % vm.entriesPerPage == 0) {
            return vm.page < Math.floor(vm.data.length / vm.entriesPerPage);
        }
        else {
            return vm.page < Math.floor(vm.data.length / vm.entriesPerPage) + 1;
        }
    }

    //ng-show logic
    vm.isWholeNavigationPanelVisible = isWholeNavigationPanelVisible;
    vm.isSecondLoaderNotificationVisible =isSecondLoaderNotificationVisible;
    vm.isInitialLoaderImageNotificationVisible = isInitialLoaderImageNotificationVisible;
    vm.isButtonPanelVisible = isButtonPanelVisible;
    vm.notificationEmptyQuery = notificationEmptyQuery;
    vm.notificationNoEntriesFound = notificationNoEntriesFound;
    vm.notificationLoading = notificationLoading;
    vm.showTable = showTable;
    vm.showList = showList;

    function showList() {
        return vm.type == 'list' && vm.data.length > 0 && vm.query.length > 0;
    }
    
    function showTable() {
        return vm.type == 'table' && vm.data.length > 0 && vm.query.length > 0;
    }
    
    function notificationLoading() {
        return vm.isUserTyping && vm.query.length > 0;
    }
    function notificationNoEntriesFound() {
        return vm.query.length > 0 && vm.data.length == 0 && !vm.isUserTyping;
    }

    function notificationEmptyQuery() {
        return vm.query.length == 0 && vm.data.length == 0
    }
    
    function isWholeNavigationPanelVisible() {
        return vm.query.length > 0 && !vm.isThisOnePageSet && vm.data.length !== 10 && (!vm.loadingMorePages || !vm.loadingInitialPage);
    }
    function isSecondLoaderNotificationVisible() {
        return vm.loadingMorePages;
    }
    function isInitialLoaderImageNotificationVisible() {
        return vm.loadingInitialPage;
    }
    function isButtonPanelVisible() {
        return !isSecondLoaderNotificationVisible() && !isInitialLoaderImageNotificationVisible() && vm.data.length > 0;
    }

}